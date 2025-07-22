import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, Loader } from 'lucide-react'
import { faceAnalysisApi } from '../services/api'
import { FaceAnalysisResult } from '../types'

const AnalysisPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const { gender, selectedImage, imagePreview } = location.state || {}
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('이미지 분석 중...')
  const [isCompleted, setIsCompleted] = useState(false)

  // 필수 데이터가 없으면 이전 페이지로 리다이렉트
  if (!gender || !selectedImage) {
    navigate('/gender-select')
    return null
  }

  useEffect(() => {
    const analyzeImage = async () => {
      try {
        // 분석 과정 시뮬레이션
        const steps = [
          { text: '얼굴 인식 중...', duration: 1500 },
          { text: '얼굴 랜드마크 추출 중...', duration: 2000 },
          { text: '얼굴형 분석 중...', duration: 1500 },
          { text: '분석 완료!', duration: 800 },
        ]

        let currentProgress = 0

        for (let i = 0; i < steps.length; i++) {
          const step = steps[i]
          setCurrentStep(step.text)
          
          const targetProgress = ((i + 1) / steps.length) * 100
          
          // 점진적 진행률 증가
          const progressInterval = setInterval(() => {
            currentProgress += Math.random() * 3
            if (currentProgress >= targetProgress) {
              currentProgress = targetProgress
              clearInterval(progressInterval)
            }
            setProgress(Math.min(currentProgress, 100))
          }, 50)

          await new Promise(resolve => setTimeout(resolve, step.duration))
          clearInterval(progressInterval)
          setProgress(targetProgress)
        }

        // 실제 API 호출
        const analysisResult = await faceAnalysisApi.analyzeFace(selectedImage)
        
        setIsCompleted(true)
        
        // 결과 페이지로 이동
        setTimeout(() => {
          navigate('/result', {
            state: {
              gender,
              selectedImage,
              imagePreview,
              analysisResult,
            },
          })
        }, 1500)

      } catch (error) {
        console.error('얼굴형 분석 실패:', error)
        // 에러 처리 - 이전 페이지로 돌아가거나 에러 페이지 표시
        alert('얼굴형 분석에 실패했습니다. 다시 시도해주세요.')
        navigate('/camera', { state: { gender } })
      }
    }

    analyzeImage()
  }, [gender, selectedImage, imagePreview, navigate])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
      {/* 진행 상황 */}
      <div className="safe-top px-6 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">3단계 / 4단계</p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center">
          {/* 로딩 애니메이션 */}
          <div className="mb-8">
            {isCompleted ? (
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles className="w-12 h-12 text-green-600" />
              </div>
            ) : (
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Loader className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
            )}
            
            {/* 업로드된 이미지 미리보기 */}
            {imagePreview && (
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                <img
                  src={imagePreview}
                  alt="분석 중인 이미지"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* 상태 텍스트 */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {isCompleted ? '분석이 완료되었어요!' : 'AI가 얼굴형을 분석하고 있어요'}
          </h2>
          
          <p className="text-gray-600 mb-8">
            {isCompleted 
              ? '곧 결과를 확인하실 수 있습니다'
              : '잠시만 기다려주세요. 정확한 분석을 위해 시간이 소요됩니다'
            }
          </p>

          {/* 진행률 바 */}
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{currentStep}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* 분석 중 팁 */}
          {!isCompleted && (
            <div className="mt-12 bg-white/70 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="font-semibold text-gray-800 mb-3">
                💡 잠깐! 알고 계셨나요?
              </h3>
              <p className="text-sm text-gray-600">
                얼굴형에는 6가지 기본 타입이 있어요. 타원형, 둥근형, 긴형, 각진형, 하트형, 역삼각형으로 구분되며, 각 얼굴형마다 어울리는 헤어스타일이 다릅니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalysisPage 