import { Injectable } from '@nestjs/common';

export interface HairStyleRecommendation {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  celebrity: {
    name: string;
    imageUrl: string;
  };
  tags: string[];
}

export interface RecommendationResponse {
  recommendations: HairStyleRecommendation[];
  totalCount: number;
}

@Injectable()
export class RecommendationService {
  
  // 얼굴형별 헤어스타일 데이터 (실제로는 DB나 외부 API에서 가져올 수 있음)
  private readonly hairStyleData = {
    heart: {
      male: [
        {
          id: 'heart-m-1',
          name: '사이드 파트 스타일',
          description: '옆으로 나눈 헤어로 이마를 적당히 가려주는 스타일',
          imageUrl: '/images/styles/heart-male-1.jpg',
          celebrity: { name: '박보검', imageUrl: '/images/celebrities/park-bogum.jpg' },
          tags: ['사이드파트', '클래식', '깔끔']
        },
        {
          id: 'heart-m-2',
          name: '댄디컷',
          description: '깔끔하게 정리된 단발로 하트형 얼굴에 잘 어울림',
          imageUrl: '/images/styles/heart-male-2.jpg',
          celebrity: { name: '공유', imageUrl: '/images/celebrities/gong-yoo.jpg' },
          tags: ['댄디컷', '비즈니스', '단정']
        },
        {
          id: 'heart-m-3',
          name: '텍스처드 크롭',
          description: '자연스러운 볼륨감으로 얼굴 비율 보완',
          imageUrl: '/images/styles/heart-male-3.jpg',
          celebrity: { name: '이민호', imageUrl: '/images/celebrities/lee-minho.jpg' },
          tags: ['텍스처', '모던', '볼륨']
        }
      ],
      female: [
        {
          id: 'heart-f-1',
          name: '시스루 뱅',
          description: '얇은 앞머리로 넓은 이마를 자연스럽게 커버',
          imageUrl: '/images/styles/heart-female-1.jpg',
          celebrity: { name: '아이유', imageUrl: '/images/celebrities/iu.jpg' },
          tags: ['시스루뱅', '자연스럽', '여성스러운']
        },
        {
          id: 'heart-f-2',
          name: '레이어드 컷',
          description: '층층이 쌓인 레이어로 볼륨감과 동적인 느낌',
          imageUrl: '/images/styles/heart-female-2.jpg',
          celebrity: { name: '한소희', imageUrl: '/images/celebrities/han-sohee.jpg' },
          tags: ['레이어드', '볼륨', '세련']
        },
        {
          id: 'heart-f-3',
          name: '긴 웨이브',
          description: '긴 웨이브로 얼굴형 보정과 우아한 느낌',
          imageUrl: '/images/styles/heart-female-3.jpg',
          celebrity: { name: '송혜교', imageUrl: '/images/celebrities/song-hyegyo.jpg' },
          tags: ['웨이브', '로맨틱', '우아']
        }
      ]
    },
    round: {
      male: [
        {
          id: 'round-m-1',
          name: '언더컷',
          description: '사이드를 짧게 깎아 얼굴을 슬림하게 보이게 하는 스타일',
          imageUrl: '/images/styles/round-male-1.jpg',
          celebrity: { name: '송중기', imageUrl: '/images/celebrities/song-joongki.jpg' },
          tags: ['언더컷', '모던', '슬림']
        },
        {
          id: 'round-m-2',
          name: '투블럭',
          description: '상하 길이 대비로 얼굴형 보정',
          imageUrl: '/images/styles/round-male-2.jpg',
          celebrity: { name: '박서준', imageUrl: '/images/celebrities/park-seojun.jpg' },
          tags: ['투블럭', '트렌디', '남성적']
        },
        {
          id: 'round-m-3',
          name: '포마드 스타일',
          description: '뒤로 넘긴 스타일로 얼굴을 길어보이게',
          imageUrl: '/images/styles/round-male-3.jpg',
          celebrity: { name: '현빈', imageUrl: '/images/celebrities/hyun-bin.jpg' },
          tags: ['포마드', '클래식', '세련']
        }
      ],
      female: [
        {
          id: 'round-f-1',
          name: '롱 스트레이트',
          description: '긴 일자 스타일로 얼굴을 길어보이게',
          imageUrl: '/images/styles/round-female-1.jpg',
          celebrity: { name: '수지', imageUrl: '/images/celebrities/suzy.jpg' },
          tags: ['스트레이트', '단순', '깔끔']
        },
        {
          id: 'round-f-2',
          name: '사이드 웨이브',
          description: '옆으로 흘러내린 웨이브로 얼굴형 보정',
          imageUrl: '/images/styles/round-female-2.jpg',
          celebrity: { name: '박민영', imageUrl: '/images/celebrities/park-minyoung.jpg' },
          tags: ['웨이브', '여성스러운', '볼륨']
        },
        {
          id: 'round-f-3',
          name: '앞머리 없는 긴 머리',
          description: '이마를 드러내어 얼굴을 길어보이게',
          imageUrl: '/images/styles/round-female-3.jpg',
          celebrity: { name: '김고은', imageUrl: '/images/celebrities/kim-goeun.jpg' },
          tags: ['롱헤어', '자연스러운', '우아']
        }
      ]
    },
    // TODO: 다른 얼굴형들의 데이터도 추가
    oval: {
      male: [
        {
          id: 'oval-m-1',
          name: '클래식 컷',
          description: '균형잡힌 얼굴형에 어울리는 기본 스타일',
          imageUrl: '/images/styles/oval-male-1.jpg',
          celebrity: { name: '박보검', imageUrl: '/images/celebrities/park-bogum.jpg' },
          tags: ['클래식', '깔끔', '기본']
        }
      ],
      female: [
        {
          id: 'oval-f-1',
          name: '미디움 레이어',
          description: '어떤 스타일이든 잘 어울리는 타원형에 추천하는 기본 스타일',
          imageUrl: '/images/styles/oval-female-1.jpg',
          celebrity: { name: '송혜교', imageUrl: '/images/celebrities/song-hyegyo.jpg' },
          tags: ['미디움', '레이어', '기본']
        }
      ]
    },
    square: { male: [], female: [] },
    oblong: { male: [], female: [] },
    inverted_triangle: { male: [], female: [] }
  };

  /**
   * 얼굴형과 성별에 따른 헤어스타일 추천
   */
  getHairStyleRecommendations(
    faceShape: keyof typeof this.hairStyleData,
    gender: 'male' | 'female'
  ): RecommendationResponse {
    const styles = this.hairStyleData[faceShape]?.[gender] || [];
    
    return {
      recommendations: styles,
      totalCount: styles.length
    };
  }

  /**
   * 특정 헤어스타일의 연예인 레퍼런스 조회
   */
  getCelebrityReferences(styleId: string) {
    // TODO: styleId를 기반으로 더 많은 연예인 레퍼런스 제공
    return {
      styleId,
      celebrities: [
        {
          name: '박보검',
          imageUrl: '/images/celebrities/park-bogum.jpg',
          description: '깔끔하고 세련된 스타일'
        }
      ]
    };
  }
} 