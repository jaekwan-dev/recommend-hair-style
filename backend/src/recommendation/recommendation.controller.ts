import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
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
              celebrity: { type: 'object' },
              tags: { type: 'array', items: { type: 'string' } }
            }
          }
        },
        totalCount: { type: 'number' }
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

  @Get('celebrities')
  @ApiOperation({ summary: '특정 헤어스타일의 연예인 레퍼런스' })
  @ApiQuery({ name: 'styleId', type: 'string' })
  @ApiResponse({ 
    status: 200, 
    description: '연예인 레퍼런스 목록' 
  })
  getCelebrityReferences(@Query('styleId') styleId: string) {
    return this.recommendationService.getCelebrityReferences(styleId);
  }
} 