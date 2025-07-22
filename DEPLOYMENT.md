# HairMatch 배포 가이드

## 🚀 Render 백엔드 배포

### 1단계: Render 웹서비스 생성
1. Render 대시보드에서 **"New +"** 클릭
2. **"Web Service"** 선택
3. **GitHub 저장소 연결**:
   - Repository: `your-username/hairmatch`
   - Branch: `main`

### 2단계: 기본 설정
- **Name**: `hairmatch-backend`
- **Region**: `Singapore` (한국과 가장 가까움)
- **Branch**: `main`
- **Root Directory**: (비워둠)

### 3단계: 빌드 및 시작 명령어
```bash
# Build Command
cd backend && npm ci && npm run build

# Start Command  
cd backend && npm run start:prod
```

### 4단계: 환경변수 설정
```bash
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-frontend-domain.com
```

### 5단계: 플랜 선택
- **Free Tier**: 한계가 있지만 개발/테스트용으로 적합
- **Starter ($7/월)**: 프로덕션용 추천 (항상 실행, 더 나은 성능)

## 🌐 프론트엔드 API URL 업데이트

배포 완료 후 프론트엔드에서 API URL을 업데이트해야 합니다:

```bash
# frontend/.env.production
VITE_API_URL=https://hairmatch-backend-xxxxx.onrender.com
```

## ✅ 배포 확인

1. **백엔드 헬스체크**: `https://your-backend-url.onrender.com/health`
2. **API 테스트**: 프론트엔드에서 실제 API 호출 테스트
3. **로그 확인**: Render 대시보드에서 배포 로그 확인

## 🐛 문제 해결

### 빌드 실패 시
- 루트 디렉터리에 `package.json`이 있는지 확인
- `cd backend` 명령어가 올바른지 확인
- 의존성 설치 오류 확인

### CORS 에러 시
- `CORS_ORIGIN` 환경변수에 프론트엔드 도메인 정확히 입력
- `https://` 포함해서 전체 URL 입력

### 메모리 부족 시
- Free Tier에서 Starter 플랜으로 업그레이드 고려 