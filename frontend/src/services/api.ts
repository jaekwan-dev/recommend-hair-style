import axios from 'axios'
import { FaceAnalysisResult, RecommendationResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30초 타임아웃
})

// 요청 인터셉터
api.interceptors.request.use((config) => {
  console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`)
  return config
})

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log(`API 응답: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('API 에러:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const faceAnalysisApi = {
  /**
   * 얼굴 이미지 분석
   */
  analyzeFace: async (imageFile: File): Promise<FaceAnalysisResult> => {
    const formData = new FormData()
    formData.append('image', imageFile)

    const response = await api.post<FaceAnalysisResult>('/face-analysis/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },
}

export const recommendationApi = {
  /**
   * 헤어스타일 추천 조회
   */
  getHairStyleRecommendations: async (
    faceShape: string,
    gender: 'male' | 'female'
  ): Promise<RecommendationResponse> => {
    const response = await api.get<RecommendationResponse>('/recommendations/hair-styles', {
      params: {
        faceShape,
        gender,
      },
    })

    return response.data
  },

  /**
   * 연예인 레퍼런스 조회
   */
  getCelebrityReferences: async (styleId: string) => {
    const response = await api.get(`/recommendations/celebrities`, {
      params: {
        styleId,
      },
    })

    return response.data
  },
}

export default api 