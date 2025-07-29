// GolfLoop 리뷰 위치 서비스
class ReviewLocationService {
    constructor() {
        this.locationService = window.LocationService;
        this.nearbyRecommendations = [];
    }

    // 현재 위치 감지 및 골프장 추천
    async detectAndRecommendGolfCourses() {
        try {
            // 사용자 위치 가져오기
            const userLocation = await this.locationService.getUserLocation();
            
            // 주변 골프장 검색
            const nearbyGolfCourses = await this.locationService.searchNearbyGolfCourses(
                userLocation.latitude,
                userLocation.longitude,
                10000 // 10km 반경
            );

            // 추천 우선순위 설정
            this.nearbyRecommendations = this.prioritizeRecommendations(nearbyGolfCourses);
            
            console.log(`📍 ${this.nearbyRecommendations.length}개 골프장 추천 완료`);
            return this.nearbyRecommendations;
            
        } catch (error) {
            console.error('위치 기반 추천 실패:', error);
            throw error;
        }
    }

    // 골프장 추천 우선순위 설정
    prioritizeRecommendations(golfCourses) {
        if (!golfCourses || golfCourses.length === 0) {
            return [];
        }

        return golfCourses.map(course => {
            // 거리에 따른 점수 계산 (가까울수록 높은 점수)
            const distanceScore = Math.max(0, 100 - (course.distance / 100));
            
            // 카테고리에 따른 점수 (골프장 관련 카테고리 우선)
            let categoryScore = 50;
            if (course.category && course.category.includes('골프')) {
                categoryScore = 100;
            } else if (course.category && course.category.includes('스포츠')) {
                categoryScore = 80;
            }

            // 종합 점수 계산
            const totalScore = (distanceScore * 0.7) + (categoryScore * 0.3);
            
            return {
                ...course,
                recommendationScore: Math.round(totalScore),
                distanceText: this.formatDistance(course.distance)
            };
        }).sort((a, b) => b.recommendationScore - a.recommendationScore);
    }

    // 거리 포맷팅
    formatDistance(distance) {
        if (distance < 1000) {
            return `${distance}m`;
        } else {
            return `${(distance / 1000).toFixed(1)}km`;
        }
    }

    // 선택된 골프장 정보 가져오기
    getSelectedCourse(courseId) {
        return this.nearbyRecommendations.find(course => course.id === courseId);
    }

    // 골프장 검색 (수동 검색용)
    async searchGolfCourses(query) {
        try {
            const results = await this.locationService.searchGolfCourseByName(query);
            
            // 검색 결과에 거리 정보 추가
            const userLocation = await this.locationService.getUserLocation();
            const coursesWithDistance = results.map(course => {
                const distance = this.locationService.calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    course.latitude,
                    course.longitude
                );
                
                return {
                    ...course,
                    distance: distance * 1000, // km를 m로 변환
                    distanceText: this.formatDistance(distance * 1000)
                };
            });

            // 거리순 정렬
            coursesWithDistance.sort((a, b) => a.distance - b.distance);
            
            return coursesWithDistance;
            
        } catch (error) {
            console.error('골프장 검색 실패:', error);
            throw error;
        }
    }

    // 골프장 선택 처리
    selectGolfCourse(course) {
        // 선택된 골프장 정보를 전역 변수에 저장
        window.selectedGolfCourse = course;
        
        // 이벤트 발생
        window.dispatchEvent(new CustomEvent('golfCourseSelected', {
            detail: course
        }));
        
        console.log('골프장 선택됨:', course.name);
        return course;
    }

    // 선택된 골프장 정보 가져오기
    getSelectedGolfCourse() {
        return window.selectedGolfCourse;
    }

    // 선택된 골프장 변경
    changeSelectedGolfCourse() {
        window.selectedGolfCourse = null;
        console.log('선택된 골프장 초기화');
    }

    // 위치 권한 확인
    async checkLocationPermission() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(false);
                return;
            }

            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                resolve(result.state === 'granted');
            }).catch(() => {
                resolve(false);
            });
        });
    }

    // 위치 권한 요청
    async requestLocationPermission() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('브라우저가 위치 정보를 지원하지 않습니다.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                () => resolve(true),
                (error) => {
                    let message = '위치 권한이 필요합니다.';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = '위치 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
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
                    maximumAge: 300000
                }
            );
        });
    }
}

// 전역 객체로 노출
window.ReviewLocationService = new ReviewLocationService(); 