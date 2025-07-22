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
  suitabilityReason: string; // 왜 이 얼굴형에 어울리는지 설명
}

export interface RecommendationResponse {
  recommendations: HairStyleRecommendation[];
  totalCount: number;
  faceShapeDescription: string; // 얼굴형 특징 설명
  generalTips: string[]; // 일반적인 팁
}

@Injectable()
export class RecommendationService {
  
  // 얼굴형별 특징 및 팁
  private readonly faceShapeInfo = {
    round: {
      description: '볼살이 많고 턱선이 둥근 얼굴형입니다.',
      tips: [
        '윗머리에 볼륨을 주어 얼굴이 길어보이게 하세요',
        '투블럭+다운펌은 피하는 것이 좋습니다',
        '수직 라인을 강조하는 스타일을 선택하세요'
      ]
    },
    oblong: {
      description: '턱선이 길고 이마가 높은 긴 얼굴형입니다.',
      tips: [
        '앞머리를 추가하면 비율 보정에 효과적입니다',
        '너무 볼륨감 있는 윗머리 스타일은 피하세요',
        '가로폭을 넓어보이게 하는 스타일을 선택하세요'
      ]
    },
    square: {
      description: '턱이 각지고 넓은 이마를 가진 각진 얼굴형입니다.',
      tips: [
        '부드러운 라인으로 각진 부분을 완화시키세요',
        '너무 각진 스타일은 각을 더 부각시킬 수 있습니다',
        '레이어드나 웨이브로 부드러움을 연출하세요'
      ]
    },
    inverted_triangle: {
      description: '턱이 좁고 이마가 넓은 역삼각형 얼굴형입니다.',
      tips: [
        '턱선 부근에 볼륨을 주어 균형을 맞추세요',
        '이마를 드러내는 스타일은 피하는 것이 좋습니다',
        '앞머리나 사이드 볼륨으로 균형을 잡으세요'
      ]
    },
    heart: {
      description: '광대가 도드라지고 턱이 좁은 하트형 얼굴형입니다.',
      tips: [
        '턱선을 강조하는 스타일로 균형을 맞추세요',
        '머리를 뒤로 넘기는 포마드류는 피하세요',
        '부드러운 라인으로 각진 부분을 완화하세요'
      ]
    },
    oval: {
      description: '이상적인 비율을 가진 균형잡힌 타원형 얼굴입니다.',
      tips: [
        '대부분의 스타일이 잘 어울립니다',
        '본인의 취향과 라이프스타일에 맞게 선택하세요',
        '다양한 스타일 도전이 가능한 얼굴형입니다'
      ]
    }
  };

