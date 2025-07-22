import { useNavigate } from 'react-router-dom'
import { Camera, Sparkles } from 'lucide-react'

const HomePage = () => {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/gender-select')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary-50 to-purple-50">
      {/* 헤더 */}
      <div className="safe-top pt-8 pb-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary-600 mr-2" />
          <h1 className="text-3xl font-bold text-gradient">HairMatch</h1>
        </div>
        <p className="text-gray-600 px-6">
          AI 기반 얼굴형 분석으로<br />
          나만의 완벽한 헤어스타일을 찾아보세요
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-center px-6">
        {/* 메인 일러스트레이션 */}
        <div className="text-center mb-8">
          <div className="w-48 h-48 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
            <Camera className="w-20 h-20 text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            사진 한 장으로 시작하세요
          </h2>
          <p className="text-gray-600 text-sm">
            얼굴형을 분석하고 어울리는<br />
            헤어스타일 3종을 추천해드립니다
          </p>
        </div>

        {/* 기능 소개 */}
        <div className="space-y-4 mb-8">
          <FeatureItem
            icon="📸"
            title="얼굴형 분석"
            description="AI가 당신의 얼굴형을 정확하게 분석해요"
          />
          <FeatureItem
            icon="✨"
            title="맞춤 추천"
            description="성별과 얼굴형에 어울리는 헤어스타일을 추천"
          />
          <FeatureItem
            icon="🌟"
            title="연예인 스타일"
            description="비슷한 스타일의 연예인 레퍼런스도 함께 제공"
          />
        </div>
      </div>

      {/* 시작하기 버튼 */}
      <div className="safe-bottom p-6">
        <button
          onClick={handleStart}
          className="w-full btn-primary text-lg py-4 shadow-lg"
        >
          지금 시작하기
        </button>
        <p className="text-xs text-gray-500 text-center mt-3">
          무료 서비스 • 데이터 저장하지 않음
        </p>
      </div>
    </div>
  )
}

const FeatureItem = ({ icon, title, description }: {
  icon: string
  title: string
  description: string
}) => {
  return (
    <div className="flex items-center space-x-4 bg-white/70 rounded-xl p-4 backdrop-blur-sm">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}

export default HomePage 