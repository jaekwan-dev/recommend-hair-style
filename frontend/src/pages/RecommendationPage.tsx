import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, RotateCcw } from 'lucide-react'
import { recommendationApi } from '../services/api'
import { HairStyleRecommendation, FaceAnalysisResult, GenderType } from '../types'

const RecommendationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const { 
    gender, 
    imagePreview, 
    analysisResult 
  } = location.state as {
    gender: GenderType
    imagePreview: string
    analysisResult: FaceAnalysisResult
  }

  const [recommendations, setRecommendations] = useState<HairStyleRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 필수 데이터가 없으면 처음부터 다시 시작
  if (!gender || !analysisResult) {
    navigate('/')
    return null
  }

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const response = await recommendationApi.getHairStyleRecommendations(
          analysisResult.faceShape,
          gender
        )
        setRecommendations(response.recommendations)
      } catch (err) {
        console.error('추천 데이터 로딩 실패:', err)
        setError('추천 데이터를 불러오는데 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [analysisResult.faceShape, gender])

  const handleBack = () => {
    navigate(-1)
  }

  const handleStartOver = () => {
    navigate('/')
  }

  const faceShapeNames = {
    oval: '타원형',
    round: '둥근형',
    oblong: '긴형', 
    square: '각진형',
    heart: '하트형',
    inverted_triangle: '역삼각형',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">추천 스타일을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={handleBack} className="btn-primary">
          이전으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="safe-top bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">추천 결과</h1>
          <button
            onClick={handleStartOver}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 내 정보 요약 */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-md">
            <img
              src={imagePreview}
              alt="내 사진"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {faceShapeNames[analysisResult.faceShape]} 얼굴형
            </h2>
            <p className="text-sm text-gray-600">
              {gender === 'male' ? '남성' : '여성'} • 
              신뢰도 {Math.round(analysisResult.confidence * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* 추천 결과 */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            당신에게 어울리는 헤어스타일
          </h3>
          <span className="text-sm text-gray-500">
            총 {recommendations.length}개 추천
          </span>
        </div>

        <div className="space-y-6">
          {recommendations.map((recommendation, index) => (
            <StyleRecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              index={index}
            />
          ))}
        </div>

        {recommendations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              현재 이 얼굴형에 대한 추천 데이터가 준비중입니다.
            </p>
            <button onClick={handleStartOver} className="btn-primary">
              다시 시작하기
            </button>
          </div>
        )}
      </div>

      {/* 하단 액션 버튼 */}
      {recommendations.length > 0 && (
        <div className="safe-bottom bg-white border-t border-gray-200 p-6">
          <div className="flex gap-3">
            <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              저장하기
            </button>
            <button className="flex-1 btn-primary flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              공유하기
            </button>
          </div>
          <button
            onClick={handleStartOver}
            className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            새로운 분석 시작하기
          </button>
        </div>
      )}
    </div>
  )
}

const StyleRecommendationCard = ({ 
  recommendation, 
  index 
}: { 
  recommendation: HairStyleRecommendation
  index: number 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-bold">{index + 1}</span>
            </div>
            <h4 className="text-lg font-bold text-gray-800">
              {recommendation.name}
            </h4>
          </div>
          <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Heart className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {recommendation.description}
        </p>
      </div>

      {/* 스타일 이미지 */}
      <div className="aspect-w-16 aspect-h-10 bg-gray-100">
        <div className="flex items-center justify-center text-gray-400">
          {/* 실제로는 recommendation.imageUrl에서 이미지 로드 */}
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-2"></div>
            <p className="text-sm">헤어스타일 이미지</p>
          </div>
        </div>
      </div>

      {/* 연예인 레퍼런스 */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
            {/* 실제로는 recommendation.celebrity.imageUrl에서 이미지 로드 */}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              연예인 레퍼런스
            </p>
            <p className="text-sm text-gray-600">
              {recommendation.celebrity.name}
            </p>
          </div>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {recommendation.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecommendationPage 