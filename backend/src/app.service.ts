import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🎨 HairMatch Backend API - AI-powered hair style recommendation service';
  }
} 