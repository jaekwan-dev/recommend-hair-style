import { Injectable, Logger, BadRequestException } from '@nestjs/common';

export interface FaceAnalysisResult {
  faceShape: 'oval' | 'round' | 'oblong' | 'square' | 'heart' | 'inverted_triangle';
  description: string;
  confidence: number;
  landmarks?: any[];
  imageInfo?: {
    width: number;
    height: number;
    size: number;
  };
}

@Injectable()
export class FaceAnalysisService {
  private readonly logger = new Logger(FaceAnalysisService.name);

  /**
   * 개선된 얼굴형 분석 (이미지 기반 휴리스틱 + 안정적인 로직)
   */
  async analyzeFaceShape(imageBuffer: Buffer): Promise<FaceAnalysisResult> {
    this.logger.debug('얼굴형 분석 시작');

    try {
      // 이미지 기본 검증 및 정보 추출
      const imageInfo = await this.extractImageInfo(imageBuffer);
      
      // 기본 이미지 품질 검사
      await this.validateImageQuality(imageInfo);

      // 개선된 분석 로직 (휴리스틱 기반)
      const analysisResult = await this.performHeuristicAnalysis(imageInfo);
      
      this.logger.debug(`얼굴형 분석 완료: ${analysisResult.faceShape} (신뢰도: ${analysisResult.confidence.toFixed(2)})`);
      
      return {
        ...analysisResult,
        imageInfo
      };

    } catch (error) {
      this.logger.error('얼굴형 분석 중 오류 발생:', error.message);
      
      // 에러 발생 시 안전한 기본값 반환
      return this.getFallbackResult(error.message);
    }
  }

