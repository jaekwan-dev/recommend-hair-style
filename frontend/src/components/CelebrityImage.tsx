import { useState, useEffect } from 'react'
import { tmdbService } from '../services/tmdb.service'

interface CelebrityImageProps {
  name: string
  alt?: string
  className?: string
}

export const CelebrityImage = ({ name, alt, className = '' }: CelebrityImageProps) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadImage = async () => {
      try {
        setLoading(true)
        setError(false)
        
        // TMDB 서비스 설정 확인
        if (!tmdbService.isConfigured()) {
          console.warn('⚠️ TMDB API 키가 설정되지 않았습니다. 기본 아바타를 사용합니다.')
          setImageUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=780&background=6366f1&color=fff&font-size=0.4&bold=true`)
          return
        }
        
        const url = await tmdbService.getCelebrityImage(name)
        
        if (isMounted) {
          setImageUrl(url)
        }
      } catch (err) {
        console.error(`이미지 로드 실패 (${name}):`, err)
        if (isMounted) {
          setError(true)
          setImageUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=780&background=ef4444&color=fff&font-size=0.4&bold=true`)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadImage()

    return () => {
      isMounted = false
    }
  }, [name])

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded-full flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-gray-500 font-medium">로딩중...</span>
          </div>
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={alt || `${name} 프로필 사진`}
        className={`${className} ${
          loading ? 'opacity-0' : 'opacity-100'
        } transition-all duration-500 rounded-full object-cover hover:scale-105 transform cursor-pointer`}
        onLoad={() => setLoading(false)}
        onError={(e) => {
          console.log(`💥 이미지 로드 에러: ${name}, 기본 아바타로 대체`)
          setError(true)
          e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=780&background=6b7280&color=fff&font-size=0.4&bold=true`
        }}
      />
      
      {/* 고화질 배지 (실제 TMDB 이미지일 때만) */}
      {!loading && !error && imageUrl.includes('image.tmdb.org') && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
          HD
        </div>
      )}
      
      {/* 에러 표시 개선 */}
      {error && !loading && (
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
          <span className="text-xs text-white font-bold">!</span>
        </div>
      )}
    </div>
  )
}

export default CelebrityImage 