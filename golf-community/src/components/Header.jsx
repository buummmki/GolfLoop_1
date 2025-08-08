import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Menu, X, User, Search } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-600">GolfLoop</h1>
            </div>
          </div>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              홈
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              게시판
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              라운딩 모집
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              골프장 정보
            </a>
            <a href="#" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              중고 장터
            </a>
          </nav>

          {/* 검색 및 사용자 메뉴 */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-600">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-600">
              <User className="h-5 w-5" />
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              로그인
            </Button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
              <a href="#" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                홈
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                게시판
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                라운딩 모집
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                골프장 정보
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium">
                중고 장터
              </a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  로그인
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

