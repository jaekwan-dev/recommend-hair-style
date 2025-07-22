import { Module } from '@nestjs/common';
import { FaceAnalysisController } from './face-analysis.controller';
import { FaceAnalysisService } from './face-analysis.service';

@Module({
  controllers: [FaceAnalysisController],
  providers: [FaceAnalysisService],
  exports: [FaceAnalysisService],
})
export class FaceAnalysisModule {} 