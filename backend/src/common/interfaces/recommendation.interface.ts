export type FaceShapeType = 'oval' | 'round' | 'oblong' | 'square' | 'heart' | 'inverted_triangle';
export type GenderType = 'male' | 'female';

export interface Celebrity {
  name: string;
  imageUrl: string;
  description?: string;
}

export interface HairStyle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

export interface HairStyleWithCelebrity extends HairStyle {
  celebrity: Celebrity;
} 