# HairMatch 🎨💇‍♀️

AI 기반 얼굴형 분석을 통한 헤어스타일 추천 서비스

## 🚀 프로젝트 개요

사용자가 셀카를 촬영하면 얼굴형을 자동 분석하고, 얼굴형에 어울리는 헤어스타일 3종과 유사한 연예인 스타일을 추천하는 모바일 웹앱입니다.

## 🏗️ 아키텍처

```
hairmatch/
├── backend/          # NestJS API 서버
├── frontend/         # React + Vite 웹앱
├── PRD.md           # 제품 요구사항 문서
└── README.md
```

## 🔧 기술 스택

### Backend
- **NestJS** - Node.js 백엔드 프레임워크
- **TypeScript** - 타입 안전성
- **MediaPipe** - 얼굴 인식 및 분석
- **Multer** - 파일 업로드 처리

### Frontend
- **React 18** - 사용자 인터페이스
- **Vite** - 빌드 도구
- **TailwindCSS** - 스타일링
- **TypeScript** - 타입 안전성

## 🚀 빠른 시작

### 전체 설치 및 실행
```bash
# 모든 의존성 설치
npm run install:all

# 개발 서버 실행 (백엔드 + 프론트엔드)
npm run dev
```

### 개별 실행
```bash
# 백엔드만 실행
npm run dev:backend

# 프론트엔드만 실행
npm run dev:frontend
```

### 환경 설정
```bash
# 백엔드 환경변수 (.env)
cd backend
echo "PORT=3001" >> .env
echo "NODE_ENV=development" >> .env

# 프론트엔드 환경변수 (.env)
cd ../frontend  
echo "VITE_API_URL=http://localhost:3001" >> .env
```

## 📱 주요 기능

1. **성별 선택** - 추천 알고리즘의 기준 설정
2. **셀카 촬영/업로드** - 카메라 또는 갤러리에서 사진 가져오기
3. **얼굴형 분석** - MediaPipe 기반 얼굴 윤곽 감지 및 분류
4. **결과 제시** - 분석된 얼굴형과 설명 제공
5. **헤어스타일 추천** - 얼굴형별 맞춤 스타일 3종 추천
6. **연예인 스타일** - 각 추천 스타일의 연예인 레퍼런스 제공

## 🎯 얼굴형 분류

- 타원형 (Oval)
- 둥근형 (Round)
- 긴형 (Oblong)
- 각진형 (Square)
- 하트형 (Heart)
- 역삼각형 (Inverted Triangle)

## 📂 프로젝트 구조

```
hairmatch/
├── backend/                    # NestJS API 서버
│   ├── src/
│   │   ├── app.module.ts      # 루트 모듈
│   │   ├── main.ts            # 애플리케이션 진입점
│   │   ├── face-analysis/     # 얼굴형 분석 모듈
│   │   ├── recommendation/    # 추천 모듈
│   │   └── common/            # 공통 타입 및 DTO
│   ├── package.json
│   └── README.md
├── frontend/                   # React + Vite 웹앱
│   ├── src/
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── components/        # 재사용 컴포넌트
│   │   ├── services/          # API 서비스
│   │   ├── types/             # TypeScript 타입
│   │   └── App.tsx
│   ├── package.json
│   └── README.md
├── PRD.md                      # 제품 요구사항 문서
├── package.json                # 워크스페이스 루트
└── README.md
```

## 🔧 개발 환경

- **Node.js**: 18+
- **Package Manager**: npm
- **Backend**: NestJS + TypeScript
- **Frontend**: React 18 + Vite + TailwindCSS
- **Database**: 향후 추가 예정
- **AI/ML**: MediaPipe (계획)

## 📱 사용자 플로우

1. **홈페이지** → 서비스 소개 및 시작
2. **성별 선택** → 추천 기준 설정
3. **사진 업로드** → 얼굴 이미지 업로드
4. **AI 분석** → 얼굴형 자동 분석
5. **결과 확인** → 얼굴형 분석 결과
6. **헤어스타일 추천** → 맞춤 스타일 3종 제시

## 🚧 개발 상태

현재 MVP(Minimum Viable Product) 단계로, 기본적인 UI/UX와 API 구조가 구현되어 있습니다.

### ✅ 완료된 기능
- 전체 프로젝트 구조 설정
- NestJS 백엔드 API 서버
- React 모바일 웹앱 UI
- 4단계 사용자 플로우
- Mock 얼굴형 분석 API
- 헤어스타일 추천 시스템

### 🔄 진행 중
- MediaPipe 얼굴 인식 통합
- 실제 얼굴형 분석 알고리즘
- 연예인 이미지 데이터베이스

### 📋 향후 계획
- 실시간 카메라 촬영
- 이미지 전처리 및 품질 개선
- 사용자 피드백 시스템
- 소셜 공유 기능

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 