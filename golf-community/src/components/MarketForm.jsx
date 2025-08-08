import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Label } from '@/components/ui/label.jsx'
import ImageUpload from './ImageUpload.jsx'
import { marketApi } from '../hooks/useApi.js'

const MarketForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: '',
    category: '',
    brand: '',
    seller: 'test_user' // 임시 사용자명 (나중에 인증 시스템과 연동)
  })
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const conditions = [
    { value: '최상', label: '최상 (거의 새것)' },
    { value: '상', label: '상 (사용감 적음)' },
    { value: '중', label: '중 (일반적인 사용감)' },
    { value: '하', label: '하 (사용감 많음)' }
  ]

  const categories = [
    { value: '드라이버', label: '드라이버' },
    { value: '아이언', label: '아이언' },
    { value: '퍼터', label: '퍼터' },
    { value: '웨지', label: '웨지' },
    { value: '골프백', label: '골프백' },
    { value: '골프화', label: '골프화' },
    { value: '골프웨어', label: '골프웨어' },
    { value: '액세서리', label: '액세서리' },
    { value: '기타', label: '기타' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePriceChange = (value) => {
    // 숫자만 입력 허용
    const numericValue = value.replace(/[^0-9]/g, '')
    setFormData(prev => ({
      ...prev,
      price: numericValue
    }))
  }

  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages || [])
  }

  const formatPrice = (price) => {
    if (!price) return ''
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('상품명을 입력해주세요.')
      return
    }
    
    if (!formData.description.trim()) {
      alert('상품 설명을 입력해주세요.')
      return
    }
    
    if (!formData.price || parseInt(formData.price) <= 0) {
      alert('올바른 가격을 입력해주세요.')
      return
    }
    
    if (!formData.condition) {
      alert('상품 상태를 선택해주세요.')
      return
    }
    
    if (!formData.category) {
      alert('카테고리를 선택해주세요.')
      return
    }

    if (images.length === 0) {
      alert('최소 1개의 상품 이미지를 업로드해주세요.')
      return
    }

    setSubmitting(true)
    
    try {
      const itemData = {
        ...formData,
        price: parseInt(formData.price),
        images: images.map(img => img.url) // 이미지 URL 배열
      }
      
      const result = await marketApi.createItem(itemData)
      
      if (onSubmit) {
        onSubmit(result)
      }
      
      // 폼 초기화
      setFormData({
        title: '',
        description: '',
        price: '',
        condition: '',
        category: '',
        brand: '',
        seller: 'test_user'
      })
      setImages([])
      
      alert('상품이 성공적으로 등록되었습니다!')
      
    } catch (error) {
      console.error('상품 등록 오류:', error)
      alert('상품 등록 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>중고 상품 등록</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 상품 이미지 */}
          <div className="space-y-2">
            <Label>상품 이미지 *</Label>
            <ImageUpload
              multiple={true}
              maxFiles={5}
              onUpload={handleImageUpload}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              첫 번째 이미지가 대표 이미지로 설정됩니다. 최대 5개까지 업로드 가능합니다.
            </p>
          </div>

          {/* 상품명 */}
          <div className="space-y-2">
            <Label htmlFor="title">상품명 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="상품명을 입력하세요"
              maxLength={100}
            />
          </div>

          {/* 카테고리와 브랜드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">브랜드</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="브랜드명 (선택사항)"
                maxLength={50}
              />
            </div>
          </div>

          {/* 가격과 상태 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">가격 *</Label>
              <div className="relative">
                <Input
                  id="price"
                  value={formatPrice(formData.price)}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="0"
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">원</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">상품 상태 *</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="상품 상태를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 상품 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">상품 설명 *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="상품에 대한 자세한 설명을 입력하세요"
              rows={6}
              maxLength={2000}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.description.length}/2000
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                취소
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? '등록 중...' : '상품 등록'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default MarketForm

