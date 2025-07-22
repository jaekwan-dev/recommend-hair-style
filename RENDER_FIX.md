# 🔧 Render 배포 오류 해결 가이드

## ❌ 현재 문제점

```
빌드 명령어: npm install (잘못됨)
시작 명령어: node index.js (잘못됨)
결과: Cannot find module '/opt/render/project/src/index.js'
```

## ✅ 올바른 설정

### **방법 1: 빌드/시작 명령어 수정 (추천)**

Render 대시보드에서 다음과 같이 수정하세요:

**🔧 Build Command:**
```bash
cd backend && npm ci && npm run build
```

**🚀 Start Command:**
```bash
cd backend && npm run start:prod
```

### **방법 2: Root Directory 변경**

Render 설정에서:
- **Root Directory**: `backend` (루트를 backend 폴더로 변경)
- **Build Command**: `npm ci && npm run build`
- **Start Command**: `npm run start:prod`

## 📋 상세 설정 단계

### 1. **Render 대시보드 접속**
- 배포 실패한 서비스 클릭
- **Settings** → **Build & Deploy** 이동

### 2. **명령어 수정**
```diff
- Build Command: npm install
+ Build Command: cd backend && npm ci && npm run build

- Start Command: node index.js  
+ Start Command: cd backend && npm run start:prod
```

### 3. **환경 변수 설정**
**Environment Variables**에서 추가:
```
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://your-frontend-domain.com
```

### 4. **재배포 실행**
- **Manual Deploy** 클릭
- 또는 Git push로 자동 배포

## 🔍 예상 성공 로그

수정 후 다음과 같은 로그가 나와야 합니다:

```bash
==> Running build command 'cd backend && npm ci && npm run build'...
==> BUILD 성공
==> Running 'cd backend && npm run start:prod'
🚀 HairMatch Backend Server running on: http://localhost:10000
```

## 🚨 추가 문제 해결

만약 여전히 오류가 발생한다면:

### **package.json 확인**
backend/package.json의 scripts 확인:
```json
{
  "scripts": {
    "start": "node dist/main",
    "start:prod": "node dist/main",
    "build": "nest build"
  }
}
```

### **dist 폴더 확인**
빌드 후 `backend/dist/main.js` 파일이 생성되는지 확인

### **Render Blueprint 사용**
루트의 `render.yaml` 파일을 사용해 자동 설정:
```yaml
services:
  - type: web
    name: hairmatch-backend
    env: node
    region: singapore
    buildCommand: cd backend && npm ci && npm run build
    startCommand: cd backend && npm run start:prod
``` 