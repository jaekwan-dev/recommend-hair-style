import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronRight, Sparkles, Zap } from 'lucide-react'

const ResultPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { gender, result, imageFile, analysisMethod } = location.state || {}

  // 필수 데이터가 없으면 홈으로 리다이렉트
  if (!result || !gender) {
    navigate('/')
    return null
  }

  const goToRecommendation = () => {
    navigate('/recommendation', {
      state: {
        gender,
        result,
        imageFile,
        analysisMethod
      }
    })
  }

  const getFaceShapeEmoji = (faceShape: string) => {
    const emojiMap: { [key: string]: string } = {
      'oval': '🥚',
      'round': '⭕',
      'oblong': '📏',
      'square': '⬛',
      'heart': '❤️',
      'inverted_triangle': '🔺'
    }
    return emojiMap[faceShape] || '👤'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="container max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            분석 완료! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            당신의 얼굴형이 분석되었습니다
          </p>

          {/* Analysis Result - iPhone 12 Pro 최적화 */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 mb-5">
            <div className="text-5xl mb-3 text-center">
              {getFaceShapeEmoji(result.faceShape)}
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
              {result.faceShape.toUpperCase()}
            </h2>
            <p className="text-gray-700 mb-4 text-sm text-center leading-relaxed">
              {result.description}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>신뢰도: {(result.confidence * 100).toFixed(1)}%</span>
              {analysisMethod && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    {analysisMethod === 'MediaPipe' && <Zap className="w-4 h-4 mr-1 text-yellow-500" />}
                    {analysisMethod}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Additional Info - 더 컴팩트하게 */}
          {result.metadata && (
            <div className="bg-gray-50 rounded-lg p-3 mb-5 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                {result.metadata.analysisMethod === 'MediaPipe' && (
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                )}
                분석 정보
              </h3>
              <div className="text-xs text-gray-600 space-y-1">
                {result.metadata.analysisMethod === 'MediaPipe' && result.metadata.landmarkCount && (
                  <p>• 추출된 랜드마크: {result.metadata.landmarkCount}개</p>
                )}
                {result.metadata.measurements && (
                  <>
                    <p>• 얼굴 가로/세로 비율: {result.metadata.measurements.aspectRatio?.toFixed(3)}</p>
                    <p>• 턱선 각도: {result.metadata.measurements.jawlineAngle?.toFixed(1)}°</p>
                  </>
                )}
                {result.imageInfo && (
                  <p>• 이미지 해상도: {result.imageInfo.width} × {result.imageInfo.height}</p>
                )}
                <p>• 분석 버전: {result.metadata.analysisVersion || '2.0'}</p>
              </div>
            </div>
          )}

          {/* Continue Button - iPhone에 맞게 조정 */}
          <button
            onClick={goToRecommendation}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center group"
          >
            헤어스타일 추천 보기
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Note - 더 컴팩트하게 */}
          <div className="mt-5 p-3 bg-blue-50 rounded-lg text-left">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm">💡 알고 계셨나요?</h3>
            <p className="text-xs text-blue-800 leading-relaxed">
              {result.faceShape === 'oval' && '타원형은 가장 이상적인 얼굴형으로 다양한 헤어스타일이 잘 어울립니다.'}
              {result.faceShape === 'round' && '둥근형 얼굴에는 볼륨감 있는 탑 스타일이나 레이어드 컷이 잘 어울립니다.'}
              {result.faceShape === 'oblong' && '긴 얼굴형에는 사이드 파팅이나 웨이브 스타일이 균형감을 줍니다.'}
              {result.faceShape === 'square' && '각진 얼굴형에는 부드러운 웨이브나 레이어드 컷이 각진 라인을 완화시켜줍니다.'}
              {result.faceShape === 'heart' && '하트형 얼굴에는 턱선 부근에 볼륨을 주는 스타일이 균형감을 만들어줍니다.'}
              {result.faceShape === 'inverted_triangle' && '역삼각형 얼굴에는 이마 부근에 볼륨을 주는 스타일이 좋습니다.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultPage 