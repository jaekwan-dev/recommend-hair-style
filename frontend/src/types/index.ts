export type FaceShapeType = 'oval' | 'round' | 'oblong' | 'square' | 'heart' | 'inverted_triangle';
export type GenderType = 'male' | 'female';

export interface FaceAnalysisResult {
  faceShape: FaceShapeType;
  description: string;
  confidence: number;
  landmarks?: any[];
}

export interface Celebrity {
  name: string;
  imageUrl: string;
  description?: string;
}

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
}

export interface AppState {
  gender: GenderType | null;
  selectedImage: File | null;
  imagePreview: string | null;
  analysisResult: FaceAnalysisResult | null;
  recommendations: HairStyleRecommendation[];
} 