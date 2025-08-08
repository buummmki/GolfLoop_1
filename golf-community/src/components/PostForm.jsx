import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Label } from '@/components/ui/label.jsx'
import ImageUpload from './ImageUpload.jsx'
import { postsApi } from '../hooks/useApi.js'

const PostForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: 'test_user' // 임시 사용자명 (나중에 인증 시스템과 연동)
  })
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    { value: '라운딩 후기', label: '라운딩 후기' },
    { value: '장비 리뷰', label: '장비 리뷰' },
    { value: '레슨 공유', label: '레슨 공유' },
    { value: '자유 게시판', label: '자유 게시판' },
    { value: '질문/답변', label: '질문/답변' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (uploadedImages) => {
    setImages(uploadedImages || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.')
      return
    }
    
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.')
      return
    }
    
    if (!formData.category) {
      alert('카테고리를 선택해주세요.')
      return
    }

    setSubmitting(true)
    
    try {
      const postData = {
        ...formData,
        images: images.map(img => img.url) // 이미지 URL 배열
      }
      
      const result = await postsApi.createPost(postData)
      
      if (onSubmit) {
        onSubmit(result)
      }
      
      // 폼 초기화
      setFormData({
        title: '',
        content: '',
        category: '',
        author: 'test_user'
      })
      setImages([])
      
      alert('게시글이 성공적으로 작성되었습니다!')
      
    } catch (error) {
      console.error('게시글 작성 오류:', error)
      alert('게시글 작성 중 오류가 발생했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>새 게시글 작성</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="게시글 제목을 입력하세요"
              maxLength={100}
            />
          </div>

          {/* 카테고리 */}
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

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">내용 *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="게시글 내용을 입력하세요"
              rows={8}
              maxLength={5000}
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.content.length}/5000
            </div>
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <Label>이미지 첨부</Label>
            <ImageUpload
              multiple={true}
              maxFiles={5}
              onUpload={handleImageUpload}
              className="w-full"
            />
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
              {submitting ? '작성 중...' : '게시글 작성'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default PostForm

