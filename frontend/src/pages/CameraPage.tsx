import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Camera, Upload, RotateCcw } from 'lucide-react'
import { GenderType } from '../types'

const CameraPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const gender = location.state?.gender as GenderType
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  // 성별 정보가 없으면 이전 페이지로 리다이렉트
  if (!gender) {
    navigate('/gender-select')
    return null
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const handleRetake = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleNext = () => {
    if (selectedImage) {
      navigate('/analysis', {
        state: {
          gender,
          imageFile: selectedImage,  // selectedImage -> imageFile로 변경
          imagePreview,
        },
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 헤더 */}
      <div className="safe-top flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">사진 촬영</h1>
        <div className="w-10" />
      </div>

      {/* 진행 상황 */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">2단계 / 4단계</p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 py-8">
        {!selectedImage ? (
          <>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                얼굴 사진을 업로드해주세요
              </h2>
              <p className="text-gray-600">
                정면을 바라보고 얼굴이 잘 보이는<br />
                사진을 선택해주세요
              </p>
            </div>

            {/* 이미지 업로드 영역 */}
            <div
              className={`upload-area ${dragActive ? 'dragover' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                사진을 드래그하거나 버튼을 눌러주세요
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                JPG, PNG 파일 / 최대 5MB
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  갤러리에서 선택
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept="image/*"
              className="hidden"
            />

            {/* 촬영 가이드 */}
            <div className="mt-8 space-y-3">
              <h4 className="font-semibold text-gray-800">📸 좋은 사진 팁</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 정면을 바라보고 촬영해주세요</li>
                <li>• 머리카락이 얼굴을 가리지 않도록 해주세요</li>
                <li>• 밝은 곳에서 촬영해주세요</li>
                <li>• 안경이나 모자는 벗고 촬영해주세요</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                사진이 선택되었어요!
              </h2>
              <p className="text-gray-600">
                이 사진으로 얼굴형 분석을 진행할까요?
              </p>
            </div>

            {/* 선택된 이미지 미리보기 */}
            <div className="relative">
              <img
                src={imagePreview!}
                alt="Selected"
                className="w-full max-w-sm mx-auto rounded-xl shadow-lg"
              />
              <button
                onClick={handleRetake}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* 다음 단계 버튼 */}
      <div className="safe-bottom p-6">
        <button
          onClick={handleNext}
          disabled={!selectedImage}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          얼굴형 분석 시작
        </button>
      </div>
    </div>
  )
}

export default CameraPage 