  // 얼굴형별 상세 헤어스타일 추천 데이터
  private readonly hairStyleData = {
    round: {
      male: [
        {
          id: 'round-m-1',
          name: '포마드 스타일',
          description: '젤이나 포마드로 뒤로 넘긴 클래식한 스타일',
          imageUrl: '/images/styles/pomade-style.jpg',
          celebrity: { name: '현빈', imageUrl: '/images/celebrities/hyun-bin.jpg' },
          tags: ['포마드', '클래식', '세련', '비즈니스'],
          suitabilityReason: '뒤로 넘긴 스타일이 얼굴을 길어보이게 해서 둥근 얼굴형에 이상적입니다'
        },
        {
          id: 'round-m-2',
          name: '언더컷',
          description: '사이드와 백을 짧게 자르고 탑을 길게 남긴 모던한 스타일',
          imageUrl: '/images/styles/undercut-style.jpg',
          celebrity: { name: '송중기', imageUrl: '/images/celebrities/song-joongki.jpg' },
          tags: ['언더컷', '모던', '트렌디', '볼륨'],
          suitabilityReason: '윗머리의 볼륨과 사이드의 깔끔함이 얼굴을 슬림하게 보이게 합니다'
        },
        {
          id: 'round-m-3',
          name: '크롭컷',
          description: '짧고 텍스처가 있는 자연스러운 스타일',
          imageUrl: '/images/styles/crop-cut.jpg',
          celebrity: { name: '박서준', imageUrl: '/images/celebrities/park-seojun.jpg' },
          tags: ['크롭컷', '자연스러운', '간편', '텍스처'],
          suitabilityReason: '텍스처와 높이가 수직 라인을 강조해 둥근 얼굴을 보완합니다'
        },
        {
          id: 'round-m-4',
          name: '리젠트 컷',
          description: '앞머리를 위로 올린 볼륨감 있는 클래식 스타일',
          imageUrl: '/images/styles/regent-cut.jpg',
          celebrity: { name: '공유', imageUrl: '/images/celebrities/gong-yoo.jpg' },
          tags: ['리젠트', '볼륨', '클래식', '남성적'],
          suitabilityReason: '앞머리의 높이와 볼륨이 얼굴 길이를 늘려보이게 합니다'
        }
      ],
      female: [
        {
          id: 'round-f-1',
          name: '긴 레이어드 컷',
          description: '어깨 아래로 내려오는 층층이 자른 긴 머리',
          imageUrl: '/images/styles/long-layered.jpg',
          celebrity: { name: '수지', imageUrl: '/images/celebrities/suzy.jpg' },
          tags: ['레이어드', '롱헤어', '자연스러운', '우아'],
          suitabilityReason: '긴 길이가 얼굴을 길어보이게 하고 레이어가 동적인 느낌을 줍니다'
        },
        {
          id: 'round-f-2',
          name: 'C컬 펌',
          description: 'C자 모양의 부드러운 컷 펌 스타일',
          imageUrl: '/images/styles/c-curl-perm.jpg',
          celebrity: { name: '박민영', imageUrl: '/images/celebrities/park-minyoung.jpg' },
          tags: ['C컬', '펌', '부드러운', '여성스러운'],
          suitabilityReason: 'C컬의 곡선이 둥근 얼굴의 부드러운 라인과 조화를 이룹니다'
        },
        {
          id: 'round-f-3',
          name: '세미 롱 스타일',
          description: '어깨 정도 길이의 중간 길이 헤어',
          imageUrl: '/images/styles/semi-long.jpg',
          celebrity: { name: '김고은', imageUrl: '/images/celebrities/kim-goeun.jpg' },
          tags: ['세미롱', '미디움', '실용적', '깔끔'],
          suitabilityReason: '적당한 길이가 얼굴비율을 보정하고 관리도 편합니다'
        }
      ]
    },
    oblong: {
      male: [
        {
          id: 'oblong-m-1',
          name: '댄디컷',
          description: '단정하고 깔끔한 비즈니스 스타일',
          imageUrl: '/images/styles/dandy-cut.jpg',
          celebrity: { name: '박보검', imageUrl: '/images/celebrities/park-bogum.jpg' },
          tags: ['댄디컷', '비즈니스', '단정', '클래식'],
          suitabilityReason: '적당한 길이와 볼륨이 긴 얼굴에 균형감을 줍니다'
        },
        {
          id: 'oblong-m-2',
          name: '내추럴 가르마',
          description: '자연스럽게 가른 편안한 스타일',
          imageUrl: '/images/styles/natural-part.jpg',
          celebrity: { name: '이종석', imageUrl: '/images/celebrities/lee-jongsuk.jpg' },
          tags: ['가르마', '자연스러운', '편안', '일상'],
          suitabilityReason: '가르마가 이마를 적당히 가려 얼굴 길이를 단축시켜 보입니다'
        },
        {
          id: 'oblong-m-3',
          name: '쉼표머리',
          description: '앞머리를 쉼표 모양으로 말린 트렌디한 스타일',
          imageUrl: '/images/styles/comma-hair.jpg',
          celebrity: { name: '차은우', imageUrl: '/images/celebrities/cha-eunwoo.jpg' },
          tags: ['쉼표머리', '트렌디', 'K팝', '젊은'],
          suitabilityReason: '앞머리가 이마를 가려주고 사이드 볼륨이 얼굴폭을 넓어보이게 합니다'
        }
      ],
      female: [
        {
          id: 'oblong-f-1',
          name: '시스루뱅',
          description: '얇고 투명한 느낌의 자연스러운 앞머리',
          imageUrl: '/images/styles/see-through-bangs.jpg',
          celebrity: { name: '아이유', imageUrl: '/images/celebrities/iu.jpg' },
          tags: ['시스루뱅', '앞머리', '자연스러운', '트렌디'],
          suitabilityReason: '앞머리가 이마를 가려 얼굴 길이를 짧아보이게 하는 효과가 있습니다'
        },
        {
          id: 'oblong-f-2',
          name: '처피뱅',
          description: '두껍고 일자로 자른 개성 있는 앞머리',
          imageUrl: '/images/styles/choppy-bangs.jpg',
          celebrity: { name: '태연', imageUrl: '/images/celebrities/taeyeon.jpg' },
          tags: ['처피뱅', '개성적', '모던', '앞머리'],
          suitabilityReason: '뚜렷한 앞머리가 긴 얼굴의 비율을 효과적으로 보정합니다'
        },
        {
          id: 'oblong-f-3',
          name: '레이어드 단발',
          description: '층을 낸 단발머리로 볼륨감 연출',
          imageUrl: '/images/styles/layered-bob.jpg',
          celebrity: { name: '박소담', imageUrl: '/images/celebrities/park-sodam.jpg' },
          tags: ['레이어드', '단발', '볼륨', '세련'],
          suitabilityReason: '단발의 폭감과 레이어의 볼륨이 얼굴을 넓어보이게 합니다'
        }
      ]
    },
    square: {
      male: [
        {
          id: 'square-m-1',
          name: '투블럭',
          description: '사이드를 짧게 자르고 윗머리를 남긴 인기 스타일',
          imageUrl: '/images/styles/two-block.jpg',
          celebrity: { name: '송강', imageUrl: '/images/celebrities/song-kang.jpg' },
          tags: ['투블럭', '인기', '깔끔', '모던'],
          suitabilityReason: '사이드의 깔끔함이 각진 얼굴선을 부드럽게 보이게 합니다'
        },
        {
          id: 'square-m-2',
          name: '리젠트 스타일',
          description: '앞머리를 뒤로 넘긴 고급스러운 스타일',
          imageUrl: '/images/styles/regent-style.jpg',
          celebrity: { name: '이민호', imageUrl: '/images/celebrities/lee-minho.jpg' },
          tags: ['리젠트', '고급', '성숙', '클래식'],
          suitabilityReason: '부드러운 곡선이 각진 얼굴형의 강한 인상을 완화시킵니다'
        },
        {
          id: 'square-m-3',
          name: '소프트 가르마',
          description: '부드럽게 가른 자연스러운 스타일',
          imageUrl: '/images/styles/soft-part.jpg',
          celebrity: { name: '박해진', imageUrl: '/images/celebrities/park-haejin.jpg' },
          tags: ['가르마', '소프트', '자연스러운', '부드러운'],
          suitabilityReason: '자연스러운 가르마와 사이드 볼륨이 각진 라인을 부드럽게 합니다'
        }
      ],
      female: [
        {
          id: 'square-f-1',
          name: '웨이브 미디엄',
          description: '어깨 길이의 웨이브가 있는 중간 길이 헤어',
          imageUrl: '/images/styles/wave-medium.jpg',
          celebrity: { name: '전지현', imageUrl: '/images/celebrities/jun-jihyun.jpg' },
          tags: ['웨이브', '미디엄', '우아', '여성스러운'],
          suitabilityReason: '웨이브의 부드러운 곡선이 각진 턱선을 자연스럽게 커버합니다'
        },
        {
          id: 'square-f-2',
          name: '레이어드 웨이브 펌',
          description: '층을 내고 웨이브를 준 볼륨 있는 스타일',
          imageUrl: '/images/styles/layered-wave-perm.jpg',
          celebrity: { name: '손예진', imageUrl: '/images/celebrities/son-yejin.jpg' },
          tags: ['레이어드', '웨이브펌', '볼륨', '로맨틱'],
          suitabilityReason: '레이어와 웨이브의 조합이 각진 얼굴형에 부드러운 인상을 줍니다'
        },
        {
          id: 'square-f-3',
          name: '사이드 웨이브',
          description: '한쪽으로 넘긴 웨이브 스타일',
          imageUrl: '/images/styles/side-wave.jpg',
          celebrity: { name: '김태희', imageUrl: '/images/celebrities/kim-taehee.jpg' },
          tags: ['사이드', '웨이브', '세련', '우아'],
          suitabilityReason: '사이드 웨이브가 각진 얼굴선을 부드럽게 가려줍니다'
        }
      ]
    },
    inverted_triangle: {
      male: [
        {
          id: 'inverted-m-1',
          name: '앞머리 댄디컷',
          description: '앞머리를 내린 깔끔한 댄디 스타일',
          imageUrl: '/images/styles/fringe-dandy.jpg',
          celebrity: { name: '유아인', imageUrl: '/images/celebrities/yoo-ahin.jpg' },
          tags: ['앞머리', '댄디컷', '개성', '모던'],
          suitabilityReason: '앞머리가 넓은 이마를 가려주고 턱선 부근의 균형을 맞춥니다'
        },
        {
          id: 'inverted-m-2',
          name: '쉼표머리',
          description: '앞머리를 쉼표 모양으로 스타일링',
          imageUrl: '/images/styles/comma-style.jpg',
          celebrity: { name: '박형식', imageUrl: '/images/celebrities/park-hyungsik.jpg' },
          tags: ['쉼표머리', '트렌디', '젊음', '스타일링'],
          suitabilityReason: '앞머리와 사이드 볼륨이 이마-턱 비율의 균형을 잡아줍니다'
        },
        {
          id: 'inverted-m-3',
          name: '미디엄 내추럴',
          description: '중간 길이의 자연스러운 스타일',
          imageUrl: '/images/styles/medium-natural.jpg',
          celebrity: { name: '김우빈', imageUrl: '/images/celebrities/kim-woobin.jpg' },
          tags: ['미디엄', '내추럴', '편안', '자유로운'],
          suitabilityReason: '미디엄 길이가 턱선 부근에 볼륨을 주어 얼굴 균형을 맞춥니다'
        }
      ],
      female: [
        {
          id: 'inverted-f-1',
          name: '볼륨 단발',
          description: '턱선 부근에 볼륨을 준 단발머리',
          imageUrl: '/images/styles/volume-bob.jpg',
          celebrity: { name: '고준희', imageUrl: '/images/celebrities/go-junhee.jpg' },
          tags: ['단발', '볼륨', '세련', '도시적'],
          suitabilityReason: '턱선 부근의 볼륨이 좁은 턱을 보완하고 얼굴 균형을 맞춥니다'
        },
        {
          id: 'inverted-f-2',
          name: '바디펌',
          description: '자연스러운 볼륨의 바디펌 스타일',
          imageUrl: '/images/styles/body-perm.jpg',
          celebrity: { name: '박신혜', imageUrl: '/images/celebrities/park-shinhye.jpg' },
          tags: ['바디펌', '자연스러운', '볼륨', '여성스러운'],
          suitabilityReason: '전체적인 볼륨이 좁은 턱선을 보완하고 균형감을 줍니다'
        },
        {
          id: 'inverted-f-3',
          name: '턱선 아래 컷',
          description: '턱선보다 아래로 내려오는 길이의 커트',
          imageUrl: '/images/styles/under-chin-cut.jpg',
          celebrity: { name: '한예슬', imageUrl: '/images/celebrities/han-yeseul.jpg' },
          tags: ['미디엄', '컷', '균형', '세련'],
          suitabilityReason: '턱선 아래 길이가 좁은 턱을 더 풍성해 보이게 합니다'
        }
      ]
    },
    heart: {
      male: [
        {
          id: 'heart-m-1',
          name: '부드러운 가르마',
          description: '자연스럽고 부드러운 가르마 스타일',
          imageUrl: '/images/styles/soft-parting.jpg',
          celebrity: { name: '정해인', imageUrl: '/images/celebrities/jung-haein.jpg' },
          tags: ['가르마', '부드러운', '자연스러운', '온화'],
          suitabilityReason: '부드러운 라인이 하트형 얼굴의 각진 부분을 완화시킵니다'
        },
        {
          id: 'heart-m-2',
          name: '내추럴 댄디컷',
          description: '자연스러운 느낌의 댄디 스타일',
          imageUrl: '/images/styles/natural-dandy.jpg',
          celebrity: { name: '공유', imageUrl: '/images/celebrities/gong-yoo.jpg' },
          tags: ['댄디컷', '내추럴', '성숙', '품격'],
          suitabilityReason: '정돈된 스타일이 하트형 얼굴에 균형감과 성숙미를 더합니다'
        },
        {
          id: 'heart-m-3',
          name: '사이드 스웹',
          description: '옆으로 넘긴 세련된 스타일',
          imageUrl: '/images/styles/side-swept.jpg',
          celebrity: { name: '이동욱', imageUrl: '/images/celebrities/lee-dongwook.jpg' },
          tags: ['사이드', '세련', '도시적', '스타일리시'],
          suitabilityReason: '사이드로 넘긴 스타일이 이마를 적당히 가려 얼굴 균형을 맞춥니다'
        }
      ],
      female: [
        {
          id: 'heart-f-1',
          name: '곱슬 단발',
          description: '자연스러운 곱슬이 있는 단발머리',
          imageUrl: '/images/styles/curly-bob.jpg',
          celebrity: { name: '공효진', imageUrl: '/images/celebrities/gong-hyojin.jpg' },
          tags: ['곱슬', '단발', '자연스러운', '개성적'],
          suitabilityReason: '곱슬의 볼륨이 좁은 턱선을 보완하고 얼굴에 균형을 줍니다'
        },
        {
          id: 'heart-f-2',
          name: '레이어드 중단발',
          description: '층을 낸 중간 길이의 단발',
          imageUrl: '/images/styles/layered-medium-bob.jpg',
          celebrity: { name: '윤은혜', imageUrl: '/images/celebrities/yoon-eunhye.jpg' },
          tags: ['레이어드', '중단발', '볼륨', '세련'],
          suitabilityReason: '턱선 부근의 레이어가 좁은 턱을 풍성해 보이게 합니다'
        },
        {
          id: 'heart-f-3',
          name: '자연 웨이브',
          description: '자연스러운 웨이브가 있는 중간 길이',
          imageUrl: '/images/styles/natural-wave.jpg',
          celebrity: { name: '한지민', imageUrl: '/images/celebrities/han-jimin.jpg' },
          tags: ['웨이브', '자연스러운', '우아', '여성스러운'],
          suitabilityReason: '웨이브의 부드러운 볼륨이 하트형 얼굴에 조화로운 균형을 만듭니다'
        }
      ]
    },
    oval: {
      male: [
        {
          id: 'oval-m-1',
          name: '클래식 가르마',
          description: '기본적이면서도 세련된 가르마 스타일',
          imageUrl: '/images/styles/classic-part.jpg',
          celebrity: { name: '박보검', imageUrl: '/images/celebrities/park-bogum.jpg' },
          tags: ['클래식', '가르마', '기본', '세련'],
          suitabilityReason: '균형잡힌 타원형 얼굴에는 어떤 스타일이든 잘 어울립니다'
        },
        {
          id: 'oval-m-2',
          name: '모던 포마드',
          description: '현대적으로 해석한 포마드 스타일',
          imageUrl: '/images/styles/modern-pomade.jpg',
          celebrity: { name: '원빈', imageUrl: '/images/celebrities/won-bin.jpg' },
          tags: ['포마드', '모던', '고급', '성숙'],
          suitabilityReason: '이상적인 얼굴형으로 고급스러운 스타일을 완벽하게 소화할 수 있습니다'
        },
        {
          id: 'oval-m-3',
          name: '텍스처드 크롭',
          description: '자연스러운 텍스처의 크롭 컷',
          imageUrl: '/images/styles/textured-crop.jpg',
          celebrity: { name: '현빈', imageUrl: '/images/celebrities/hyunbin.jpg' },
          tags: ['텍스처', '크롭', '자연스러운', '캐주얼'],
          suitabilityReason: '타원형은 트렌디한 스타일부터 클래식까지 자유자재로 연출 가능합니다'
        }
      ],
      female: [
        {
          id: 'oval-f-1',
          name: '롱 스트레이트',
          description: '길고 곧은 클래식한 스타일',
          imageUrl: '/images/styles/long-straight.jpg',
          celebrity: { name: '송혜교', imageUrl: '/images/celebrities/song-hyegyo.jpg' },
          tags: ['롱헤어', '스트레이트', '클래식', '우아'],
          suitabilityReason: '완벽한 비율의 타원형 얼굴로 어떤 길이든 아름답게 표현됩니다'
        },
        {
          id: 'oval-f-2',
          name: '미디엄 레이어',
          description: '중간 길이의 층이 있는 스타일',
          imageUrl: '/images/styles/medium-layer.jpg',
          celebrity: { name: '전지현', imageUrl: '/images/celebrities/jeon-jihyun.jpg' },
          tags: ['미디엄', '레이어', '볼륨', '활동적'],
          suitabilityReason: '균형잡힌 얼굴형으로 레이어드 스타일의 동적인 매력을 완벽하게 살릴 수 있습니다'
        },
        {
          id: 'oval-f-3',
          name: '숏 컷',
          description: '짧고 깔끔한 숏 헤어',
          imageUrl: '/images/styles/short-cut.jpg',
          celebrity: { name: '고준희', imageUrl: '/images/celebrities/go-junhee2.jpg' },
          tags: ['숏컷', '깔끔', '개성', '세련'],
          suitabilityReason: '이상적인 얼굴형으로 도전적인 숏컷도 완벽하게 소화 가능합니다'
        }
      ]
    }
  };

