import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Loader, AlertCircle, RefreshCw, Camera, Zap } from 'lucide-react'
import { faceAnalysisApi } from '../services/api'
import { mediaPipeService } from '../services/mediapipe.service'

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
  const [analysisMethod, setAnalysisMethod] = useState<'mediapipe' | 'api' | 'fallback'>('mediapipe')

  const maxRetries = 2
  const { gender, imageFile } = location.state || {}

  // 디버깅을 위해 state 정보 로그
  useEffect(() => {
    addDebugLog(`전달받은 state: ${JSON.stringify({
      hasGender: !!gender,
      hasImageFile: !!imageFile,
      imageFileName: imageFile?.name || 'N/A',
      imageFileSize: imageFile?.size || 'N/A'
    })}`)
  }, [])

  // 디버그 로그 추가 함수
  const addDebugLog = (message: string, type: 'info' | 'warn' | 'error' = 'info') => {
    const timestamp = new Date().toISOString().substring(11, 23)
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`
    console.log(logMessage)
  }

  const analyzeWithMediaPipe = async (imageFile: File): Promise<any> => {
    try {
      addDebugLog(`MediaPipe 분석 시작 - 파일: ${imageFile.name}, 크기: ${imageFile.size}bytes, 타입: ${imageFile.type}`)

      setStage('MediaPipe 초기화 중...')
      setProgress(10)
      addDebugLog('MediaPipe 서비스 초기화 시작')

      // MediaPipe 초기화
      await mediaPipeService.initialize()
      addDebugLog('MediaPipe 서비스 초기화 완료')
      setProgress(30)

      setStage('468개 얼굴 랜드마크 추출 중...')
      addDebugLog('얼굴 랜드마크 추출 시작')
      const landmarks = await mediaPipeService.extractLandmarks(imageFile)
      
      if (!landmarks || landmarks.landmarks.length === 0) {
        addDebugLog('MediaPipe에서 얼굴을 감지하지 못함, 백업 API로 전환', 'warn')
        throw new Error('얼굴을 감지할 수 없습니다. 백엔드 API로 전환합니다.')
      }
      
      addDebugLog(`랜드마크 추출 성공 - 개수: ${landmarks.landmarks[0].length}, 이미지 크기: ${landmarks.imageWidth}x${landmarks.imageHeight}`)
      setProgress(70)

      setStage('정밀 얼굴형 분석 중...')
      addDebugLog('얼굴형 분석 시작')
      const analysis = mediaPipeService.analyzeFaceShape(landmarks.landmarks[0])
      addDebugLog(`얼굴형 분석 완료 - 결과: ${analysis.faceShape}, 신뢰도: ${analysis.confidence.toFixed(2)}`)
      setProgress(90)

      // 백엔드 API 형식으로 변환
      const result = {
        faceShape: analysis.faceShape,
        description: analysis.faceShape === 'oval' ? '타원형 - 이상적인 얼굴형으로 균형잡힌 비율을 가지고 있습니다' :
                     analysis.faceShape === 'round' ? '둥근형 - 부드러운 곡선과 풍성한 볼살이 특징입니다' :
                     analysis.faceShape === 'oblong' ? '긴형 - 세로가 가로보다 긴 우아한 얼굴형입니다' :
                     analysis.faceShape === 'square' ? '각진형 - 뚜렷한 턱선과 강인한 인상을 가지고 있습니다' :
                     analysis.faceShape === 'heart' ? '하트형 - 넓은 이마와 섬세한 턱선이 매력적입니다' :
                     '역삼각형 - 날카로운 턱선과 세련된 인상을 가지고 있습니다',
        confidence: analysis.confidence,
        landmarks: [],
        imageInfo: {
          width: landmarks.imageWidth,
          height: landmarks.imageHeight,
          size: imageFile.size
        },
        metadata: {
          analysisMethod: 'MediaPipe',
          landmarkCount: landmarks.landmarks[0].length,
          measurements: analysis.measurements,
          processingTime: 0,
          analysisVersion: '3.0-MediaPipe',
          timestamp: new Date().toISOString()
        }
      }

      addDebugLog('MediaPipe 분석 결과 준비 완료')
      return result

    } catch (error: any) {
      addDebugLog(`MediaPipe 분석 실패: ${error.message}`, 'error')
      throw error
    }
  }

  const analyzeWithAPI = async (imageFile: File): Promise<any> => {
    addDebugLog('백엔드 API 분석 시작')
    const formData = new FormData()
    formData.append('image', imageFile)
    const result = await faceAnalysisApi.analyzeFace(formData)
    addDebugLog(`백엔드 API 분석 완료: ${result.faceShape}`)
    return result
  }

  const analyzeImage = async (isRetry = false) => {
    addDebugLog('=== 얼굴형 분석 세션 시작 ===')
    
    if (!imageFile || !gender) {
      addDebugLog('필요한 데이터 누락 - 이미지 파일 또는 성별 정보 없음', 'error')
      setError({
        message: '필요한 정보가 없습니다.',
        suggestions: ['이전 단계로 돌아가서 다시 시도해주세요.']
      })
      return
    }

    addDebugLog(`분석 준비 - 성별: ${gender}, 이미지: ${imageFile.name}, 재시도: ${isRetry}, 시도 횟수: ${retryCount}`)

    try {
      if (isRetry) {
        setIsRetrying(true)
        setStage('재시도 중...')
        addDebugLog(`재시도 시작 (${retryCount + 1}/${maxRetries})`)
      } else {
        setProgress(0)
        setStage('분석 방법 결정 중...')
        addDebugLog(`초기 분석 시작 - 방법: ${analysisMethod}`)
      }
      
      setError(null)
      let result: any = null

      // 분석 방법 선택 및 실행
      if (analysisMethod === 'mediapipe') {
        try {
          addDebugLog('MediaPipe 분석 경로 선택')
          setStage('🚀 MediaPipe AI 분석 시작...')
          result = await analyzeWithMediaPipe(imageFile)
          addDebugLog('MediaPipe 분석 성공 완료')
        } catch (mediapiprError: any) {
          addDebugLog(`MediaPipe 분석 실패, 백엔드 API로 전환: ${mediapiprError.message}`, 'warn')
          setAnalysisMethod('api')
          setStage('백엔드 API 분석으로 전환...')
          setProgress(40)
          result = await analyzeWithAPI(imageFile)
          addDebugLog('백엔드 API 전환 분석 완료')
        }
      } else if (analysisMethod === 'api') {
        addDebugLog('백엔드 API 분석 경로 선택')
        setStage('백엔드 API 분석 중...')
        result = await analyzeWithAPI(imageFile)
      }
      
      setProgress(100)
      setStage('분석 완료!')
      addDebugLog(`분석 완료 - 최종 결과: ${result?.faceShape || '알 수 없음'}`)

      // 결과 페이지로 이동
      addDebugLog('결과 페이지로 이동 준비')
      setTimeout(() => {
        addDebugLog('결과 페이지로 이동 실행')
        navigate('/result', {
          state: {
            gender,
            result,
            imageFile,
            analysisMethod: result.metadata?.analysisMethod || 'Backend API'
          }
        })
      }, 500)

    } catch (err: any) {
      setIsRetrying(false)
      
      addDebugLog(`분석 중 최종 오류 발생: ${err.message}`, 'error')
      
      // 상세한 에러 처리
      let errorInfo: AnalysisError = {
        message: '분석 중 오류가 발생했습니다.',
        suggestions: ['잠시 후 다시 시도해주세요.']
      }

      if (err.response?.data) {
        const { message, statusCode } = err.response.data
        errorInfo.message = message || errorInfo.message
        errorInfo.statusCode = statusCode
        addDebugLog(`API 오류 응답: 상태코드 ${statusCode}, 메시지: ${message}`, 'error')

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
            } else if (err.message.includes('MediaPipe')) {
              errorInfo.message = 'AI 분석에 실패했습니다.'
              errorInfo.suggestions = [
                '정면을 향한 선명한 얼굴 사진을 사용해주세요.',
                '밝은 곳에서 촬영한 사진을 시도해주세요.',
                '머리카락이나 손으로 얼굴을 가리지 않은 사진을 사용해주세요.'
              ]
            }
        }
      } else if (err.message) {
        errorInfo.message = err.message
        if (err.message.includes('얼굴을 감지할 수 없습니다')) {
          errorInfo.suggestions = [
            '정면을 바라보는 사진을 사용해주세요.',
            '얼굴이 화면에 크게 나오도록 촬영해주세요.',
            '밝고 선명한 환경에서 촬영해주세요.'
          ]
        }
      }

      setError(errorInfo)
      setProgress(0)
      setStage('분석 실패')
      addDebugLog('오류 처리 완료, 사용자에게 오류 표시')
    }
  }

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      addDebugLog(`재시도 버튼 클릭 (현재: ${retryCount}, 최대: ${maxRetries})`)
      setRetryCount(prev => prev + 1)
      
      // 재시도 시 분석 방법 변경
      if (analysisMethod === 'mediapipe' && retryCount === 0) {
        addDebugLog('재시도 시 MediaPipe에서 API로 분석 방법 변경')
        setAnalysisMethod('api')
      }
      
      analyzeImage(true)
    }
  }

  const goBackToCamera = () => {
    addDebugLog('사진 재선택 버튼 클릭, 카메라 페이지로 이동')
    navigate('/camera', { state: { gender } })
  }

  useEffect(() => {
    addDebugLog('AnalysisPage 컴포넌트 마운트, 분석 시작')
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
            AI 얼굴형 분석 중
          </h1>
          
          <p className="text-gray-600 mb-8">
            {analysisMethod === 'mediapipe' ? 
              'Google MediaPipe로 정밀 분석하고 있습니다' : 
              '백엔드 API로 분석하고 있습니다'
            }
          </p>

          {/* 진행률 바 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                {analysisMethod === 'mediapipe' && <Zap className="w-4 h-4 mr-1 text-yellow-500" />}
                {stage}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ease-out ${
                  analysisMethod === 'mediapipe' 
                    ? 'bg-gradient-to-r from-yellow-400 to-purple-600' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 분석 단계 안내 */}
          <div className="bg-gray-50 rounded-xl p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              {analysisMethod === 'mediapipe' ? (
                <>
                  <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                  🔍 MediaPipe AI 분석 과정
                </>
              ) : (
                '🔍 분석 과정'
              )}
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              {analysisMethod === 'mediapipe' ? (
                <>
                  <div className={`flex items-center ${progress >= 10 ? 'text-purple-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 10 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                    MediaPipe 초기화
                  </div>
                  <div className={`flex items-center ${progress >= 30 ? 'text-purple-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 30 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                    468개 얼굴 랜드마크 추출
                  </div>
                  <div className={`flex items-center ${progress >= 70 ? 'text-purple-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 70 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                    정밀 얼굴형 분류
                  </div>
                  <div className={`flex items-center ${progress >= 90 ? 'text-purple-600' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mr-3 ${progress >= 90 ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                    결과 생성
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            {analysisMethod === 'mediapipe' ? 
              '🚀 Google MediaPipe AI 기술 사용 중...' : 
              '잠시만 기다려주세요...'
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage 