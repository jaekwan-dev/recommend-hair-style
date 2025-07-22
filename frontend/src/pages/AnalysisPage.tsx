import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Loader, AlertCircle, RefreshCw, Camera } from 'lucide-react'
import { faceAnalysisApi } from '../services/api'

interface AnalysisError {
  message: string
  statusCode?: number
  suggestions?: string[]
}

const AnalysisPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('준비 중...')
  const [error, setError] = useState<AnalysisError | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const maxRetries = 2
  const { gender, imageFile } = location.state || {}

  const analyzeImage = async (isRetry = false) => {
    if (!imageFile || !gender) {
      setError({
        message: '필요한 정보가 없습니다.',
        suggestions: ['이전 단계로 돌아가서 다시 시도해주세요.']
      })
      return
    }

    try {
      if (isRetry) {
        setIsRetrying(true)
        setStage('재시도 중...')
      } else {
        setProgress(0)
        setStage('이미지 검증 중...')
      }
      
      setError(null)

      // 진행률 시뮬레이션
      const progressSteps = [
        { progress: 10, stage: '이미지 검증 중...' },
        { progress: 30, stage: '얼굴 영역 검출 중...' },
        { progress: 50, stage: '특징점 추출 중...' },
        { progress: 70, stage: '얼굴형 분석 중...' },
        { progress: 90, stage: '결과 생성 중...' }
      ]

      let currentStep = 0
      const progressInterval = setInterval(() => {
        if (currentStep < progressSteps.length) {
          const { progress: newProgress, stage: newStage } = progressSteps[currentStep]
          setProgress(newProgress)
          setStage(newStage)
          currentStep++
        } else {
          clearInterval(progressInterval)
        }
      }, 800)

      const formData = new FormData()
      formData.append('image', imageFile)

      const result = await faceAnalysisApi.analyzeFace(formData)
      
      clearInterval(progressInterval)
      setProgress(100)
      setStage('분석 완료!')

      // 결과 페이지로 이동
      setTimeout(() => {
        navigate('/result', {
          state: {
            gender,
            result,
            imageFile
          }
        })
      }, 500)

    } catch (err: any) {
      setIsRetrying(false)
      
      // 상세한 에러 처리
      let errorInfo: AnalysisError = {
        message: '분석 중 오류가 발생했습니다.',
        suggestions: ['잠시 후 다시 시도해주세요.']
      }

      if (err.response?.data) {
        const { message, statusCode } = err.response.data
        errorInfo.message = message || errorInfo.message
        errorInfo.statusCode = statusCode

        // 상태 코드별 맞춤형 해결책 제공
        switch (statusCode) {
          case 400:
            if (message.includes('해상도')) {
              errorInfo.suggestions = [
                '더 고화질의 이미지를 사용해주세요 (최소 200x200)',
                '다른 각도에서 촬영한 사진을 시도해보세요.'
              ]
            } else if (message.includes('파일')) {
              errorInfo.suggestions = [
                'JPEG, PNG 형식의 이미지를 사용해주세요.',
                '파일 크기가 10MB 이하인지 확인해주세요.'
              ]
            } else if (message.includes('비율')) {
              errorInfo.suggestions = [
                '정사각형에 가까운 이미지를 사용해주세요.',
                '얼굴이 중앙에 위치한 사진을 선택해주세요.'
              ]
            } else {
              errorInfo.suggestions = [
                '다른 이미지로 다시 시도해주세요.',
                '얼굴이 선명하게 보이는 사진을 사용해주세요.'
              ]
            }
            break
          
          case 500:
            errorInfo.suggestions = [
              '서버에 일시적인 문제가 있습니다.',
              '잠시 후 다시 시도해주세요.',
              '문제가 지속되면 고객지원에 문의해주세요.'
            ]
            break
          
          default:
            if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
              errorInfo.message = '네트워크 연결을 확인해주세요.'
              errorInfo.suggestions = [
                '인터넷 연결 상태를 확인해주세요.',
                'Wi-Fi 또는 모바일 데이터를 확인해주세요.'
              ]
            }
        }
      }

      setError(errorInfo)
      setProgress(0)
      setStage('분석 실패')

      console.error('Face analysis error:', err)
    }
  }

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1)
      analyzeImage(true)
    }
  }

  const goBackToCamera = () => {
    navigate('/camera', { state: { gender } })
  }

  useEffect(() => {
    analyzeImage()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="container max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              분석에 실패했습니다
            </h1>
            
            <p className="text-gray-600 mb-4">{error.message}</p>
            
            {error.suggestions && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">💡 해결 방법</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  {error.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              {retryCount < maxRetries && (
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isRetrying ? (
                    <>
                      <Loader className="animate-spin w-5 h-5 mr-2" />
                      재시도 중... ({retryCount + 1}/{maxRetries})
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      다시 시도 ({retryCount + 1}/{maxRetries})
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={goBackToCamera}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                다른 사진 선택
              </button>
            </div>

            {error.statusCode && (
              <p className="text-xs text-gray-400 mt-4">
                오류 코드: {error.statusCode}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="container max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-purple-600 animate-pulse" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            얼굴형 분석 중
          </h1>
          
          <p className="text-gray-600 mb-8">
            AI가 당신의 얼굴을 분석하고 있습니다
          </p>

          {/* 진행률 바 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{stage}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 분석 단계 안내 */}
          <div className="bg-gray-50 rounded-xl p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">🔍 분석 과정</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className={`flex items-center ${progress >= 10 ? 'text-purple-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 10 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                이미지 품질 검증
              </div>
              <div className={`flex items-center ${progress >= 30 ? 'text-purple-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 30 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                얼굴 영역 탐지
              </div>
              <div className={`flex items-center ${progress >= 50 ? 'text-purple-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 50 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                특징점 추출
              </div>
              <div className={`flex items-center ${progress >= 70 ? 'text-purple-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 70 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                얼굴형 분류
              </div>
              <div className={`flex items-center ${progress >= 90 ? 'text-purple-600' : ''}`}>
                <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 90 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                결과 생성
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            잠시만 기다려주세요...
          </p>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage 