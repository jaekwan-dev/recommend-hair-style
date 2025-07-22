# 🌟 실시간 연예인 이미지 가져오기 구현 가이드

## 🏆 **방법 1: TMDB API (최고 추천)**

### ✅ **장점**
- **100% 무료** (API 키만 필요)
- **고품질 연예인 사진**
- **실시간 검색** 가능
- **안정적인 서비스** (Netflix, Disney+ 등에서 사용)

### 🚀 **즉시 구현 방법**

#### **1단계: TMDB API 키 발급**
```bash
# 1. https://www.themoviedb.org/signup 가입
# 2. Settings → API → Create API Key → Developer
# 3. 사용 목적: Educational/Personal Project
# 4. 즉시 발급됨
```

#### **2단계: 백엔드 서비스 구현**
```typescript
// backend/src/services/celebrity-image.service.ts
import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class CelebrityImageService {
  private readonly TMDB_API_KEY = process.env.TMDB_API_KEY;
  private readonly TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // 500px 너비

  constructor(private readonly httpService: HttpService) {}

  async getCelebrityImage(name: string): Promise<string> {
    try {
      // 1. 연예인 검색
      const searchUrl = `${this.TMDB_BASE_URL}/search/person?api_key=${this.TMDB_API_KEY}&query=${encodeURIComponent(name)}`;
      
      const response = await this.httpService.get(searchUrl).toPromise();
      const results = response.data.results;
      
      if (results && results.length > 0) {
        const person = results[0]; // 첫 번째 검색 결과
        
        if (person.profile_path) {
          return `${this.IMAGE_BASE_URL}${person.profile_path}`;
        }
      }
      
      // 2. 이미지를 찾지 못한 경우 기본 이미지
      return this.getDefaultImage(name);
      
    } catch (error) {
      console.error(`연예인 이미지 검색 실패: ${name}`, error);
      return this.getDefaultImage(name);
    }
  }

  private getDefaultImage(name: string): string {
    // 성별에 따른 기본 이미지 (로컬 assets)
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const avatarId = (hash % 10) + 1; // 1-10 범위
    
    return `/assets/default-avatars/avatar-${avatarId}.jpg`;
  }

  // 여러 연예인 이미지 한번에 가져오기
  async getMultipleCelebrityImages(names: string[]): Promise<Record<string, string>> {
    const promises = names.map(async (name) => {
      const imageUrl = await this.getCelebrityImage(name);
      return { name, imageUrl };
    });

    const results = await Promise.all(promises);
    
    return results.reduce((acc, { name, imageUrl }) => {
      acc[name] = imageUrl;
      return acc;
    }, {} as Record<string, string>);
  }
}
```

#### **3단계: 추천 서비스에 통합**
```typescript
// backend/src/recommendation/recommendation.service.ts 수정
import { CelebrityImageService } from '../services/celebrity-image.service';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly celebrityImageService: CelebrityImageService
  ) {}

  async getHairStyleRecommendations(
    faceShape: keyof typeof this.hairStyleData,
    gender: 'male' | 'female'
  ): Promise<RecommendationResponse> {
    const styles = this.hairStyleData[faceShape]?.[gender] || [];
    const faceInfo = this.faceShapeInfo[faceShape];
    
    // 🌟 실시간으로 연예인 이미지 가져오기
    const celebrityNames = styles.map(style => style.celebrity.name);
    const celebrityImages = await this.celebrityImageService.getMultipleCelebrityImages(celebrityNames);
    
    // 이미지 URL 업데이트
    const updatedStyles = styles.map(style => ({
      ...style,
      celebrity: {
        ...style.celebrity,
        imageUrl: celebrityImages[style.celebrity.name] || style.celebrity.imageUrl
      }
    }));
    
    return {
      recommendations: updatedStyles,
      totalCount: updatedStyles.length,
      faceShapeDescription: faceInfo?.description || '얼굴형 정보를 찾을 수 없습니다.',
      generalTips: faceInfo?.tips || []
    };
  }
}
```

#### **4단계: 환경변수 설정**
```bash
# backend/.env
TMDB_API_KEY=your_tmdb_api_key_here
```

---

## 🥈 **방법 2: Unsplash API (백업용)**

### 📊 **구현 예제**
```typescript
// backend/src/services/unsplash-image.service.ts
import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class UnsplashImageService {
  private readonly ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
  private readonly API_URL = 'https://api.unsplash.com';

  constructor(private readonly httpService: HttpService) {}

  async getPortraitImage(query: string): Promise<string> {
    try {
      const url = `${this.API_URL}/search/photos?query=${query} portrait&client_id=${this.ACCESS_KEY}&per_page=1&orientation=portrait`;
      
      const response = await this.httpService.get(url).toPromise();
      const results = response.data.results;
      
      if (results && results.length > 0) {
        return results[0].urls.small; // 400px 너비 이미지
      }
      
      return '/assets/default-avatar.jpg';
    } catch (error) {
      console.error('Unsplash 이미지 검색 실패:', error);
      return '/assets/default-avatar.jpg';
    }
  }
}
```

