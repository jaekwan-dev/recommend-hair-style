# 📄 Product Requirements Document (PRD)

## 🧰 프로젝트 개요

- **프로젝트명**: HairMatch (임시)
- **목표**: 사용자가 셀카 한 장을 촬영하면 얼굴형을 자동 분석하고, 얼굴형에 어울리는 헤어스타일 3종과 유사한 연예인 스타일을 추천한다.
- **대상 플랫폼**: 모바일 웹앱 (PWA 형태 가능)
- **개발 방향**: 오픈소스 및 무료 API 기반의 MVP

---

## 🧩 핵심 기능 목록 (MVP)

### 1. 성별 입력
- **기능 설명**: 사용자에게 성별을 질문하여 이후 추천 알고리즘의 기준으로 사용
- **입력 형식**: 버튼 선택 (남성 / 여성)

### 2. 셀카 촬영 또는 업로드
- **기능 설명**: 사용자가 카메라로 사진을 찍거나 갤러리에서 불러오기 가능
- **조건**
  - 모바일 카메라 접근 권한
  - 기본적인 피부톤 보정 필터 자동 적용

### 3. 얼굴형 분석
- **기능 설명**: 업로드된 얼굴 사진에서 얼굴 윤곽을 감지하고, 얼굴형을 분류
- **기술 스택**
  - **MediaPipe FaceMesh** (Google 제공, 무료)
  - 혹은 **Dlib + shape_predictor_68_face_landmarks.dat**
- **분류 유형**
  - 타원형 (Oval)
  - 둥근형 (Round)
  - 긴형 (Oblong)
  - 각진형 (Square)
  - 하트형 (Heart)
  - 역삼각형 (Inverted Triangle)

### 4. 얼굴형 결과 및 설명 제공
- **기능 설명**: 분석된 얼굴형 결과를 사용자에게 간략하게 보여줌
- **예시 출력**
  - "당신의 얼굴형은 하트형입니다. 턱이 뾰족하고 광대가 넓은 편입니다."

### 5. 헤어스타일 추천
- **기능 설명**: 얼굴형 + 성별 기반으로 어울리는 헤어스타일 3종 추천
- **기준**
  - 룰 기반 추천 로직 (JSON or rule.js)
- **각 추천 항목 구성**
  - 스타일 명칭
  - 설명 키워드 (ex: 레이어컷, 가르마펌)
  - 예시 이미지

### 6. 연예인 스타일 이미지 제시
- **기능 설명**: 추천된 각 스타일과 유사한 연예인의 사진 제공
- **데이터**
  - 사전 수집된 공개 연예인 이미지 (웹 크롤링 또는 퍼블릭 데이터셋)
  - 예: IU, 박보검 등 공공적으로 사용 가능한 프레임에서 최소한의 저작권 침해 없는 이미지 사용
  - **라이선스 주의 필수** (CC-BY, 퍼블릭 도메인 위주)

---

## 🔧 기술 스택 및 API

| 기능 | 기술/도구 | 무료 여부 |
|------|-----------|-----------|
| 얼굴 landmark 추출 | MediaPipe (Google) | ✅ 무료 |
| 얼굴형 분류 | Rule-based Python logic | ✅ 자체 구현 |
| 사진 전처리 (피부 보정) | OpenCV + 필터 | ✅ 무료 |
| 연예인 사진 매칭 | 사전 저장 이미지 / 공개 이미지 | ✅ 수동 수집 |
| 프론트엔드 | React + Vite + TailwindCSS | ✅ 무료 |
| 백엔드 API | FastAPI (Python) | ✅ 무료 |
| 배포 | Vercel / Firebase Hosting / Render | ✅ 무료 tier 존재 |
| 이미지 저장 | Base64 처리 or local memory | ✅ 무료 방식 사용 |

---

## 📱 사용자 흐름 (User Flow)

1. **성별 선택 화면**
   - [남성] [여성]

2. **사진 업로드 화면**
   - [카메라로 찍기] / [사진 업로드]
   - → 피부톤 자동 보정

3. **얼굴형 분석 결과 화면**
   - "당신의 얼굴형은 ○○형입니다"
   - 간략한 설명 제공

4. **헤어스타일 추천 화면**
   - 추천 1 (이미지 + 설명 + 연예인 사진)
   - 추천 2 (이미지 + 설명 + 연예인 사진)
   - 추천 3 (이미지 + 설명 + 연예인 사진)

---

## 📦 데이터 구성 (예시)

### 얼굴형 분류 규칙 (pseudo JSON)

```json
{
  "heart": {
    "description": "광대가 넓고 턱이 좁은 얼굴형",
    "styles": ["시스루뱅", "숏컷", "레이어드컷"],
    "celebrities": ["아이유", "한소희"]
  }
}
``` 