# 🆓 얼굴형 분석 무료 API 가이드

## 🏆 **추천 TOP 3**

### **1. Google MediaPipe (최고 추천) ⭐⭐⭐⭐⭐**

**💰 가격**: 100% 무료  
**🌐 타입**: 클라이언트 사이드 (브라우저/앱)  
**📊 정확도**: 매우 높음 (Google 개발)

```javascript
// 사용 예시
import { FaceMesh } from '@mediapipe/face_mesh';

const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});

faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

// 468개 얼굴 랜드마크 포인트 제공
// 실시간 분석 가능
```

**✅ 장점**:
- 완전 무료 (제한 없음)
- 468개 정밀 랜드마크 포인트
- 실시간 처리 가능
- 클라이언트에서 처리 (프라이버시 보호)
- Google의 최신 AI 기술

**❌ 단점**:
- 브라우저/모바일에서만 실행
- 서버 사이드 불가능

### **2. Face++ (Face Plus Plus) ⭐⭐⭐⭐**

**💰 가격**: 무료 티어 (1,000 API calls/월)  
**🌐 타입**: 클라우드 API  
**📊 정확도**: 높음 (상업적 검증된 서비스)

```javascript
// API 사용 예시
const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/detect', {
  method: 'POST',
  body: formData,
  headers: {
    'API-Key': 'your-api-key',
    'API-Secret': 'your-api-secret'
  }
});

// 106개 또는 83개 랜드마크 포인트
// 얼굴 속성 분석 (나이, 성별, 표정 등)
```

**✅ 장점**:
- 검증된 상업적 서비스
- 다양한 얼굴 속성 분석
- SDK 제공 (iOS, Android)
- 정확한 랜드마크 감지

**❌ 단점**:
- 월 1,000회 제한
- API 키 필요

### **3. API4AI Face Analysis ⭐⭐⭐⭐**

**💰 가격**: 7,000 이미지 무료 시작  
**🌐 타입**: 클라우드 API  
**📊 정확도**: 높음

```bash
# API 사용 예시
curl -X "POST" \
  "https://demo.api4ai.cloud/face-analyzer/v1/results" \
  -F "url=your-image-url"
```

**✅ 장점**:
- 넉넉한 무료 할당량
- 얼굴 인식 + 비교 기능
- 키포인트 감지
- 간단한 API

**❌ 단점**:
- 7,000회 후 유료

---

## 🔄 **기타 옵션들**

### **4. EnFace AI**
- **무료**: 7,000 이미지 검색 무료
- **특징**: 99.74% 정확도, 240+ 국가 문서 인식
- **용도**: KYC, 신원 확인

### **5. Inferdo Computer Vision**
- **무료**: 5,000 이미지/월
- **가격**: $0.0005/이미지 (경쟁력 있음)
- **특징**: Face Detection + Details

### **6. Betaface API**
- **무료**: 상업적/비상업적 모두 무료 (제한적)
- **특징**: 123개 얼굴 랜드마크
- **성능**: 큐잉으로 인한 지연 가능

---

## 🎯 **HairMatch에 맞는 선택**

### **추천 1: Google MediaPipe (최우선)**

```typescript
// backend/src/face-analysis/mediapipe-analysis.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaPipeAnalysisService {
  // 프론트엔드에서 MediaPipe로 랜드마크 추출
  // 백엔드로 좌표 데이터만 전송
  // 서버에서 얼굴형 분류 로직 처리
  
  analyzeFaceShapeFromLandmarks(landmarks: number[][]): FaceAnalysisResult {
    // 468개 포인트에서 얼굴형 분석 로직
    return this.classifyFaceShapeFromCoordinates(landmarks);
  }
}
```

### **추천 2: Face++ (백업용)**

```typescript
// 월 1000회 제한이지만 개발/테스트용으로 충분
const facePlusPlus = {
  apiKey: process.env.FACEPP_API_KEY,
  apiSecret: process.env.FACEPP_API_SECRET,
  endpoint: 'https://api-us.faceplusplus.com/facepp/v3/detect'
};
```

---

## 💡 **통합 전략**

### **1. 하이브리드 접근법**
```typescript
// 1차: MediaPipe (클라이언트)
// 2차: Face++ (서버, 검증용)
// 3차: 자체 휴리스틱 (백업)

async analyzeFace(imageBuffer: Buffer): Promise<FaceAnalysisResult> {
  try {
    // MediaPipe 결과가 있으면 우선 사용
    if (mediapiperLandmarks) {
      return this.analyzeWithMediaPipe(mediapiperLandmarks);
    }
    
    // Face++ 월 할당량 확인 후 사용
    if (this.facePlusPlusQuotaAvailable()) {
      return await this.analyzeWithFacePlusPlus(imageBuffer);
    }
    
    // 휴리스틱 분석 (현재 구현)
    return await this.performHeuristicAnalysis(imageInfo);
    
  } catch (error) {
    return this.getFallbackResult(error.message);
  }
}
```

### **2. 단계별 구현 계획**

**🔥 즉시 (1주일)**:
- MediaPipe 프론트엔드 통합
- 468개 랜드마크로 정확한 얼굴형 분석

**📈 확장 (1개월)**:
- Face++ API 백업 시스템
- 사용량 모니터링 시스템

**🚀 장기 (3개월)**:
- 자체 ML 모델 훈련
- 정확도 개선

---

## ⚡ **즉시 적용 가능한 해결책**

### **MediaPipe 통합**

**프론트엔드 (React)**:
```bash
npm install @mediapipe/face_mesh
```

**백엔드 개선**:
```typescript
// 468개 포인트에서 정확한 얼굴형 분석
private classifyFaceShapeFromLandmarks(landmarks: number[][]): FaceAnalysisResult {
  const faceWidth = this.calculateFaceWidth(landmarks);
  const faceHeight = this.calculateFaceHeight(landmarks);
  const jawlineAngle = this.calculateJawlineAngle(landmarks);
  const cheekboneWidth = this.calculateCheekboneWidth(landmarks);
  
  // 정밀한 분류 로직
  return this.preciseFaceShapeClassification({
    faceWidth, faceHeight, jawlineAngle, cheekboneWidth
  });
}
```

## 🎉 **결론**

**HairMatch에 가장 적합한 조합**:
1. **MediaPipe** (메인) - 무료, 정확, 실시간
2. **Face++** (백업) - 월 1,000회, 검증용
3. **현재 휴리스틱** (최후) - 안전장치

이 조합으로 **"너무 쉽게 실패하는" 문제를 완전히 해결**하면서도 **비용은 거의 무료**로 유지할 수 있습니다! 🚀✨ 