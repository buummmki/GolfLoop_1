import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, Clock, MapPin, Star, Users, MessageSquare, ShoppingBag } from 'lucide-react'
import { roundsApi, postsApi, marketApi } from '../hooks/useApi.js'

const FeaturedSection = () => {
  const [rounds, setRounds] = useState([])
  const [posts, setPosts] = useState([])
  const [marketItems, setMarketItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 병렬로 데이터 가져오기
        const [roundsData, postsData, marketData] = await Promise.all([
          roundsApi.getRounds(1, 2), // 최신 2개만
          postsApi.getPosts(1, 2),   // 최신 2개만
          marketApi.getItems(1, 2)   // 최신 2개만
        ])

        setRounds(roundsData.rounds || [])
        setPosts(postsData.posts || [])
        setMarketItems(marketData.items || [])
      } catch (error) {
        console.error('데이터 로딩 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-8"></div>
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 라운딩 모집 섹션 */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">최신 라운딩 모집</h2>
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              전체보기
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {rounds.length > 0 ? rounds.map((round) => (
              <Card key={round._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{round.title}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {round.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {round.golfCourse}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(round.date)}
                      <Clock className="h-4 w-4 ml-4 mr-2" />
                      {round.time}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {round.participants_count}/{round.maxParticipants}명
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        참여하기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                등록된 라운딩 모집이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 인기 게시글 섹션 */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">인기 게시글</h2>
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              전체보기
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {posts.length > 0 ? posts.map((post) => (
              <Card key={post._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardDescription>
                    {post.author} • {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {post.likes_count}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments_count}
                    </div>
                    <div className="flex items-center">
                      <span>조회 {post.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                등록된 게시글이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 중고 장터 섹션 */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">중고 장터</h2>
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              전체보기
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {marketItems.length > 0 ? marketItems.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-32 h-32 bg-gray-200 rounded-l-lg flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-2xl font-bold text-green-600 mb-2">{formatPrice(item.price)}</p>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <Badge variant="secondary">{item.condition}</Badge>
                        <span>{item.seller}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                등록된 상품이 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedSection

