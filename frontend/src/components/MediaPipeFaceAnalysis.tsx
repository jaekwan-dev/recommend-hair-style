import { useState } from 'react'
import { Sparkles, Upload, Camera, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { mediaPipeService, FaceLandmarks, FaceAnalysisFromLandmarks } from '../services/mediapipe.service'

interface MediaPipeFaceAnalysisProps {
  onAnalysisComplete: (analysis: FaceAnalysisFromLandmarks) => void
  onError: (error: string) => void
}

const MediaPipeFaceAnalysis: React.FC<MediaPipeFaceAnalysisProps> = ({ onAnalysisComplete, onError }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [landmarks, setLandmarks] = useState<FaceLandmarks | null>(null)
  const [analysis, setAnalysis] = useState<FaceAnalysisFromLandmarks | null>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    try {
      setIsAnalyzing(true)
      setImagePreview(URL.createObjectURL(file))

      console.log('MediaPipe 초기화 중...')
      await mediaPipeService.initialize()

      console.log('얼굴 랜드마크 추출 중...')
      const extractedLandmarks = await mediaPipeService.extractLandmarks(file)

      if (!extractedLandmarks || extractedLandmarks.landmarks.length === 0) {
        throw new Error('얼굴을 감지할 수 없습니다. 더 선명한 사진을 사용해주세요.')
      }

      setLandmarks(extractedLandmarks)

      console.log('얼굴형 분석 중...')
      const faceAnalysis = mediaPipeService.analyzeFaceShape(extractedLandmarks.landmarks[0])
      
      setAnalysis(faceAnalysis)
      onAnalysisComplete(faceAnalysis)

      console.log('분석 완료:', faceAnalysis)

    } catch (error: any) {
      console.error('MediaPipe 분석 실패:', error)
      onError(error.message || '얼굴 분석 중 오류가 발생했습니다.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    if (imageFile) {
      handleFileSelect(imageFile)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const getFaceShapeDescription = (shape: string): string => {
    const descriptions = {
      oval: '타원형 - 이상적인 균형잡힌 얼굴형입니다',
      round: '둥근형 - 부드럽고 친근한 인상의 얼굴형입니다',
      oblong: '긴형 - 세련되고 우아한 긴 얼굴형입니다',
      square: '각진형 - 강인하고 의지가 강한 인상의 얼굴형입니다',
      heart: '하트형 - 매력적이고 섬세한 인상의 얼굴형입니다',
      inverted_triangle: '역삼각형 - 세련되고 현대적인 인상의 얼굴형입니다'
    }
    return descriptions[shape as keyof typeof descriptions] || '알 수 없는 얼굴형'
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI 얼굴형 분석 (MediaPipe)
        </h2>
        <p className="text-gray-600">
          Google MediaPipe를 사용한 정밀한 얼굴형 분석
        </p>
      </div>

      {/* 파일 업로드 영역 */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {imagePreview ? (
          <div className="space-y-4">
            <img
              src={imagePreview}
              alt="분석할 이미지"
              className="max-w-xs mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600">
              이미지가 업로드되었습니다
            </p>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              얼굴 사진을 업로드하세요
            </p>
            <p className="text-gray-500 mb-4">
              드래그 앤 드롭 또는 클릭하여 파일 선택
            </p>
          </>
        )}
        
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="face-image-input"
          disabled={isAnalyzing}
        />
        <label
          htmlFor="face-image-input"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer disabled:opacity-50"
        >
          <Camera className="w-4 h-4 mr-2" />
          사진 선택
        </label>
      </div>

      {/* 분석 진행 상태 */}
      {isAnalyzing && (
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-blue-900 mb-2">AI 분석 진행 중</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>🔄 MediaPipe 초기화 중...</p>
            <p>👁️ 468개 얼굴 랜드마크 추출 중...</p>
            <p>🎯 정밀한 얼굴형 분석 중...</p>
          </div>
        </div>
      )}

      {/* 분석 결과 */}
      {analysis && !isAnalyzing && (
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-900">분석 완료!</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">얼굴형 결과</h4>
              <p className="text-lg text-purple-600 font-bold mb-2">
                {getFaceShapeDescription(analysis.faceShape)}
              </p>
              <p className="text-sm text-gray-600">
                신뢰도: {(analysis.confidence * 100).toFixed(1)}%
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">상세 측정값</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">가로/세로 비율:</span>
                  <span className="ml-2 font-medium">{analysis.measurements.aspectRatio.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-gray-600">턱선 각도:</span>
                  <span className="ml-2 font-medium">{analysis.measurements.jawlineAngle.toFixed(1)}°</span>
                </div>
                <div>
                  <span className="text-gray-600">얼굴 너비:</span>
                  <span className="ml-2 font-medium">{analysis.measurements.faceWidth.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-gray-600">얼굴 높이:</span>
                  <span className="ml-2 font-medium">{analysis.measurements.faceHeight.toFixed(3)}</span>
                </div>
              </div>
            </div>

            {landmarks && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">MediaPipe 정보</h4>
                <p className="text-sm text-gray-600">
                  • 추출된 랜드마크: {landmarks.landmarks[0].length}개 포인트
                </p>
                <p className="text-sm text-gray-600">
                  • 이미지 해상도: {landmarks.imageWidth} × {landmarks.imageHeight}
                </p>
                <p className="text-sm text-gray-600">
                  • 분석 방식: Google MediaPipe Face Mesh
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 사용 안내 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <h4 className="font-semibold mb-2">더 정확한 분석을 위한 팁:</h4>
            <ul className="space-y-1">
              <li>• 정면을 바라보는 사진을 사용하세요</li>
              <li>• 머리카락이 얼굴을 가리지 않도록 하세요</li>
              <li>• 밝고 선명한 사진을 사용하세요</li>
              <li>• 마스크나 선글라스를 착용하지 마세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaPipeFaceAnalysis 