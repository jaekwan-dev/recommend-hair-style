import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Users } from 'lucide-react'
import { GenderType } from '../types'

const GenderSelectPage = () => {
  const navigate = useNavigate()
  const [selectedGender, setSelectedGender] = useState<GenderType | null>(null)

  const handleBack = () => {
    navigate(-1)
  }

  const handleNext = () => {
    if (selectedGender) {
      // 선택된 성별을 상태로 저장하고 카메라 페이지로 이동
      navigate('/camera', { state: { gender: selectedGender } })
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
        <h1 className="text-lg font-semibold text-gray-800">성별 선택</h1>
        <div className="w-10" /> {/* 공간 확보용 */}
      </div>

      {/* 진행 상황 */}
      <div className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">1단계 / 4단계</p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            성별을 선택해주세요
          </h2>
          <p className="text-gray-600">
            더 정확한 헤어스타일 추천을 위해<br />
            성별을 알려주세요
          </p>
        </div>

        {/* 성별 선택 버튼들 */}
        <div className="space-y-4">
          <GenderButton
            icon={<User className="w-8 h-8" />}
            title="남성"
            subtitle="남성용 헤어스타일 추천"
            isSelected={selectedGender === 'male'}
            onClick={() => setSelectedGender('male')}
          />
          <GenderButton
            icon={<Users className="w-8 h-8" />}
            title="여성"
            subtitle="여성용 헤어스타일 추천"
            isSelected={selectedGender === 'female'}
            onClick={() => setSelectedGender('female')}
          />
        </div>
      </div>

      {/* 다음 단계 버튼 */}
      <div className="safe-bottom p-6">
        <button
          onClick={handleNext}
          disabled={!selectedGender}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          다음 단계
        </button>
      </div>
    </div>
  )
}

const GenderButton = ({
  icon,
  title,
  subtitle,
  isSelected,
  onClick
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  isSelected: boolean
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className={`${isSelected ? 'text-primary-600' : 'text-gray-400'}`}>
          {icon}
        </div>
        <div className="text-left">
          <h3 className={`text-lg font-semibold ${
            isSelected ? 'text-primary-700' : 'text-gray-800'
          }`}>
            {title}
          </h3>
          <p className={`text-sm ${
            isSelected ? 'text-primary-600' : 'text-gray-600'
          }`}>
            {subtitle}
          </p>
        </div>
      </div>
    </button>
  )
}

export default GenderSelectPage 