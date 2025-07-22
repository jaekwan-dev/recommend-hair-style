# HairMatch Backend API

NestJS 기반의 얼굴형 분석 및 헤어스타일 추천 API 서버

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start:prod
```

### 환경 설정

```bash
# .env 파일 생성
cp .env.example .env
```

## 📚 API 문서

서버 실행 후 http://localhost:3001/api 에서 Swagger 문서를 확인할 수 있습니다.

### 주요 엔드포인트

#### 얼굴형 분석
```
POST /face-analysis/analyze
Content-Type: multipart/form-data

Body:
- image: File (JPG, PNG, 최대 5MB)
```

#### 헤어스타일 추천
```
GET /recommendations/hair-styles?faceShape={faceShape}&gender={gender}

Parameters:
- faceShape: oval|round|oblong|square|heart|inverted_triangle
- gender: male|female
```

#### 연예인 레퍼런스
```
GET /recommendations/celebrities?styleId={styleId}
```

## 🏗️ 프로젝트 구조

```
src/
├── app.module.ts              # 루트 모듈
├── main.ts                    # 애플리케이션 진입점
├── face-analysis/             # 얼굴형 분석 모듈
│   ├── face-analysis.controller.ts
│   ├── face-analysis.service.ts
│   └── face-analysis.module.ts
├── recommendation/            # 추천 모듈
│   ├── recommendation.controller.ts
│   ├── recommendation.service.ts
│   └── recommendation.module.ts
└── common/                    # 공통 타입 및 DTO
    ├── dto/
    └── interfaces/
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# e2e 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 🔧 개발 도구

- **NestJS**: Node.js 백엔드 프레임워크
- **TypeScript**: 타입 안전성
- **Swagger**: API 문서화
- **MediaPipe**: 얼굴 인식 (예정)
- **Jest**: 테스트 프레임워크

## 📝 TODO

- [ ] MediaPipe FaceMesh 통합
- [ ] 실제 얼굴형 분석 로직 구현
- [ ] 데이터베이스 연동
- [ ] 이미지 전처리 로직
- [ ] 에러 처리 개선
- [ ] 로깅 시스템 구축 