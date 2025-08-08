import { useState, useEffect } from 'react'

// 환경에 따른 API 베이스 URL 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// API 호출을 위한 기본 함수
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// 데이터 페칭을 위한 커스텀 훅
export const useApi = (endpoint, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await apiCall(endpoint)
        setData(result)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: () => fetchData() }
}

// 게시글 관련 API 함수들
export const postsApi = {
  // 게시글 목록 조회
  getPosts: (page = 1, limit = 10, category = '') => {
    const params = new URLSearchParams({ page, limit })
    if (category) params.append('category', category)
    return apiCall(`/posts?${params}`)
  },

  // 특정 게시글 조회
  getPost: (id) => apiCall(`/posts/${id}`),

  // 게시글 작성
  createPost: (postData) => apiCall('/posts', {
    method: 'POST',
    body: postData,
  }),

  // 댓글 추가
  addComment: (postId, commentData) => apiCall(`/posts/${postId}/comments`, {
    method: 'POST',
    body: commentData,
  }),

  // 좋아요 토글
  toggleLike: (postId, userId) => apiCall(`/posts/${postId}/like`, {
    method: 'POST',
    body: { user_id: userId },
  }),
}

// 라운딩 모집 관련 API 함수들
export const roundsApi = {
  // 라운딩 모집 목록 조회
  getRounds: (page = 1, limit = 10, status = '') => {
    const params = new URLSearchParams({ page, limit })
    if (status) params.append('status', status)
    return apiCall(`/rounds?${params}`)
  },

  // 특정 라운딩 모집 조회
  getRound: (id) => apiCall(`/rounds/${id}`),

  // 라운딩 모집 등록
  createRound: (roundData) => apiCall('/rounds', {
    method: 'POST',
    body: roundData,
  }),

  // 라운딩 참여
  joinRound: (roundId, userId) => apiCall(`/rounds/${roundId}/join`, {
    method: 'POST',
    body: { user_id: userId },
  }),

  // 라운딩 참여 취소
  leaveRound: (roundId, userId) => apiCall(`/rounds/${roundId}/leave`, {
    method: 'POST',
    body: { user_id: userId },
  }),
}

// 중고 장터 관련 API 함수들
export const marketApi = {
  // 상품 목록 조회
  getItems: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit })
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return apiCall(`/market?${params}`)
  },

  // 특정 상품 조회
  getItem: (id) => apiCall(`/market/${id}`),

  // 상품 등록
  createItem: (itemData) => apiCall('/market', {
    method: 'POST',
    body: itemData,
  }),

  // 상품 수정
  updateItem: (id, itemData) => apiCall(`/market/${id}`, {
    method: 'PUT',
    body: itemData,
  }),

  // 상품 삭제
  deleteItem: (id) => apiCall(`/market/${id}`, {
    method: 'DELETE',
  }),
}

// 골프장 관련 API 함수들
export const golfCoursesApi = {
  // 골프장 목록 조회
  getCourses: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit })
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return apiCall(`/golf-courses?${params}`)
  },

  // 특정 골프장 조회
  getCourse: (id) => apiCall(`/golf-courses/${id}`),

  // 골프장 등록
  createCourse: (courseData) => apiCall('/golf-courses', {
    method: 'POST',
    body: courseData,
  }),

  // 리뷰 추가
  addReview: (courseId, reviewData) => apiCall(`/golf-courses/${courseId}/reviews`, {
    method: 'POST',
    body: reviewData,
  }),

  // 리뷰 목록 조회
  getReviews: (courseId) => apiCall(`/golf-courses/${courseId}/reviews`),
}

// 이미지 업로드 관련 API 함수들
export const uploadApi = {
  // 단일 파일 업로드
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },

  // 다중 파일 업로드
  uploadMultipleFiles: async (files) => {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    
    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  },

  // 파일 삭제
  deleteFile: (filename) => apiCall(`/delete/${filename}`, {
    method: 'DELETE',
  }),
}

export default apiCall

