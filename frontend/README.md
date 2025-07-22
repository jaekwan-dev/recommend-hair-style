# HairMatch Frontend

React + Vite + TailwindCSS 기반의 모바일 웹 애플리케이션

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 미리보기
npm run preview
```

### 환경 설정

```bash
# .env 파일 생성
cp .env.example .env
```

## 📱 주요 기능

### 4단계 사용자 플로우

1. **성별 선택** (`/gender-select`)
   - 남성/여성 선택
   - 추천 알고리즘의 기준 설정

2. **사진 업로드** (`/camera`)
   - 드래그 앤 드롭 지원
   - 갤러리에서 이미지 선택
   - 사진 촬영 가이드 제공

3. **얼굴형 분석** (`/analysis`)
   - 실시간 진행률 표시
   - AI 분석 과정 시각화
   - 분석 중 팁 제공

4. **결과 및 추천** (`/result`, `/recommendations`)
   - 얼굴형 분석 결과
   - 맞춤 헤어스타일 추천
   - 연예인 레퍼런스 제공

## 🏗️ 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
├── pages/              # 페이지 컴포넌트
│   ├── HomePage.tsx
│   ├── GenderSelectPage.tsx
│   ├── CameraPage.tsx
│   ├── AnalysisPage.tsx
│   ├── ResultPage.tsx
│   └── RecommendationPage.tsx
├── services/           # API 서비스
│   └── api.ts
├── hooks/              # 커스텀 훅
├── types/              # TypeScript 타입 정의
└── App.tsx             # 메인 애플리케이션
```

## 🎨 디자인 시스템

### 색상 팔레트

- **Primary**: Purple (#8B5CF6)
- **Background**: Light Gray (#FAFAFA)
- **Text**: Gray (#374151)

### 컴포넌트

- **Button**: `.btn-primary`, `.btn-secondary`
- **Card**: `.card`
- **Upload Area**: `.upload-area`

### 모바일 최적화

- 최대 너비 384px (mobile-container)
- Safe Area 지원
- Touch-friendly 인터페이스
- PWA 지원

## 🔧 기술 스택

- **React 18**: 사용자 인터페이스
- **Vite**: 빠른 빌드 도구
- **TailwindCSS**: 유틸리티 기반 CSS
- **TypeScript**: 타입 안전성
- **React Router**: 클라이언트 사이드 라우팅
- **Axios**: HTTP 클라이언트
- **Lucide React**: 아이콘 라이브러리

## 📱 PWA 기능

- 오프라인 지원
- 앱 설치 가능
- 모바일 최적화된 메타 태그
- Service Worker 자동 등록

## 🧪 개발 가이드

### API 연동

```typescript
import { faceAnalysisApi, recommendationApi } from './services/api'

// 얼굴 분석
const result = await faceAnalysisApi.analyzeFace(imageFile)

// 헤어스타일 추천
const recommendations = await recommendationApi.getHairStyleRecommendations(
  'heart', 
  'female'
)
```

### 상태 관리

React Router의 location.state를 활용한 페이지 간 데이터 전달

```typescript
navigate('/next-page', {
  state: {
    gender: 'female',
    analysisResult: result
  }
})
```

## 📝 TODO

- [ ] 카메라 실시간 촬영 기능
- [ ] 이미지 크롭 기능
- [ ] 소셜 공유 기능
- [ ] 즐겨찾기/저장 기능
- [ ] 다국어 지원
- [ ] 접근성 개선 