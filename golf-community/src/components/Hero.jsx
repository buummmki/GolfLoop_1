import { Button } from '@/components/ui/button.jsx'
import { ArrowRight, Users, MapPin, MessageCircle } from 'lucide-react'

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            골프를 사랑하는 사람들의
            <span className="text-green-600 block">특별한 공간</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            라운딩 파트너를 찾고, 골프장 정보를 공유하며, 
            골프 장비를 거래하는 모든 것이 가능한 골프 커뮤니티입니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              지금 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
              둘러보기
            </Button>
          </div>

          {/* 특징 카드들 */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">라운딩 모집</h3>
              <p className="text-gray-600">
                함께 라운딩할 파트너를 찾고, 새로운 골프 친구들을 만나보세요.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">골프장 정보</h3>
              <p className="text-gray-600">
                전국 골프장 정보와 실제 이용 후기를 확인하고 공유하세요.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">커뮤니티</h3>
              <p className="text-gray-600">
                골프 팁, 장비 리뷰, 라운딩 후기 등을 자유롭게 나누세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