  /**
   * 얼굴형과 성별에 따른 헤어스타일 추천
   */
  getHairStyleRecommendations(
    faceShape: keyof typeof this.hairStyleData,
    gender: 'male' | 'female'
  ): RecommendationResponse {
    const styles = this.hairStyleData[faceShape]?.[gender] || [];
    const faceInfo = this.faceShapeInfo[faceShape];
    
    return {
      recommendations: styles,
      totalCount: styles.length,
      faceShapeDescription: faceInfo?.description || '얼굴형 정보를 찾을 수 없습니다.',
      generalTips: faceInfo?.tips || []
    };
  }

  /**
   * 모든 지원되는 얼굴형 목록 조회
   */
  getSupportedFaceShapes(): string[] {
    return Object.keys(this.hairStyleData);
  }

  /**
   * 특정 헤어스타일의 상세 정보 조회
   */
  getHairStyleDetail(styleId: string): HairStyleRecommendation | null {
    for (const faceShape of Object.keys(this.hairStyleData)) {
      for (const gender of ['male', 'female']) {
        const styles = this.hairStyleData[faceShape as keyof typeof this.hairStyleData][gender as 'male' | 'female'];
        const style = styles.find(s => s.id === styleId);
        if (style) {
          return style;
        }
      }
    }
    return null;
  }
} 