---

## 🥉 **방법 3: 하이브리드 접근법 (추천)**

### 💡 **전략**
1. **1차**: TMDB API로 정확한 연예인 이미지
2. **2차**: Unsplash API로 유사한 스타일 이미지  
3. **3차**: 로컬 기본 이미지

```typescript
// backend/src/services/hybrid-image.service.ts
@Injectable()
export class HybridImageService {
  constructor(
    private readonly celebrityService: CelebrityImageService,
    private readonly unsplashService: UnsplashImageService
  ) {}

  async getOptimalImage(celebrityName: string, hairStyle: string): Promise<string> {
    try {
      // 1차: TMDB에서 연예인 이미지 검색
      const celebrityImage = await this.celebrityService.getCelebrityImage(celebrityName);
      if (celebrityImage && !celebrityImage.includes('default-avatars')) {
        return celebrityImage;
      }
      
      // 2차: Unsplash에서 헤어스타일 관련 이미지
      const styleImage = await this.unsplashService.getPortraitImage(`${hairStyle} hairstyle korean`);
      if (styleImage && !styleImage.includes('default-avatar')) {
        return styleImage;
      }
      
      // 3차: 기본 이미지
      return '/assets/default-celebrity.jpg';
      
    } catch (error) {
      return '/assets/default-celebrity.jpg';
    }
  }
}
```

---

## ⚡ **방법 4: 즉시 적용 가능한 간단 솔루션**

### 🎯 **프론트엔드에서 직접 처리**
```typescript
// frontend/src/services/celebrity-image.service.ts
export class CelebrityImageService {
  private readonly TMDB_API_KEY = 'YOUR_API_KEY'; // 프론트엔드용 (읽기전용 키)
  
  async getCelebrityImage(name: string): Promise<string> {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/person?api_key=${this.TMDB_API_KEY}&query=${encodeURIComponent(name)}`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0 && data.results[0].profile_path) {
        return `https://image.tmdb.org/t/p/w500${data.results[0].profile_path}`;
      }
      
      return '/assets/default-celebrity.jpg';
    } catch (error) {
      return '/assets/default-celebrity.jpg';
    }
  }
}

// 사용법
const celebrityService = new CelebrityImageService();
const imageUrl = await celebrityService.getCelebrityImage('박보검');
```

### 🖼️ **React 컴포넌트에서 사용**
```tsx
// CelebrityImage.tsx
import { useState, useEffect } from 'react';

interface Props {
  name: string;
  alt: string;
  className?: string;
}

export const CelebrityImage: React.FC<Props> = ({ name, alt, className }) => {
  const [imageUrl, setImageUrl] = useState('/assets/default-celebrity.jpg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        const url = await getCelebrityImage(name);
        setImageUrl(url);
      } catch (error) {
        console.error('이미지 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [name]);

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
      )}
      <img
        src={imageUrl}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onError={(e) => {
          e.currentTarget.src = '/assets/default-celebrity.jpg';
        }}
      />
    </div>
  );
};

// RecommendationPage에서 사용
<CelebrityImage 
  name={recommendation.celebrity.name}
  alt={recommendation.celebrity.name}
  className="w-12 h-12 rounded-full object-cover"
/>
```

---

## 🚀 **즉시 구현 단계별 가이드**

### **🟢 5분 구현 (프론트엔드만)**
1. TMDB 가입 + API 키 발급
2. 프론트엔드에 `CelebrityImageService` 추가
3. 기존 `<img>` 태그를 `<CelebrityImage>` 컴포넌트로 교체

### **🟡 30분 구현 (백엔드 포함)**
1. 백엔드에 `CelebrityImageService` 구현
2. 추천 서비스에 통합
3. 환경변수 설정

### **🔴 완벽한 구현 (1시간)**
1. 하이브리드 접근법 구현
2. 이미지 캐싱 추가
3. 에러 처리 + 로딩 UI

---

## 🎯 **추천 방법**

**현재 상황**에 가장 적합한 것은 **방법 1 (TMDB API)**입니다:

- ✅ **완전 무료**
- ✅ **5분 내 적용 가능**
- ✅ **고품질 연예인 사진**
- ✅ **안정적인 서비스**

지금 바로 구현해드릴까요? 🚀 