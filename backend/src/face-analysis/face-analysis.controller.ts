import { 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FaceAnalysisService } from './face-analysis.service';

@ApiTags('face-analysis')
@Controller('face-analysis')
export class FaceAnalysisController {
  private readonly logger = new Logger(FaceAnalysisController.name);

  constructor(private readonly faceAnalysisService: FaceAnalysisService) {}

  @Post('analyze')
  @ApiOperation({ 
    summary: '얼굴 사진을 분석하여 얼굴형을 판단합니다',
    description: '업로드된 이미지를 분석하여 얼굴형을 자동으로 판단하고 신뢰도와 함께 결과를 반환합니다.'
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ 
    status: 200, 
    description: '얼굴형 분석 결과가 성공적으로 반환됨',
    schema: {
      type: 'object',
      properties: {
        faceShape: { 
          type: 'string', 
          example: 'heart',
          enum: ['oval', 'round', 'oblong', 'square', 'heart', 'inverted_triangle'],
          description: '분석된 얼굴형 타입'
        },
        description: { 
          type: 'string', 
          example: '하트형 - 넓은 이마와 섬세한 턱선이 매력적입니다',
          description: '얼굴형에 대한 상세 설명'
        },
        confidence: { 
          type: 'number', 
          example: 0.85,
          minimum: 0,
          maximum: 1,
          description: '분석 결과의 신뢰도 (0-1 범위)'
        },
        landmarks: { 
          type: 'array', 
          items: { type: 'object' },
          description: '얼굴 랜드마크 포인트들 (향후 구현)'
        },
        imageInfo: {
          type: 'object',
          properties: {
            width: { type: 'number', description: '이미지 너비' },
            height: { type: 'number', description: '이미지 높이' },
            size: { type: 'number', description: '파일 크기 (바이트)' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (이미지 파일 없음, 잘못된 형식, 품질 문제 등)',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: '이미지 파일이 필요합니다' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: '얼굴형 분석 중 오류가 발생했습니다' },
        error: { type: 'string', example: 'Internal Server Error' }
      }
    }
  })
  @UseInterceptors(FileInterceptor('image', {
    limits: { 
      fileSize: 10 * 1024 * 1024, // 10MB로 증가
      files: 1 // 파일 개수 제한
    },
    fileFilter: (req, file, cb) => {
      // 허용되는 MIME 타입 확장
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/webp' // WebP 지원 추가
      ];
      
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
          new BadRequestException(
            `지원하지 않는 파일 형식입니다. 허용 형식: ${allowedMimeTypes.join(', ')}`
          ), 
          false
        );
      }
      
      // 파일명 검증 (선택사항)
      if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
        return cb(
          new BadRequestException('파일 확장자가 올바르지 않습니다'), 
          false
        );
      }
      
      cb(null, true);
    },
  }))
  async analyzeFace(@UploadedFile() file: Express.Multer.File) {
    const startTime = Date.now();
    
    try {
      // 기본 파일 검증
      if (!file) {
        throw new BadRequestException('이미지 파일이 필요합니다');
      }
      
      // 파일 버퍼 검증
      if (!file.buffer || file.buffer.length === 0) {
        throw new BadRequestException('업로드된 파일이 비어있습니다');
      }
      
      this.logger.log(`얼굴형 분석 시작: ${file.originalname} (${file.size} bytes, ${file.mimetype})`);
      
      // 얼굴형 분석 실행
      const result = await this.faceAnalysisService.analyzeFaceShape(file.buffer);
      
      const processingTime = Date.now() - startTime;
      this.logger.log(`얼굴형 분석 완료: ${result.faceShape} (${processingTime}ms)`);
      
      // 응답에 처리 시간과 추가 메타데이터 포함
      return {
        ...result,
        metadata: {
          processingTime,
          filename: file.originalname,
          mimetype: file.mimetype,
          uploadSize: file.size,
          analysisVersion: '2.0', // 버전 추가로 향후 업그레이드 추적
          timestamp: new Date().toISOString()
        }
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      
      if (error instanceof BadRequestException) {
        // 사용자 오류 (4xx)
        this.logger.warn(`얼굴형 분석 사용자 오류: ${error.message} (${processingTime}ms)`);
        throw error;
      } else {
        // 서버 오류 (5xx)
        this.logger.error(`얼굴형 분석 서버 오류: ${error.message}`, error.stack);
        throw new HttpException(
          {
            message: '얼굴형 분석 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            error: 'Internal Server Error',
            timestamp: new Date().toISOString(),
            processingTime
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  @Post('health')
  @ApiOperation({ summary: '얼굴 분석 서비스 상태 확인' })
  @ApiResponse({ 
    status: 200, 
    description: '서비스 정상 작동 중',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        service: { type: 'string', example: 'face-analysis' },
        version: { type: 'string', example: '2.0' },
        timestamp: { type: 'string', example: '2025-01-22T14:30:00.000Z' }
      }
    }
  })
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'face-analysis',
      version: '2.0',
      features: [
        'image-based-heuristic-analysis',
        'enhanced-error-handling',
        'multiple-format-support',
        'quality-validation'
      ],
      timestamp: new Date().toISOString()
    };
  }
} 