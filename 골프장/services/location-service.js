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
            // 다양한 골프장 키워드로 검색
            const searchKeywords = [
                `${region} 골프장`,
                `${region} 골프클럽`,
                `${region} 컨트리클럽`,
                `${region} 골프리조트`,
                `${region} CC`,
                `${region} 골프`
            ];

            let allGolfCourses = [];

            // 각 키워드로 검색
            for (const keyword of searchKeywords) {
                try {
                    const params = {
                        query: keyword,
                        size: 15, // 각 키워드당 15개씩
                        page: 1
                    };

                    const data = await this.callApi(this.config.API_ENDPOINTS.PLACE_SEARCH, params);
                    
                    if (data.documents && data.documents.length > 0) {
                        const courses = data.documents
                            .filter(place => this.isGolfCourse(place))
                            .map(place => ({
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
                        
                        allGolfCourses.push(...courses);
                    }
                } catch (error) {
                    console.warn(`${keyword} 검색 실패:`, error);
                    continue;
                }
            }

            // 중복 제거 (ID 기준)
            const uniqueCourses = this.removeDuplicates(allGolfCourses, 'id');
            
            // API 검색 결과가 없으면 더미 데이터 사용
            if (uniqueCourses.length === 0) {
                console.log(`${region} 지역 API 검색 결과 없음, 더미 데이터 사용`);
                const dummyCourses = this.getDummyGolfCourses(region);
                this.setCache(cacheKey, dummyCourses);
                return dummyCourses;
            }
            
            this.setCache(cacheKey, uniqueCourses);
            console.log(`${region} 지역 ${uniqueCourses.length}개 골프장 검색 완료`);
            
            return uniqueCourses;
        } catch (error) {
            console.error('지역별 골프장 검색 실패, 더미 데이터 사용:', error);
            const dummyCourses = this.getDummyGolfCourses(region);
            this.setCache(cacheKey, dummyCourses);
            return dummyCourses;
        }
    }

    // 골프장인지 확인하는 함수
    isGolfCourse(place) {
        const name = place.place_name.toLowerCase();
        const category = place.category_name.toLowerCase();
        
        // 골프장 관련 키워드들
        const golfKeywords = [
            '골프', 'golf', 'cc', '컨트리클럽', '골프클럽', '골프리조트',
            '골프장', '골프코스', '골프연습장'
        ];
        
        // 카테고리에서 골프 관련 확인
        const isGolfCategory = golfKeywords.some(keyword => 
            category.includes(keyword)
        );
        
        // 장소명에서 골프 관련 확인
        const isGolfName = golfKeywords.some(keyword => 
            name.includes(keyword)
        );
        
        // 골프장이 아닌 장소들 제외
        const excludeKeywords = [
            '골프용품', '골프샵', '골프스토어', '골프연습', '골프레슨',
            '골프아카데미', '골프학원', '골프스쿨'
        ];
        
        const isExcluded = excludeKeywords.some(keyword => 
            name.includes(keyword) || category.includes(keyword)
        );
        
        return (isGolfCategory || isGolfName) && !isExcluded;
    }

    // 중복 제거 함수
    removeDuplicates(array, key) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }

    // 골프장명으로 검색
    async searchGolfCourseByName(query) {
        const cacheKey = this.getCacheKey('name_golf', { query });
        const cached = this.getFromCache(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            // 다양한 검색 키워드 조합
            const searchQueries = [
                query,
                `${query} 골프장`,
                `${query} CC`,
                `${query} 컨트리클럽`
            ];

            let allGolfCourses = [];

            for (const searchQuery of searchQueries) {
                try {
                    const params = {
                        query: searchQuery,
                        size: 15
                    };

                    const data = await this.callApi(this.config.API_ENDPOINTS.PLACE_SEARCH, params);
                    
                    if (data.documents && data.documents.length > 0) {
                        const courses = data.documents
                            .filter(place => this.isGolfCourse(place))
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
                        
                        allGolfCourses.push(...courses);
                    }
                } catch (error) {
                    console.warn(`${searchQuery} 검색 실패:`, error);
                    continue;
                }
            }

            // 중복 제거
            const uniqueCourses = this.removeDuplicates(allGolfCourses, 'id');
            
            this.setCache(cacheKey, uniqueCourses);
            console.log(`"${query}" 검색 결과: ${uniqueCourses.length}개 골프장`);
            
            return uniqueCourses;
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

    // 더미 골프장 데이터 (API 실패 시 백업용)
    getDummyGolfCourses(region) {
        const dummyData = {
            '서울': [
                { id: 'seoul_1', name: '용산골프클럽', address: '서울특별시 용산구', phone: '02-1234-5678', category: '골프장', region: '서울', latitude: 37.5326, longitude: 126.9784 },
                { id: 'seoul_2', name: '한강골프클럽', address: '서울특별시 강남구', phone: '02-2345-6789', category: '골프장', region: '서울', latitude: 37.5172, longitude: 127.0473 },
                { id: 'seoul_3', name: '서울컨트리클럽', address: '서울특별시 송파구', phone: '02-3456-7890', category: '골프장', region: '서울', latitude: 37.5145, longitude: 127.1059 }
            ],
            '경기': [
                { id: 'gyeonggi_1', name: '베어크릭컨트리클럽', address: '경기도 파주시', phone: '031-1234-5678', category: '골프장', region: '경기', latitude: 37.7749, longitude: 127.0478 },
                { id: 'gyeonggi_2', name: '스카이힐컨트리클럽', address: '경기도 성남시', phone: '031-2345-6789', category: '골프장', region: '경기', latitude: 37.2636, longitude: 127.0286 },
                { id: 'gyeonggi_3', name: '레이크사이드골프클럽', address: '경기도 용인시', phone: '031-3456-7890', category: '골프장', region: '경기', latitude: 37.2411, longitude: 127.1776 },
                { id: 'gyeonggi_4', name: '남서울컨트리클럽', address: '경기도 광주시', phone: '031-4567-8901', category: '골프장', region: '경기', latitude: 37.4419, longitude: 127.1389 }
            ],
            '인천': [
                { id: 'incheon_1', name: '인천골프클럽', address: '인천광역시 연수구', phone: '032-1234-5678', category: '골프장', region: '인천', latitude: 37.4563, longitude: 126.7052 },
                { id: 'incheon_2', name: '송도골프클럽', address: '인천광역시 연수구', phone: '032-2345-6789', category: '골프장', region: '인천', latitude: 37.3834, longitude: 126.6436 },
                { id: 'incheon_3', name: '영종도골프클럽', address: '인천광역시 중구', phone: '032-3456-7890', category: '골프장', region: '인천', latitude: 37.4602, longitude: 126.4406 }
            ],
            '강원': [
                { id: 'gangwon_1', name: '오크밸리컨트리클럽', address: '강원도 원주시', phone: '033-1234-5678', category: '골프장', region: '강원', latitude: 37.6564, longitude: 128.6814 },
                { id: 'gangwon_2', name: '비발디파크골프클럽', address: '강원도 홍천군', phone: '033-2345-6789', category: '골프장', region: '강원', latitude: 37.6924, longitude: 128.4465 },
                { id: 'gangwon_3', name: '휘닉스골프클럽', address: '강원도 평창군', phone: '033-3456-7890', category: '골프장', region: '강원', latitude: 37.6500, longitude: 128.6833 }
            ],
            '충청': [
                { id: 'chungcheong_1', name: '대전골프클럽', address: '대전광역시 유성구', phone: '042-1234-5678', category: '골프장', region: '충청', latitude: 36.3504, longitude: 127.3845 },
                { id: 'chungcheong_2', name: '청주골프클럽', address: '충청북도 청주시', phone: '043-2345-6789', category: '골프장', region: '충청', latitude: 36.6424, longitude: 127.4890 },
                { id: 'chungcheong_3', name: '충남골프클럽', address: '충청남도 천안시', phone: '041-3456-7890', category: '골프장', region: '충청', latitude: 36.8150, longitude: 127.1139 }
            ],
            '전라': [
                { id: 'jeolla_1', name: '무주골프클럽', address: '전라북도 무주군', phone: '063-1234-5678', category: '골프장', region: '전라', latitude: 35.9319, longitude: 127.6608 },
                { id: 'jeolla_2', name: '전주골프클럽', address: '전라북도 전주시', phone: '063-2345-6789', category: '골프장', region: '전라', latitude: 35.8242, longitude: 127.1480 },
                { id: 'jeolla_3', name: '여수골프클럽', address: '전라남도 여수시', phone: '061-3456-7890', category: '골프장', region: '전라', latitude: 34.7604, longitude: 127.6622 }
            ],
            '경상': [
                { id: 'gyeongsang_1', name: '부산골프클럽', address: '부산광역시 해운대구', phone: '051-1234-5678', category: '골프장', region: '경상', latitude: 35.1796, longitude: 129.0756 },
                { id: 'gyeongsang_2', name: '대구골프클럽', address: '대구광역시 수성구', phone: '053-2345-6789', category: '골프장', region: '경상', latitude: 35.8714, longitude: 128.6014 },
                { id: 'gyeongsang_3', name: '울산골프클럽', address: '울산광역시 남구', phone: '052-3456-7890', category: '골프장', region: '경상', latitude: 35.5384, longitude: 129.3114 }
            ],
            '제주': [
                { id: 'jeju_1', name: '제주골프클럽', address: '제주특별자치도 제주시', phone: '064-1234-5678', category: '골프장', region: '제주', latitude: 33.4996, longitude: 126.5312 },
                { id: 'jeju_2', name: '핀크스골프클럽', address: '제주특별자치도 서귀포시', phone: '064-2345-6789', category: '골프장', region: '제주', latitude: 33.2541, longitude: 126.5601 },
                { id: 'jeju_3', name: '나인브릿지골프클럽', address: '제주특별자치도 제주시', phone: '064-3456-7890', category: '골프장', region: '제주', latitude: 33.5141, longitude: 126.5297 }
            ]
        };

        return dummyData[region] || [];
    }
}

// 전역 객체로 노출
window.LocationService = new LocationService(); 