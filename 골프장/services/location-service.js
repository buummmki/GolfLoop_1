/**
 * GolfLoop 위치 기반 서비스
 * 카카오 API를 활용한 골프장 검색 및 위치 관리
 */

class LocationService {
    constructor() {
        this.config = window.GolfLoopAPI?.config || {};
        this.cache = new Map(); // 검색 결과 캐시
        this.userLocation = null;
    }

    /**
     * 📍 사용자 현재 위치 가져오기
     */
    async getUserLocation() {
        try {
            if (this.userLocation) {
                return this.userLocation;
            }

            const position = await window.GolfLoopAPI.getCurrentPosition();
            this.userLocation = position;
            
            // 주소 정보도 함께 가져오기
            const address = await this.getAddressFromCoords(
                position.latitude, 
                position.longitude
            );
            
            this.userLocation.address = address;
            
            console.log('📍 사용자 위치 확인:', this.userLocation);
            return this.userLocation;
            
        } catch (error) {
            console.error('위치 가져오기 실패:', error);
            throw error;
        }
    }

    /**
     * ⛳ 주변 골프장 검색
     */
    async searchNearbyGolfCourses(latitude, longitude, radius = 10000) {
        try {
            const cacheKey = `golf_${latitude}_${longitude}_${radius}`;
            
            // 캐시 확인
            if (this.cache.has(cacheKey)) {
                console.log('🔄 캐시에서 골프장 데이터 로드');
                return this.cache.get(cacheKey);
            }

            const params = new URLSearchParams({
                query: '골프장',
                x: longitude.toString(),
                y: latitude.toString(),
                radius: radius.toString(),
                size: '15',
                sort: 'distance'
            });

            const response = await fetch(
                `${this.config.ENDPOINTS.PLACE_SEARCH}?${params}`,
                {
                    headers: window.GolfLoopAPI.getApiHeaders(true)
                }
            );

            if (!response.ok) {
                throw new Error(`API 요청 실패: ${response.status}`);
            }

            const data = await response.json();
            
            // 골프장 데이터 가공
            const golfCourses = data.documents.map(place => {
                const distance = window.GolfLoopAPI.calculateDistance(
                    latitude, longitude,
                    parseFloat(place.y), parseFloat(place.x)
                );

                return {
                    id: place.id,
                    name: place.place_name,
                    address: place.road_address_name || place.address_name,
                    phone: place.phone,
                    latitude: parseFloat(place.y),
                    longitude: parseFloat(place.x),
                    distance: distance,
                    distanceText: window.GolfLoopAPI.formatDistance(distance),
                    category: place.category_name,
                    url: place.place_url,
                    // 추가 골프장 정보 (임시)
                    rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
                    reviewCount: Math.floor(Math.random() * 200) + 10,
                    price: this.generateGolfPrice(),
                    status: this.getRandomStatus()
                };
            });

            // 거리순 정렬
            golfCourses.sort((a, b) => a.distance - b.distance);
            
            // 캐시 저장 (5분)
            this.cache.set(cacheKey, golfCourses);
            setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);

            console.log(`⛳ ${golfCourses.length}개 골프장 검색 완료`);
            return golfCourses;

        } catch (error) {
            console.error('골프장 검색 실패:', error);
            return [];
        }
    }

    /**
     * 🔍 골프장 이름으로 검색
     */
    async searchGolfCourseByName(query) {
        try {
            const params = new URLSearchParams({
                query: `${query} 골프장`,
                size: '10'
            });

            const response = await fetch(
                `${this.config.ENDPOINTS.PLACE_SEARCH}?${params}`,
                {
                    headers: window.GolfLoopAPI.getApiHeaders(true)
                }
            );

            const data = await response.json();
            
            return data.documents.map(place => ({
                id: place.id,
                name: place.place_name,
                address: place.road_address_name || place.address_name,
                phone: place.phone,
                latitude: parseFloat(place.y),
                longitude: parseFloat(place.x),
                category: place.category_name,
                url: place.place_url
            }));

        } catch (error) {
            console.error('골프장 이름 검색 실패:', error);
            return [];
        }
    }

    /**
     * 📍 좌표 → 주소 변환
     */
    async getAddressFromCoords(latitude, longitude) {
        try {
            const params = new URLSearchParams({
                x: longitude.toString(),
                y: latitude.toString(),
                input_coord: 'WGS84'
            });

            const response = await fetch(
                `${this.config.ENDPOINTS.COORD_TO_ADDRESS}?${params}`,
                {
                    headers: window.GolfLoopAPI.getApiHeaders(true)
                }
            );

            const data = await response.json();
            
            if (data.documents && data.documents.length > 0) {
                const doc = data.documents[0];
                const roadAddress = doc.road_address;
                const jibunAddress = doc.address;
                
                return {
                    roadAddress: roadAddress ? roadAddress.address_name : '',
                    jibunAddress: jibunAddress ? jibunAddress.address_name : '',
                    region: jibunAddress ? jibunAddress.region_1depth_name : '',
                    district: jibunAddress ? jibunAddress.region_2depth_name : '',
                    formatted: roadAddress ? roadAddress.address_name : jibunAddress?.address_name || ''
                };
            }
            
            return null;

        } catch (error) {
            console.error('주소 변환 실패:', error);
            return null;
        }
    }

    /**
     * 🏠 주소 → 좌표 변환
     */
    async getCoordsFromAddress(address) {
        try {
            const params = new URLSearchParams({
                query: address
            });

            const response = await fetch(
                `${this.config.ENDPOINTS.ADDRESS_SEARCH}?${params}`,
                {
                    headers: window.GolfLoopAPI.getApiHeaders(true)
                }
            );

            const data = await response.json();
            
            if (data.documents && data.documents.length > 0) {
                const doc = data.documents[0];
                return {
                    latitude: parseFloat(doc.y),
                    longitude: parseFloat(doc.x),
                    address: doc.address_name
                };
            }
            
            return null;

        } catch (error) {
            console.error('좌표 변환 실패:', error);
            return null;
        }
    }

    /**
     * 🎯 지역별 골프장 검색
     */
    async searchGolfCoursesByRegion(region) {
        try {
            const params = new URLSearchParams({
                query: `${region} 골프장`,
                size: '15'
            });

            const response = await fetch(
                `${this.config.ENDPOINTS.PLACE_SEARCH}?${params}`,
                {
                    headers: window.GolfLoopAPI.getApiHeaders(true)
                }
            );

            const data = await response.json();
            
            return data.documents.map(place => ({
                id: place.id,
                name: place.place_name,
                address: place.road_address_name || place.address_name,
                phone: place.phone,
                latitude: parseFloat(place.y),
                longitude: parseFloat(place.x),
                category: place.category_name,
                url: place.place_url,
                rating: (Math.random() * 2 + 3).toFixed(1),
                reviewCount: Math.floor(Math.random() * 200) + 10,
                price: this.generateGolfPrice()
            }));

        } catch (error) {
            console.error('지역별 골프장 검색 실패:', error);
            return [];
        }
    }

    /**
     * 💰 골프장 가격 생성 (임시 데이터)
     */
    generateGolfPrice() {
        const basePrice = Math.floor(Math.random() * 100000) + 80000; // 80,000 ~ 180,000
        return {
            weekday: basePrice,
            weekend: Math.floor(basePrice * 1.5),
            formatted: `평일 ${basePrice.toLocaleString()}원`
        };
    }

    /**
     * 📊 골프장 상태 생성 (임시 데이터)
     */
    getRandomStatus() {
        const statuses = ['excellent', 'good', 'normal', 'poor'];
        const weights = [0.3, 0.4, 0.25, 0.05]; // 확률 가중치
        
        const random = Math.random();
        let sum = 0;
        
        for (let i = 0; i < statuses.length; i++) {
            sum += weights[i];
            if (random <= sum) {
                return statuses[i];
            }
        }
        
        return 'good';
    }

    /**
     * 🗑️ 캐시 클리어
     */
    clearCache() {
        this.cache.clear();
        this.userLocation = null;
        console.log('🗑️ 위치 서비스 캐시 클리어');
    }
}

// 전역 인스턴스 생성
window.LocationService = new LocationService();

console.log('🗺️ LocationService 초기화 완료'); 