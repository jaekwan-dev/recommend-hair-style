import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('hair-styles')
  @ApiOperation({ summary: '얼굴형과 성별에 따른 헤어스타일 추천' })
  @ApiQuery({ name: 'faceShape', enum: ['oval', 'round', 'oblong', 'square', 'heart', 'inverted_triangle'] })
  @ApiQuery({ name: 'gender', enum: ['male', 'female'] })
  @ApiResponse({ 
    status: 200, 
    description: '추천 헤어스타일 목록',
    schema: {
      type: 'object',
      properties: {
        recommendations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              description: { type: 'string' },
              imageUrl: { type: 'string' },
              celebrity: { 
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  imageUrl: { type: 'string' }
                }
              },
              tags: { type: 'array', items: { type: 'string' } },
              suitabilityReason: { type: 'string' }
            }
          }
        },
        totalCount: { type: 'number' },
        faceShapeDescription: { type: 'string' },
        generalTips: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  getHairStyleRecommendations(
    @Query('faceShape') faceShape: string,
    @Query('gender') gender: 'male' | 'female'
  ) {
    return this.recommendationService.getHairStyleRecommendations(
      faceShape as any, 
      gender
    );
  }

  @Get('face-shapes')
  @ApiOperation({ summary: '지원되는 모든 얼굴형 목록' })
  @ApiResponse({ 
    status: 200, 
    description: '얼굴형 목록',
    schema: {
      type: 'object',
      properties: {
        faceShapes: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  getSupportedFaceShapes() {
    return {
      faceShapes: this.recommendationService.getSupportedFaceShapes()
    };
  }

  @Get('hair-styles/:styleId')
  @ApiOperation({ summary: '특정 헤어스타일의 상세 정보' })
  @ApiParam({ name: 'styleId', type: 'string', description: '헤어스타일 ID' })
  @ApiResponse({ 
    status: 200, 
    description: '헤어스타일 상세 정보' 
  })
  @ApiResponse({ 
    status: 404, 
    description: '헤어스타일을 찾을 수 없음' 
  })
  getHairStyleDetail(@Param('styleId') styleId: string) {
    const style = this.recommendationService.getHairStyleDetail(styleId);
    if (!style) {
      return { error: '해당 헤어스타일을 찾을 수 없습니다.', styleId };
    }
    return style;
  }
} 