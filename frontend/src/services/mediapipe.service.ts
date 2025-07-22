import { FaceMesh } from '@mediapipe/face_mesh'

export interface MediaPipeLandmark {
  x: number
  y: number
  z: number
}

export interface FaceLandmarks {
  landmarks: MediaPipeLandmark[][]
  imageWidth: number
  imageHeight: number
}

export interface FaceAnalysisFromLandmarks {
  faceShape: 'oval' | 'round' | 'oblong' | 'square' | 'heart' | 'inverted_triangle'
  confidence: number
  measurements: {
    faceWidth: number
    faceHeight: number
    jawWidth: number
    cheekboneWidth: number
    foreheadWidth: number
    jawlineAngle: number
    aspectRatio: number
  }
}

class MediaPipeService {
  private faceMesh: FaceMesh | null = null
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('✅ MediaPipe 이미 초기화됨')
      return
    }

    if (this.initializationPromise) {
      console.log('⏳ MediaPipe 초기화 대기 중...')
      return this.initializationPromise
    }

    this.initializationPromise = this.doInitialize()
    return this.initializationPromise
  }

  private async doInitialize(): Promise<void> {
    try {
      console.log('🚀 MediaPipe Face Mesh 초기화 시작...')

      // MediaPipe 가용성 체크
      if (typeof FaceMesh === 'undefined') {
        throw new Error('MediaPipe FaceMesh를 로드할 수 없습니다')
      }

      this.faceMesh = new FaceMesh({
        locateFile: (file) => {
          const url = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
          console.log(`📦 MediaPipe 파일 로드: ${url}`)
          return url
        }
      })

      console.log('⚙️ MediaPipe 옵션 설정 중...')
      this.faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      })

      // 테스트용 더미 캔버스로 초기화 확인
      const testCanvas = document.createElement('canvas')
      testCanvas.width = 100
      testCanvas.height = 100
      const ctx = testCanvas.getContext('2d')!
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, 100, 100)

      // 초기화 완료 테스트
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('MediaPipe 초기화 타임아웃'))
        }, 10000) // 10초 타임아웃

        this.faceMesh!.onResults((_results) => {
          clearTimeout(timeout)
          console.log('✅ MediaPipe 초기화 테스트 완료')
          resolve()
        })

        try {
          this.faceMesh!.send({ image: testCanvas })
        } catch (error) {
          clearTimeout(timeout)
          reject(error)
        }
      })

      this.isInitialized = true
      console.log('✅ MediaPipe Face Mesh 초기화 완료!')
      
    } catch (error) {
      console.error('❌ MediaPipe 초기화 실패:', error)
      this.isInitialized = false
      this.initializationPromise = null
      throw error
    }
  }

  async extractLandmarks(imageFile: File): Promise<FaceLandmarks | null> {
    console.log('🔍 랜드마크 추출 시작:', {
      fileName: imageFile.name,
      fileSize: imageFile.size,
      fileType: imageFile.type
    })

    if (!this.faceMesh || !this.isInitialized) {
      console.log('⚠️ MediaPipe 미초기화, 초기화 중...')
      await this.initialize()
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      const timeout = setTimeout(() => {
        reject(new Error('이미지 처리 타임아웃 (30초)'))
      }, 30000)
      
      img.onload = () => {
        try {
          console.log('📸 이미지 로드 완료:', {
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          })

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')!
          canvas.width = img.naturalWidth || img.width
          canvas.height = img.naturalHeight || img.height
          ctx.drawImage(img, 0, 0)

          console.log('🎨 캔버스 생성 완료:', {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height
          })

          let resultReceived = false

          this.faceMesh!.onResults((results) => {
            if (resultReceived) return
            resultReceived = true
            
            clearTimeout(timeout)
            
            console.log('📊 MediaPipe 결과:', {
              multiFaceLandmarks: results.multiFaceLandmarks?.length || 0,
              hasLandmarks: !!(results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0)
            })

            if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
              const landmarks = results.multiFaceLandmarks[0]
              console.log('✅ 랜드마크 추출 성공:', {
                landmarkCount: landmarks.length,
                firstLandmark: landmarks[0],
                lastLandmark: landmarks[landmarks.length - 1]
              })

              resolve({
                landmarks: results.multiFaceLandmarks,
                imageWidth: canvas.width,
                imageHeight: canvas.height
              })
            } else {
              console.warn('⚠️ 얼굴 랜드마크 없음')
              resolve(null)
            }
          })

          console.log('🚀 MediaPipe 처리 시작...')
          this.faceMesh!.send({ image: canvas })

        } catch (error) {
          clearTimeout(timeout)
          console.error('❌ 이미지 처리 중 에러:', error)
          reject(error)
        }
      }

      img.onerror = (error) => {
        clearTimeout(timeout)
        console.error('❌ 이미지 로드 실패:', error)
        reject(new Error('이미지 로드 실패'))
      }

      try {
        img.src = URL.createObjectURL(imageFile)
        console.log('🔗 이미지 URL 생성 완료')
      } catch (error) {
        clearTimeout(timeout)
        console.error('❌ 이미지 URL 생성 실패:', error)
        reject(error)
      }
    })
  }

  // 468개 랜드마크에서 얼굴형 분석
  analyzeFaceShape(landmarks: MediaPipeLandmark[]): FaceAnalysisFromLandmarks {
    console.log('🎯 얼굴형 분석 시작:', {
      landmarkCount: landmarks.length,
      sampleLandmarks: landmarks.slice(0, 5)
    })

    const measurements = this.calculateFaceMeasurements(landmarks)
    const faceShape = this.classifyFaceShape(measurements)
    const confidence = this.calculateConfidence(measurements)

    const result = {
      faceShape,
      confidence,
      measurements
    }

    console.log('✅ 얼굴형 분석 완료:', result)
    return result
  }

  private calculateFaceMeasurements(landmarks: MediaPipeLandmark[]) {
    try {
      // 주요 얼굴 포인트들 (MediaPipe Face Mesh 468 포인트 기준)
      const faceOval = {
        top: landmarks[10],        // 이마 위
        bottom: landmarks[152],    // 턱 아래
        left: landmarks[234],      // 왼쪽 볼
        right: landmarks[454]      // 오른쪽 볼
      }

      const jawline = {
        left: landmarks[172],      // 왼쪽 턱선
        right: landmarks[397],     // 오른쪽 턱선
        center: landmarks[18]      // 턱 중앙
      }

      const cheekbones = {
        left: landmarks[137],      // 왼쪽 광대뼈
        right: landmarks[366]      // 오른쪽 광대뼈
      }

      const forehead = {
        left: landmarks[21],       // 왼쪽 이마
        right: landmarks[251],     // 오른쪽 이마
        center: landmarks[9]       // 이마 중앙
      }

      // 거리 계산
      const faceHeight = this.calculateDistance(faceOval.top, faceOval.bottom)
      const faceWidth = this.calculateDistance(faceOval.left, faceOval.right)
      const jawWidth = this.calculateDistance(jawline.left, jawline.right)
      const cheekboneWidth = this.calculateDistance(cheekbones.left, cheekbones.right)
      const foreheadWidth = this.calculateDistance(forehead.left, forehead.right)

      // 턱선 각도 계산
      const jawlineAngle = this.calculateJawlineAngle(jawline.left, jawline.center, jawline.right)
      
      // 종횡비
      const aspectRatio = faceHeight / faceWidth

      console.log('📏 얼굴 측정값:', {
        faceHeight: faceHeight.toFixed(3),
        faceWidth: faceWidth.toFixed(3),
        aspectRatio: aspectRatio.toFixed(3),
        jawlineAngle: jawlineAngle.toFixed(1)
      })

      return {
        faceWidth,
        faceHeight,
        jawWidth,
        cheekboneWidth,
        foreheadWidth,
        jawlineAngle,
        aspectRatio
      }
    } catch (error) {
      console.error('❌ 측정값 계산 실패:', error)
      throw new Error('얼굴 측정 실패')
    }
  }

  private calculateDistance(point1: MediaPipeLandmark, point2: MediaPipeLandmark): number {
    const dx = point1.x - point2.x
    const dy = point1.y - point2.y
    const dz = point1.z - point2.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  private calculateJawlineAngle(left: MediaPipeLandmark, center: MediaPipeLandmark, right: MediaPipeLandmark): number {
    const vector1 = {
      x: left.x - center.x,
      y: left.y - center.y
    }
    const vector2 = {
      x: right.x - center.x,
      y: right.y - center.y
    }

    const dot = vector1.x * vector2.x + vector1.y * vector2.y
    const mag1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y)
    const mag2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y)
    
    const angle = Math.acos(dot / (mag1 * mag2)) * (180 / Math.PI)
    return angle
  }

  private classifyFaceShape(measurements: any): 'oval' | 'round' | 'oblong' | 'square' | 'heart' | 'inverted_triangle' {
    const { jawWidth, cheekboneWidth, foreheadWidth, jawlineAngle, aspectRatio } = measurements

    // 비율 계산
    const jawCheekRatio = jawWidth / cheekboneWidth
    const foreheadCheekRatio = foreheadWidth / cheekboneWidth
    const jawForeheadRatio = jawWidth / foreheadWidth

    console.log('🎯 얼굴형 분류 지표:', {
      aspectRatio: aspectRatio.toFixed(3),
      jawCheekRatio: jawCheekRatio.toFixed(3),
      foreheadCheekRatio: foreheadCheekRatio.toFixed(3),
      jawForeheadRatio: jawForeheadRatio.toFixed(3),
      jawlineAngle: jawlineAngle.toFixed(1)
    })

    // 얼굴형 분류 로직 (정밀한 기준)
    
    // 1. 둥근형 (Round)
    if (aspectRatio < 1.2 && jawCheekRatio > 0.8 && foreheadCheekRatio > 0.85) {
      console.log('🔵 둥근형으로 분류')
      return 'round'
    }
    
    // 2. 긴형 (Oblong)
    if (aspectRatio > 1.5 && jawCheekRatio > 0.75 && Math.abs(jawForeheadRatio - 1.0) < 0.2) {
      console.log('📏 긴형으로 분류')
      return 'oblong'
    }
    
    // 3. 각진형 (Square)
    if (aspectRatio >= 1.0 && aspectRatio <= 1.3 && jawlineAngle > 120 && Math.abs(jawForeheadRatio - 1.0) < 0.15) {
      console.log('⬛ 각진형으로 분류')
      return 'square'
    }
    
    // 4. 하트형 (Heart)
    if (foreheadCheekRatio > 0.9 && jawCheekRatio < 0.75 && jawlineAngle < 100) {
      console.log('❤️ 하트형으로 분류')
      return 'heart'
    }
    
    // 5. 역삼각형 (Inverted Triangle)
    if (jawCheekRatio > 0.95 && foreheadCheekRatio < 0.8 && jawlineAngle > 110) {
      console.log('🔺 역삼각형으로 분류')
      return 'inverted_triangle'
    }
    
    // 6. 타원형 (Oval) - 가장 균형잡힌 형태
    console.log('🥚 타원형으로 분류 (기본값)')
    return 'oval'
  }

  private calculateConfidence(measurements: any): number {
    const { aspectRatio, jawlineAngle } = measurements
    
    // 측정값의 일관성을 기반으로 신뢰도 계산
    let confidence = 0.7 // 기본 신뢰도

    // 극단적인 값들이 있으면 신뢰도 증가
    if (aspectRatio < 1.0 || aspectRatio > 1.8) confidence += 0.1
    if (jawlineAngle < 90 || jawlineAngle > 130) confidence += 0.1
    
    // 측정값들이 명확하면 신뢰도 증가
    if (measurements.faceWidth > 0 && measurements.faceHeight > 0) confidence += 0.1

    return Math.min(0.95, confidence)
  }
}

export const mediaPipeService = new MediaPipeService() 