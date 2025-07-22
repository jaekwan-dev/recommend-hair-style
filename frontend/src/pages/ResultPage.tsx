import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, Info } from 'lucide-react'
import { FaceAnalysisResult, GenderType } from '../types'

const ResultPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const { 
    gender, 
    selectedImage, 
    imagePreview, 
    analysisResult 
  } = location.state as {
    gender: GenderType
    selectedImage: File
    imagePreview: string
    analysisResult: FaceAnalysisResult
  }

  // 필수 데이터가 없으면 처음부터 다시 시작
  if (!gender || !analysisResult) {
    navigate('/')
    return null
  }

  const handleViewRecommendations = () => {
    navigate('/recommendations', {
      state: {
        gender,
        selectedImage,
        imagePreview,
        analysisResult,
      },
    })
  }

  const faceShapeNames = {
    oval: '타원형',
    round: '둥근형', 
    oblong: '긴형',
    square: '각진형',
    heart: '하트형',
    inverted_triangle: '역삼각형',
  }

  const faceShapeDescriptions = {
    oval: '이상적인 얼굴형으로 균형잡힌 비율을 가지고 있어요. 대부분의 헤어스타일이 잘 어울립니다.',
    round: '부드러운 곡선과 넓은 볼이 특징이에요. 얼굴을 길어보이게 하는 스타일이 좋습니다.',
    oblong: '세로가 가로보다 긴 얼굴형이에요. 옆볼륨을 살려주는 스타일이 어울립니다.',
    square: '뚜렷한 턱선과 넓은 이마가 특징이에요. 부드러운 라인의 스타일이 좋습니다.',
    heart: '넓은 이마와 뾰족한 턱이 특징이에요. 볼륨을 아래쪽에 두는 스타일이 어울립니다.',
    inverted_triangle: '좁은 이마와 넓은 턱선이 특징이에요. 상단에 볼륨을 주는 스타일이 좋습니다.',
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 진행 상황 */}
      <div className="safe-top px-6 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">4단계 / 4단계</p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 py-4">
        {/* 결과 헤더 */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
            <img
              src={imagePreview}
              alt="분석된 이미지"
              className="w-full h-full object-cover"
            />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            분석 완료!
          </h1>
          <p className="text-gray-600">
            당신의 얼굴형을 분석했어요
          </p>
        </div>

        {/* 얼굴형 결과 카드 */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">얼굴형 분석 결과</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Info className="w-4 h-4 mr-1" />
              신뢰도 {Math.round(analysisResult.confidence * 100)}%
            </div>
          </div>

          <div className="text-center">
            <div className="inline-block bg-primary-100 rounded-full px-6 py-3 mb-4">
              <span className="text-2xl font-bold text-primary-700">
                {faceShapeNames[analysisResult.faceShape]}
              </span>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              {faceShapeDescriptions[analysisResult.faceShape]}
            </p>
          </div>
        </div>

        {/* 다음 단계 안내 */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-2">
            🎨 이제 헤어스타일을 추천받아보세요!
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {faceShapeNames[analysisResult.faceShape]} 얼굴형에 어울리는 
            {gender === 'male' ? ' 남성용' : ' 여성용'} 헤어스타일 3종과 
            연예인 레퍼런스를 준비했어요.
          </p>
        </div>

        {/* 얼굴형별 특징 */}
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-3">
            {faceShapeNames[analysisResult.faceShape]} 얼굴형의 특징
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            {analysisResult.faceShape === 'oval' && (
              <>
                <p>• 이마, 볼, 턱의 폭이 균형적이에요</p>
                <p>• 턱선이 부드럽게 둥글어요</p>
                <p>• 대부분의 헤어스타일이 잘 어울려요</p>
              </>
            )}
            {analysisResult.faceShape === 'round' && (
              <>
                <p>• 얼굴 길이와 폭이 비슷해요</p>
                <p>• 볼이 통통하고 턱선이 둥글어요</p>
                <p>• 세로 라인을 강조하는 스타일이 좋아요</p>
              </>
            )}
            {analysisResult.faceShape === 'heart' && (
              <>
                <p>• 이마가 넓고 턱이 좁아요</p>
                <p>• 하트 모양의 실루엣이에요</p>
                <p>• 아래쪽에 볼륨을 주는 스타일이 어울려요</p>
              </>
            )}
            {/* 다른 얼굴형들도 추가 가능 */}
          </div>
        </div>
      </div>

      {/* 추천받기 버튼 */}
      <div className="safe-bottom p-6">
        <button
          onClick={handleViewRecommendations}
          className="w-full btn-primary flex items-center justify-center gap-2 text-lg py-4"
        >
          헤어스타일 추천받기
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

export default ResultPage 