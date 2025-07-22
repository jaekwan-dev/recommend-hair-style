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
  celebrity: Celebrity;
  tags: string[];
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