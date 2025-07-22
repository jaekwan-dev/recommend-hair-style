import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, RotateCcw } from 'lucide-react'
import { recommendationApi } from '../services/api'
import { HairStyleRecommendation } from '../types'
import CelebrityImage from '../components/CelebrityImage'

const RecommendationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const { 
    gender, 
    result,
    imageFile
  } = location.state || {}

  const [recommendations, setRecommendations] = useState<HairStyleRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 필수 데이터가 없으면 처음부터 다시 시작
  if (!gender || !result) {
    navigate('/')
    return null
  }

  // 이미지 미리보기 생성
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(imageFile)
    }
  }, [imageFile])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const response = await recommendationApi.getHairStyleRecommendations(
          result.faceShape,
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
  }, [result.faceShape, gender])

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
          <p className="text-gray-600">🌟 실제 연예인 사진과 함께<br/>추천 스타일을 준비하고 있어요...</p>
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
          <h1 className="text-lg font-semibold text-gray-800">🌟 AI 스타일 추천</h1>
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
              src={imagePreview || result.imageUrl}
              alt="내 사진"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              {faceShapeNames[result.faceShape as keyof typeof faceShapeNames]} 얼굴형
            </h2>
            <p className="text-sm text-gray-600">
              {gender === 'male' ? '남성' : '여성'} • 
              신뢰도 {Math.round(result.confidence * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* 추천 결과 */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            당신에게 어울리는 헤어스타일
          </h3>
          <span className="text-sm text-gray-500">
            총 {recommendations.length}개 추천
          </span>
        </div>

        {/* 얼굴형 설명 및 팁 */}
        {loading === false && recommendations.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">💡 얼굴형 특징</h4>
            <p className="text-sm text-blue-800 mb-3">
              {/* 백엔드에서 faceShapeDescription을 받아서 표시 */}
              {result.faceShape === 'round' && '볼살이 많고 턱선이 둥근 얼굴형입니다.'}
              {result.faceShape === 'oblong' && '턱선이 길고 이마가 높은 긴 얼굴형입니다.'}
              {result.faceShape === 'square' && '턱이 각지고 넓은 이마를 가진 각진 얼굴형입니다.'}
              {result.faceShape === 'inverted_triangle' && '턱이 좁고 이마가 넓은 역삼각형 얼굴형입니다.'}
              {result.faceShape === 'heart' && '광대가 도드라지고 턱이 좁은 하트형 얼굴형입니다.'}
              {result.faceShape === 'oval' && '이상적인 비율을 가진 균형잡힌 타원형 얼굴입니다.'}
            </p>
            <h5 className="font-semibold text-blue-900 mb-2">📋 스타일링 팁</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              {result.faceShape === 'round' && (
                <>
                  <li>• 윗머리에 볼륨을 주어 얼굴이 길어보이게 하세요</li>
                  <li>• 투블럭+다운펌은 피하는 것이 좋습니다</li>
                  <li>• 수직 라인을 강조하는 스타일을 선택하세요</li>
                </>
              )}
              {result.faceShape === 'oblong' && (
                <>
                  <li>• 앞머리를 추가하면 비율 보정에 효과적입니다</li>
                  <li>• 너무 볼륨감 있는 윗머리 스타일은 피하세요</li>
                  <li>• 가로폭을 넓어보이게 하는 스타일을 선택하세요</li>
                </>
              )}
              {result.faceShape === 'square' && (
                <>
                  <li>• 부드러운 라인으로 각진 부분을 완화시키세요</li>
                  <li>• 너무 각진 스타일은 각을 더 부각시킬 수 있습니다</li>
                  <li>• 레이어드나 웨이브로 부드러움을 연출하세요</li>
                </>
              )}
              {result.faceShape === 'inverted_triangle' && (
                <>
                  <li>• 턱선 부근에 볼륨을 주어 균형을 맞추세요</li>
                  <li>• 이마를 드러내는 스타일은 피하는 것이 좋습니다</li>
                  <li>• 앞머리나 사이드 볼륨으로 균형을 잡으세요</li>
                </>
              )}
              {result.faceShape === 'heart' && (
                <>
                  <li>• 턱선을 강조하는 스타일로 균형을 맞추세요</li>
                  <li>• 머리를 뒤로 넘기는 포마드류는 피하세요</li>
                  <li>• 부드러운 라인으로 각진 부분을 완화하세요</li>
                </>
              )}
              {result.faceShape === 'oval' && (
                <>
                  <li>• 대부분의 스타일이 잘 어울립니다</li>
                  <li>• 본인의 취향과 라이프스타일에 맞게 선택하세요</li>
                  <li>• 다양한 스타일 도전이 가능한 얼굴형입니다</li>
                </>
              )}
            </ul>
          </div>
        )}

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
        
        {/* 왜 어울리는지 설명 */}
        {recommendation.suitabilityReason && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-semibold">💡 추천 이유:</span> {recommendation.suitabilityReason}
            </p>
          </div>
        )}
      </div>

      {/* 🌟 실제 연예인 사진! */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
        {/* 연예인 레퍼런스 헤더 */}
        <div className="text-center mb-4">
          <h5 className="text-lg font-bold text-gray-900 mb-1">🌟 연예인 레퍼런스</h5>
          <p className="text-sm text-gray-600">이 스타일을 완벽하게 소화한 연예인</p>
        </div>
        
        {/* 큰 연예인 사진 */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <CelebrityImage 
              name={recommendation.celebrity.name}
              className="w-32 h-32 shadow-xl border-4 border-white"
            />
            {/* 이름 배지 */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                {recommendation.celebrity.name}
              </div>
            </div>
          </div>
          
          {/* 스타일 설명 */}
          <div className="text-center max-w-xs">
            <p className="text-sm text-gray-700 font-medium mb-2">
              "{recommendation.name}" 스타일의 완벽한 예시
            </p>
            <p className="text-xs text-gray-500">
              실제 연예인 사진으로 스타일을 미리 확인하세요
            </p>
          </div>
        </div>

        {/* 태그들을 연예인 사진 아래로 이동 */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {recommendation.tags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-gray-800 text-sm rounded-full font-medium shadow-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecommendationPage 