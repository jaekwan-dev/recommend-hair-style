// TMDB API를 이용한 연예인 이미지 서비스
class TMDBService {
  // 🔑 여기에 발급받은 API 키를 입력하세요!
  private readonly API_KEY: string = 'b23df74abc586600ee2b8846bbc70cc0'; // ⚠️ 실제 키로 교체 필요
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w780'; // w500 → w780으로 고화질 업그레이드
  
  // 이미지 캐시 (같은 연예인은 다시 검색하지 않음)
  private cache = new Map<string, string>();

  async getCelebrityImage(name: string): Promise<string> {
    try {
      // 캐시에서 먼저 확인
      if (this.cache.has(name)) {
        console.log(`📦 캐시에서 ${name} 이미지 반환`);
        return this.cache.get(name)!;
      }

      console.log(`🔍 TMDB에서 ${name} 검색 중...`);
      
      // TMDB API 호출
      const searchUrl = `${this.BASE_URL}/search/person?api_key=${this.API_KEY}&query=${encodeURIComponent(name)}&language=ko-KR`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const person = data.results[0];
        
        if (person.profile_path) {
          const imageUrl = `${this.IMAGE_BASE_URL}${person.profile_path}`;
          console.log(`✅ ${name} 고화질 이미지 찾음:`, imageUrl);
          
          // 캐시에 저장
          this.cache.set(name, imageUrl);
          return imageUrl;
        }
      }
      
      // 이미지를 찾지 못한 경우
      console.log(`❌ ${name} 이미지 없음, 기본 이미지 사용`);
      const defaultUrl = this.getDefaultImage(name);
      this.cache.set(name, defaultUrl);
      return defaultUrl;
      
    } catch (error) {
      console.error(`💥 ${name} 검색 중 오류:`, error);
      const defaultUrl = this.getDefaultImage(name);
      this.cache.set(name, defaultUrl);
      return defaultUrl;
    }
  }

  private getDefaultImage(name: string): string {
    // 이름 기반으로 다양한 기본 아바타 제공 (더 큰 사이즈)
    const avatars = [
      'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=780&background=6366f1&color=fff&font-size=0.4&bold=true',
      'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=780&background=8b5cf6&color=fff&font-size=0.4&bold=true',
      'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=780&background=06b6d4&color=fff&font-size=0.4&bold=true',
      'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=780&background=10b981&color=fff&font-size=0.4&bold=true',
      'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=780&background=f59e0b&color=fff&font-size=0.4&bold=true'
    ];
    
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return avatars[hash % avatars.length];
  }

  // 여러 연예인 이미지 동시 검색 (성능 최적화)
  async getMultipleCelebrityImages(names: string[]): Promise<Record<string, string>> {
    console.log(`🚀 ${names.length}명의 연예인 고화질 이미지 동시 검색 시작`);
    
    const promises = names.map(async (name) => {
      const imageUrl = await this.getCelebrityImage(name);
      return { name, imageUrl };
    });

    const results = await Promise.all(promises);
    
    const imageMap = results.reduce((acc, { name, imageUrl }) => {
      acc[name] = imageUrl;
      return acc;
    }, {} as Record<string, string>);

    console.log('✨ 모든 연예인 고화질 이미지 검색 완료:', imageMap);
    return imageMap;
  }

  // API 키 확인
  isConfigured(): boolean {
    return this.API_KEY !== 'YOUR_TMDB_API_KEY_HERE' && this.API_KEY.length > 10;
  }
}

export const tmdbService = new TMDBService(); 