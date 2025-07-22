import { 
  Controller, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { FaceAnalysisService } from './face-analysis.service';

@ApiTags('face-analysis')
@Controller('face-analysis')
export class FaceAnalysisController {
  constructor(private readonly faceAnalysisService: FaceAnalysisService) {}

  @Post('analyze')
  @ApiOperation({ summary: '얼굴 사진을 분석하여 얼굴형을 판단합니다' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ 
    status: 200, 
    description: '얼굴형 분석 결과',
    schema: {
      type: 'object',
      properties: {
        faceShape: { type: 'string', example: 'heart' },
        description: { type: 'string', example: '광대가 넓고 턱이 좁은 얼굴형' },
        confidence: { type: 'number', example: 0.85 },
        landmarks: { type: 'array', items: { type: 'object' } }
      }
    }
  })
  @UseInterceptors(FileInterceptor('image', {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new BadRequestException('이미지 파일만 업로드 가능합니다'), false);
      }
      cb(null, true);
    },
  }))
  async analyzeFace(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('이미지 파일이 필요합니다');
    }

    return await this.faceAnalysisService.analyzeFaceShape(file.buffer);
  }
} 