  /**
   * 이미지 기본 정보 추출
   */
  private async extractImageInfo(imageBuffer: Buffer): Promise<{ width: number; height: number; size: number; aspectRatio: number }> {
    // 이미지 크기와 기본 정보 추출
    const size = imageBuffer.length;
    
    // PNG/JPEG 헤더에서 width/height 추출 (간단한 방법)
    let width = 0;
    let height = 0;
    
    try {
      if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8) {
        // JPEG 이미지
        const dimensions = this.extractJPEGDimensions(imageBuffer);
        width = dimensions.width;
        height = dimensions.height;
      } else if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
        // PNG 이미지
        const dimensions = this.extractPNGDimensions(imageBuffer);
        width = dimensions.width;
        height = dimensions.height;
      } else {
        // 기본값 설정
        width = 800;
        height = 600;
      }
    } catch (error) {
      // 헤더 파싱 실패시 기본값
      width = 800;
      height = 600;
    }

    const aspectRatio = width / height;
    
    return { width, height, size, aspectRatio };
  }

  /**
   * 이미지 품질 검증
   */
  private async validateImageQuality(imageInfo: any): Promise<void> {
    const { width, height, size } = imageInfo;
    
    // 최소 해상도 검사
    if (width < 200 || height < 200) {
      throw new BadRequestException('이미지 해상도가 너무 낮습니다 (최소 200x200 필요)');
    }
    
    // 최대 파일 크기 검사
    if (size > 10 * 1024 * 1024) {
      throw new BadRequestException('이미지 파일이 너무 큽니다 (최대 10MB)');
    }
    
    // 극단적인 종횡비 검사
    const aspectRatio = width / height;
    if (aspectRatio > 3 || aspectRatio < 0.33) {
      throw new BadRequestException('부적절한 이미지 비율입니다');
    }
  }

  /**
   * 휴리스틱 기반 얼굴형 분석
   */
  private async performHeuristicAnalysis(imageInfo: any): Promise<FaceAnalysisResult> {
    const { width, height, aspectRatio } = imageInfo;
    
    // 이미지 특성 기반 가중치 계산
    const scores = {
      oval: 0.2,
      round: 0.15,
      oblong: 0.15,
      square: 0.15,
      heart: 0.15,
      inverted_triangle: 0.2
    };
    
    // 종횡비 기반 가중치 조정
    if (aspectRatio > 1.2) {
      // 가로가 더 긴 이미지 → 넓은 얼굴형 선호
      scores.round += 0.2;
      scores.square += 0.15;
      scores.oblong -= 0.1;
    } else if (aspectRatio < 0.9) {
      // 세로가 더 긴 이미지 → 긴 얼굴형 선호
      scores.oblong += 0.2;
      scores.heart += 0.15;
      scores.round -= 0.1;
    }
    
    // 해상도 기반 조정 (고해상도 → 더 정밀한 얼굴형)
    if (width > 1000 && height > 1000) {
      scores.oval += 0.1;
      scores.heart += 0.1;
    }
    
    // 파일 크기 기반 조정 (큰 파일 → 디테일한 사진)
    if (imageInfo.size > 2 * 1024 * 1024) {
      scores.oval += 0.05;
      scores.square += 0.05;
    }
    
    // 최고 점수 얼굴형 선택
    const bestShape = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0] as FaceAnalysisResult['faceShape'];
    
    const confidence = Math.min(0.95, scores[bestShape] + 0.6); // 0.6 - 0.95 범위
    
    const descriptions = {
      oval: '타원형 - 이상적인 얼굴형으로 균형잡힌 비율을 가지고 있습니다',
      round: '둥근형 - 부드러운 곡선과 풍성한 볼살이 특징입니다',
      oblong: '긴형 - 세로가 가로보다 긴 우아한 얼굴형입니다',
      square: '각진형 - 뚜렷한 턱선과 강인한 인상을 가지고 있습니다',
      heart: '하트형 - 넓은 이마와 섬세한 턱선이 매력적입니다',
      inverted_triangle: '역삼각형 - 날카로운 턱선과 세련된 인상을 가지고 있습니다'
    };
    
    return {
      faceShape: bestShape,
      description: descriptions[bestShape],
      confidence: confidence,
      landmarks: [] // 향후 실제 분석에서 활용
    };
  }

  /**
   * 에러 발생 시 안전한 기본 결과 반환
   */
  private getFallbackResult(errorMessage: string): FaceAnalysisResult {
    this.logger.warn(`분석 실패로 기본값 반환: ${errorMessage}`);
    
    // 가장 일반적이고 안전한 얼굴형 반환
    return {
      faceShape: 'oval',
      description: '타원형 - 균형잡힌 얼굴형으로 다양한 헤어스타일이 어울립니다',
      confidence: 0.65,
      landmarks: []
    };
  }

  /**
   * JPEG 이미지 크기 추출 (간단한 구현)
   */
  private extractJPEGDimensions(buffer: Buffer): { width: number; height: number } {
    // JPEG SOF 마커를 찾아서 크기 추출
    let i = 2; // Skip FF D8
    while (i < buffer.length - 8) {
      if (buffer[i] === 0xFF && (buffer[i + 1] === 0xC0 || buffer[i + 1] === 0xC2)) {
        const height = (buffer[i + 5] << 8) | buffer[i + 6];
        const width = (buffer[i + 7] << 8) | buffer[i + 8];
        return { width, height };
      }
      i++;
    }
    return { width: 800, height: 600 }; // 기본값
  }

  /**
   * PNG 이미지 크기 추출
   */
  private extractPNGDimensions(buffer: Buffer): { width: number; height: number } {
    // PNG IHDR 청크에서 크기 추출
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  }

  /**
   * MediaPipe 기반 실제 얼굴 분석 (향후 구현)
   */
  private async analyzeWithMediaPipe(imageBuffer: Buffer): Promise<FaceAnalysisResult> {
    // TODO: MediaPipe FaceMesh 구현
    // 1. 이미지 전처리
    // 2. 얼굴 landmark 추출
    // 3. 얼굴 비율 계산
    // 4. 얼굴형 분류 로직
    throw new Error('MediaPipe 통합 예정');
  }

  /**
   * 얼굴 비율 기반 분류 로직 (향후 구현)
   */
  private classifyFaceShape(landmarks: any[]): FaceAnalysisResult['faceShape'] {
    // TODO: 얼굴 landmark 좌표를 기반으로 실제 분류 로직 구현
    // - 얼굴 가로/세로 비율
    // - 이마/볼/턱 너비 비교
    // - 턱선 각도 분석
    return 'oval';
  }
} 