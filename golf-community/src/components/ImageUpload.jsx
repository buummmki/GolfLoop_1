import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

const ImageUpload = ({ 
  onUpload, 
  multiple = false, 
  maxFiles = 5, 
  className = "",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return

    const fileArray = Array.from(files)
    
    // 파일 개수 제한 확인
    if (multiple && fileArray.length > maxFiles) {
      alert(`최대 ${maxFiles}개 파일까지 업로드 가능합니다.`)
      return
    }

    // 파일 크기 및 형식 검증
    const validFiles = []
    for (const file of fileArray) {
      if (file.size > maxSize) {
        alert(`${file.name}: 파일 크기가 너무 큽니다. 최대 ${maxSize / (1024 * 1024)}MB까지 업로드 가능합니다.`)
        continue
      }
      
      if (!file.type.startsWith('image/')) {
        alert(`${file.name}: 이미지 파일만 업로드 가능합니다.`)
        continue
      }
      
      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      uploadFiles(validFiles)
    }
  }

  const uploadFiles = async (files) => {
    setUploading(true)
    
    try {
      if (multiple && files.length > 1) {
        // 다중 파일 업로드
        const formData = new FormData()
        files.forEach(file => {
          formData.append('files', file)
        })

        const response = await fetch('/api/upload/multiple', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()
        
        if (result.success) {
          const newImages = result.uploaded_files.map(file => ({
            url: file.file_url,
            filename: file.filename,
            originalName: file.original_filename,
            size: file.file_size
          }))
          
          setUploadedImages(prev => [...prev, ...newImages])
          
          if (onUpload) {
            onUpload(multiple ? newImages : newImages[0])
          }
          
          if (result.errors && result.errors.length > 0) {
            alert('일부 파일 업로드 실패:\n' + result.errors.join('\n'))
          }
        } else {
          throw new Error(result.error || '업로드 실패')
        }
      } else {
        // 단일 파일 업로드
        const formData = new FormData()
        formData.append('file', files[0])

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()
        
        if (result.success) {
          const newImage = {
            url: result.file_url,
            filename: result.filename,
            originalName: result.original_filename,
            size: result.file_size
          }
          
          setUploadedImages(prev => multiple ? [...prev, newImage] : [newImage])
          
          if (onUpload) {
            onUpload(newImage)
          }
        } else {
          throw new Error(result.error || '업로드 실패')
        }
      }
    } catch (error) {
      console.error('업로드 오류:', error)
      alert('파일 업로드 중 오류가 발생했습니다: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = async (index, filename) => {
    try {
      // 서버에서 파일 삭제
      await fetch(`/api/delete/${filename}`, {
        method: 'DELETE',
      })
      
      // 로컬 상태에서 제거
      const newImages = uploadedImages.filter((_, i) => i !== index)
      setUploadedImages(newImages)
      
      if (onUpload) {
        onUpload(multiple ? newImages : null)
      }
    } catch (error) {
      console.error('파일 삭제 오류:', error)
      alert('파일 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 업로드 영역 */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragOver 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              <p className="text-sm text-gray-600">업로드 중...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  클릭하거나 파일을 드래그하여 업로드
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, JPEG, GIF, WEBP (최대 {maxSize / (1024 * 1024)}MB)
                  {multiple && ` • 최대 ${maxFiles}개 파일`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* 업로드된 이미지 미리보기 */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">업로드된 이미지</h4>
          <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
            {uploadedImages.map((image, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative">
                    <img
                      src={image.url}
                      alt={image.originalName}
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index, image.filename)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <p className="truncate" title={image.originalName}>
                      {image.originalName}
                    </p>
                    <p>{formatFileSize(image.size)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload

