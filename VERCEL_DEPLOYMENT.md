# 🚀 Vercel Frontend 배포 가이드

## 🎯 **배포 전략**
- **Vercel**: React Frontend 배포 ⚛️
- **Render**: NestJS Backend 배포 🏗️

## ✅ **Vercel 설정 완료**

### **1. vercel.json 생성됨**
```json
{
  "buildCommand": "cd frontend && npm ci && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm ci",
  "framework": "vite"
}
```

### **2. PWA 지원**
- Service Worker 캐시 설정
- Manifest 파일 처리
- SPA 라우팅 지원

## 📋 **배포 단계**

### **1단계: Render Backend 먼저 배포**

Render 설정 수정:
```bash
Build Command: cd backend && npm ci && npm run build
Start Command: cd backend && npm run start:prod
```

### **2단계: Backend URL 확인**
배포 완료 후 URL 획득:
```
https://hairmatch-backend-xxxxx.onrender.com
```

### **3단계: Frontend 환경변수 설정**

Vercel 대시보드에서:
**Settings** → **Environment Variables**

```
VITE_API_URL=https://hairmatch-backend-xxxxx.onrender.com
```

### **4단계: Vercel 재배포**
- Vercel 대시보드에서 **Redeploy**
- 또는 Git push로 자동 배포

## 🔧 **예상 성공 로그**

### **Vercel (Frontend)**
```bash
✓ Installing dependencies...
✓ Running "cd frontend && npm run build"
✓ Uploading output directory [frontend/dist]...
✓ Deployment ready [https://your-app.vercel.app]
```

### **Render (Backend)**  
```bash
✓ Running "cd backend && npm run build"
✓ NestJS build successful
✓ Starting server on port 10000
🚀 HairMatch Backend Server running
```

## 🌐 **최종 구조**

```
Frontend (Vercel)    Backend (Render)
    ↓                     ↓
https://your-app      https://backend
.vercel.app          .onrender.com
       ↓                 ↑
       └─── API 호출 ────┘
```

## ⚠️ **주의사항**

### **CORS 설정**
Backend의 `main.ts`에서 Vercel 도메인 허용:
```typescript
const corsOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CORS_ORIGIN || 'https://your-app.vercel.app']
  : ['http://localhost:5173'];
```

### **환경변수 업데이트**
배포 후 실제 URL로 변경:
```bash
# Render Backend 환경변수
CORS_ORIGIN=https://your-app.vercel.app

# Vercel Frontend 환경변수  
VITE_API_URL=https://hairmatch-backend-xxxxx.onrender.com
```

## 🚨 **대안: Monorepo 전체 배포**

만약 Vercel에서 전체를 배포하고 싶다면:

### **package.json 수정**
```json
{
  "scripts": {
    "build": "npm run install:all && npm run build:frontend",
    "install:all": "cd backend && npm ci && cd ../frontend && npm ci"
  }
}
```

### **vercel.json 수정**  
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist"
}
```

**하지만 추천은 Frontend(Vercel) + Backend(Render) 분리 배포입니다!** 🎯 