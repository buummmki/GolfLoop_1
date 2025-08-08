import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, Clock, MapPin, Star, Users, MessageSquare, ShoppingBag } from 'lucide-react'

const FeaturedSection = () => {
  const recentRounds = [
    {
      id: 1,
      title: "주말 라운딩 모집 (3명)",
      course: "레이크사이드 컨트리클럽",
      date: "2025-08-10",
      time: "오전 7:00",
      participants: 1,
      maxParticipants: 4,
      status: "모집중"
    },
    {
      id: 2,
      title: "평일 오후 라운딩",
      course: "스카이힐 골프클럽",
      date: "2025-08-12",
      time: "오후 1:30",
      participants: 2,
      maxParticipants: 4,
      status: "모집중"
    }
  ]

  const recentPosts = [
    {
      id: 1,
      title: "초보자를 위한 드라이버 선택 가이드",
      author: "골프마스터",
      category: "장비 리뷰",
      likes: 24,
      comments: 8,
      time: "2시간 전"
    },
    {
      id: 2,
      title: "남양주 골프장 라운딩 후기",
      author: "라운딩킹",
      category: "라운딩 후기",
      likes: 15,
      comments: 5,
      time: "4시간 전"
    }
  ]

  const marketItems = [
    {
      id: 1,
      title: "타이틀리스트 드라이버 (거의 새것)",
      price: "350,000원",
      condition: "최상",
      image: "/api/placeholder/200/150",
      seller: "골프러버"
    },
    {
      id: 2,
      title: "캘러웨이 아이언 세트",
      price: "800,000원",
      condition: "상",
      image: "/api/placeholder/200/150",
      seller: "프로골퍼"
    }
  ]

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
            {recentRounds.map((round) => (
              <Card key={round.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{round.title}</CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {round.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {round.course}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {round.date}
                      <Clock className="h-4 w-4 ml-4 mr-2" />
                      {round.time}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {round.participants}/{round.maxParticipants}명
                      </div>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        참여하기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            {recentPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardDescription>
                    {post.author} • {post.time}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {post.likes}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {post.comments}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            {marketItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-32 h-32 bg-gray-200 rounded-l-lg flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-2xl font-bold text-green-600 mb-2">{item.price}</p>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <Badge variant="secondary">{item.condition}</Badge>
                        <span>{item.seller}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedSection

