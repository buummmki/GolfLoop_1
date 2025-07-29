// GolfLoop 위치 서비스
class LocationService {
    constructor() {
        this.cache = new Map();
        this.config = window.GolfLoopAPI;
    }

    // API 헤더 생성
    getApiHeaders() {
        return {
            'Authorization': `KakaoAK ${this.config.KAKAO_REST_KEY}`,
            'Content-Type': 'application/json'
        };
    }

    // 캐시 키 생성
    getCacheKey(key, params) {
        return `${key}_${JSON.stringify(params)}`;
    }

    // 캐시에서 데이터 가져오기
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.config.CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }

    // 캐시에 데이터 저장
    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // API 호출
    async callApi(url, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const fullUrl = `${url}?${queryString}`;
            
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: this.getApiHeaders()
            });

            if (!response.ok) {
                throw new Error(`API 호출 실패: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API 호출 오류:', error);
            throw error;
        }
    }

    // 사용자 현재 위치 가져오기
    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('브라우저가 위치 정보를 지원하지 않습니다.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    let message = '위치를 가져올 수 없습니다.';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = '위치 권한이 거부되었습니다.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = '위치 정보를 사용할 수 없습니다.';
                            break;
                        case error.TIMEOUT:
                            message = '위치 요청 시간이 초과되었습니다.';
                            break;
                    }
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5분
                }
            );
        });
    }

    // 주변 골프장 검색
    async searchNearbyGolfCourses(latitude, longitude, radius = null) {
        const cacheKey = this.getCacheKey('nearby_golf', { lat: latitude, lng: longitude, radius });
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            console.log('캐시에서 골프장 데이터 로드');
            return cached;
        }

        try {
            const params = {
                query: '골프장',
                x: longitude,
                y: latitude,
                radius: radius || this.config.DEFAULT_RADIUS,
                size: this.config.MAX_RESULTS
            };

            const data = await this.callApi(this.config.API_ENDPOINTS.PLACE_SEARCH, params);
            
            const golfCourses = data.documents.map(place => ({
                id: place.id,
                name: place.place_name,
                address: place.address_name,
                roadAddress: place.road_address_name,
                phone: place.phone,
                category: place.category_name,
                distance: parseInt(place.distance),
                latitude: parseFloat(place.y),
                longitude: parseFloat(place.x),
                url: place.place_url
            }));

            // 거리순 정렬
            golfCourses.sort((a, b) => a.distance - b.distance);

            this.setCache(cacheKey, golfCourses);
            console.log(`⛳ ${golfCourses.length}개 골프장 검색 완료`);
            
            return golfCourses;
        } catch (error) {
            console.error('주변 골프장 검색 실패:', error);
            throw error;
        }
    }

    // 지역별 골프장 검색
    async searchGolfCoursesByRegion(region) {
        const cacheKey = this.getCacheKey('region_golf', { region });
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const params = {
                query: `${region} 골프장`,
                size: this.config.MAX_RESULTS
            };

            const data = await this.callApi(this.config.API_ENDPOINTS.PLACE_SEARCH, params);
            
            const golfCourses = data.documents.map(place => ({
                id: place.id,
                name: place.place_name,
                address: place.address_name,
                roadAddress: place.road_address_name,
                phone: place.phone,
                category: place.category_name,
                region: region,
                latitude: parseFloat(place.y),
                longitude: parseFloat(place.x),
                url: place.place_url
            }));

            this.setCache(cacheKey, golfCourses);
            console.log(`${region} 지역 ${golfCourses.length}개 골프장 검색 완료`);
            
            return golfCourses;
        } catch (error) {
            console.error('지역별 골프장 검색 실패:', error);
            throw error;
        }
    }

    // 골프장명으로 검색
    async searchGolfCourseByName(query) {
        const cacheKey = this.getCacheKey('name_golf', { query });
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const params = {
                query: query,
                size: this.config.MAX_RESULTS
            };

            const data = await this.callApi(this.config.API_ENDPOINTS.PLACE_SEARCH, params);
            
            const golfCourses = data.documents
                .filter(place => place.category_name.includes('골프') || place.place_name.includes('골프'))
                .map(place => ({
                    id: place.id,
                    name: place.place_name,
                    address: place.address_name,
                    roadAddress: place.road_address_name,
                    phone: place.phone,
                    category: place.category_name,
                    latitude: parseFloat(place.y),
                    longitude: parseFloat(place.x),
                    url: place.place_url
                }));

            this.setCache(cacheKey, golfCourses);
            console.log(`"${query}" 검색 결과: ${golfCourses.length}개 골프장`);
            
            return golfCourses;
        } catch (error) {
            console.error('골프장명 검색 실패:', error);
            throw error;
        }
    }

    // 주소를 좌표로 변환
    async addressToCoordinates(address) {
        try {
            const params = {
                query: address
            };

            const data = await this.callApi(this.config.API_ENDPOINTS.ADDRESS_SEARCH, params);
            
            if (data.documents.length > 0) {
                const doc = data.documents[0];
                return {
                    latitude: parseFloat(doc.y),
                    longitude: parseFloat(doc.x),
                    address: doc.address_name
                };
            }
            
            throw new Error('주소를 찾을 수 없습니다.');
        } catch (error) {
            console.error('주소 변환 실패:', error);
            throw error;
        }
    }

    // 좌표를 주소로 변환
    async coordinatesToAddress(latitude, longitude) {
        try {
            const params = {
                x: longitude,
                y: latitude
            };

            const data = await this.callApi(this.config.API_ENDPOINTS.COORD_TO_ADDRESS, params);
            
            if (data.documents.length > 0) {
                const doc = data.documents[0];
                return {
                    address: doc.address.address_name,
                    roadAddress: doc.road_address?.address_name || '',
                    region: doc.address.region_1depth_name,
                    city: doc.address.region_2depth_name
                };
            }
            
            throw new Error('좌표에 해당하는 주소를 찾을 수 없습니다.');
        } catch (error) {
            console.error('좌표 변환 실패:', error);
            throw error;
        }
    }

    // 두 지점 간 거리 계산 (Haversine 공식)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // 지구 반지름 (km)
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        return distance;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
}

// 전역 객체로 노출
window.LocationService = new LocationService(); 