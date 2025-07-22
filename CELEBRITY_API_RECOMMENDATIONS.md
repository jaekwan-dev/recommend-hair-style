# 🌟 연예인 사진 무료 API 추천 가이드

## 🏆 **최고 추천: TMDB (The Movie Database) API**

### ✅ **장점**
- **완전 무료** (API 키만 필요)
- **고품질 연예인 사진** 제공
- **배우, 여배우, 감독** 등 영화/TV 관련 유명인 포커스
- **다양한 이미지 크기** 제공 (작은 프로필부터 고해상도까지)
- **신뢰할 수 있는 서비스** (Netflix, Disney+ 등에서 사용)

### 📊 **사용법**
```javascript
// 1. 연예인 검색
const searchResponse = await fetch(`https://api.themoviedb.org/3/search/person?api_key=YOUR_API_KEY&query=${celebrityName}`)

// 2. 프로필 이미지 가져오기
const imageUrl = `https://image.tmdb.org/t/p/w500${person.profile_path}`

// 3. 상세 정보 가져오기
const detailResponse = await fetch(`https://api.themoviedb.org/3/person/${person.id}?api_key=YOUR_API_KEY`)
```

### 🔗 **등록 방법**
1. [TMDB 홈페이지](https://www.themoviedb.org/) 가입
2. 계정 설정 → API → 개발자 API 키 신청
3. 무료 API 키 발급 (즉시 사용 가능)

---

## 🥈 **2위: API Ninjas Celebrity API**

### ✅ **장점**
- **넓은 범위**: 배우, 운동선수, 정치인, 사업가 등 모든 유명인
- **상세 정보**: 나이, 키, 국적, 순자산, 직업 등
- **빠른 검색**: 이름으로 즉시 검색 가능

### ❌ **단점**
- **사진 제공 안함** (정보만 제공)
- 월 100회 무료, 이후 유료

### 📊 **사용법**
```javascript
const response = await fetch('https://api.api-ninjas.com/v1/celebrity?name=Leonardo DiCaprio', {
  headers: { 'X-Api-Key': 'YOUR_API_KEY' }
})
```

---

## 🥉 **3위: Unsplash API**

### ✅ **장점**
- **고품질 사진** 무료 제공
- **상업적 사용 가능**
- **다양한 카테고리**: celebrity, fashion, portrait 등

### ❌ **단점**
- **특정 연예인 보장 안됨** (일반 모델이나 스톡 사진 위주)
- 검색 결과가 불확실함

### 📊 **사용법**
```javascript
const response = await fetch(`https://api.unsplash.com/search/photos?query=celebrity&client_id=YOUR_ACCESS_KEY`)
```

---

## 💡 **HairMatch에 최적화된 솔루션**

### **추천 조합: TMDB + 백업 이미지**

```typescript
// backend/src/services/celebrity-image.service.ts
export class CelebrityImageService {
  
  async getCelebrityImage(name: string): Promise<string> {
    try {
      // 1차: TMDB에서 검색
      const tmdbResult = await this.searchTMDB(name)
      if (tmdbResult?.profile_path) {
        return `https://image.tmdb.org/t/p/w500${tmdbResult.profile_path}`
      }
      
      // 2차: 백업 이미지 사용
      return this.getDefaultCelebrityImage(name)
      
    } catch (error) {
      return this.getDefaultCelebrityImage(name)
    }
  }
  
  private async searchTMDB(name: string) {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/person?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(name)}`
    )
    const data = await response.json()
    return data.results?.[0] || null
  }
  
  private getDefaultCelebrityImage(name: string): string {
    // 성별과 헤어스타일에 맞는 기본 이미지 매핑
    const defaultImages = {
      'male_short': '/assets/default-male-short.jpg',
      'female_long': '/assets/default-female-long.jpg',
      // ... 더 많은 기본 이미지들
    }
    
    return defaultImages['default'] || '/assets/no-image.jpg'
  }
}
```

---

## ⚡ **즉시 적용 가능한 간단한 방법**

### **Option 1: TMDB 연동 (권장)**
1. **TMDB API 키 발급** (5분 소요)
2. **백엔드 서비스에 통합**
3. **실제 연예인 사진 제공**

### **Option 2: 큐레이션된 이미지 세트 (빠른 방법)**
1. **인기 연예인 50명 선정**
2. **저작권 없는 이미지 수집 (Unsplash, Pixabay)**
3. **로컬 assets로 관리**

### **Option 3: AI 생성 이미지 (미래 지향적)**
1. **AI 이미지 생성 API** 사용 (OpenAI DALL-E, Stability AI)
2. **헤어스타일별 "이상적인 얼굴"** 생성
3. **저작권 걱정 없음**

---

## 🚀 **지금 당장 구현하기**

### **1단계: TMDB API 키 받기**
```bash
# 1. https://www.themoviedb.org/signup 가입
# 2. Settings → API → Create API Key
# 3. .env에 추가
echo "TMDB_API_KEY=your_api_key_here" >> backend/.env
```

### **2단계: 백엔드 서비스 수정**
```typescript
// recommendation.service.ts에 TMDB 통합
async getHairStyleRecommendations(faceShape: string, gender: string) {
  const recommendations = this.getBasicRecommendations(faceShape, gender)
  
  // 각 추천에 실제 연예인 이미지 추가
  for (const rec of recommendations) {
    rec.celebrity.imageUrl = await this.getCelebrityImage(rec.celebrity.name)
  }
  
  return { recommendations }
}
```

### **3단계: 프론트엔드 이미지 표시**
```typescript
// RecommendationPage.tsx에서 이미지 표시
<img 
  src={recommendation.celebrity.imageUrl} 
  alt={recommendation.celebrity.name}
  onError={(e) => { 
    e.currentTarget.src = '/assets/default-celebrity.jpg' 
  }}
/>
```

---

## 🎯 **결론 및 추천**

**HairMatch 프로젝트에 가장 적합한 선택: TMDB API**

- ✅ **완전 무료**
- ✅ **고품질 연예인 사진**
- ✅ **신뢰할 수 있는 서비스**
- ✅ **헤어스타일 분석에 적합한 배우/여배우 포커스**
- ✅ **즉시 구현 가능**

**예상 효과**:
- 📸 실제 연예인 사진으로 **사용자 경험 대폭 향상**
- 🎯 **"아, 이 연예인처럼!" 직관적 이해**
- 📱 **소셜 미디어 공유 활성화**

지금 바로 TMDB API를 연동해보시길 강력히 추천드립니다! 🌟 