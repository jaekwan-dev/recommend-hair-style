import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '분석할 얼굴 이미지 파일 (JPG, PNG)',
  })
  image: any;
} 