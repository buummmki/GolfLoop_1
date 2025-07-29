// GolfLoop 골프장 데이터 서비스 v3.0
// 2024년 완전한 전국 골프장 현황 데이터 기반

class GolfCoursesService2024 {
    constructor() {
        this.database = window.GolfCoursesComplete2024 || {};
        this.cache = new Map();
    }

    // 모든 골프장 데이터 가져오기
    getAllGolfCourses() {
        const allCourses = [];
        Object.values(this.database).forEach(regionCourses => {
            allCourses.push(...regionCourses);
        });
        return allCourses;
    }

    // 지역별 골프장 검색
    searchGolfCoursesByRegion(region) {
        const cacheKey = `region_${region}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const courses = this.database[region] || [];
        this.cache.set(cacheKey, courses);
        
        console.log(`${region} 지역 ${courses.length}개 골프장 검색 완료`);
        return courses;
    }

    // 골프장명으로 검색
    searchGolfCourseByName(query) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        const results = [];

        Object.values(this.database).forEach(regionCourses => {
            regionCourses.forEach(course => {
                if (course.name.toLowerCase().includes(searchTerm) ||
                    course.address.toLowerCase().includes(searchTerm)) {
                    results.push(course);
                }
            });
        });

        console.log(`"${query}" 검색 결과: ${results.length}개 골프장`);
        return results;
    }

    // ID로 골프장 검색
    getGolfCourseById(id) {
        const allCourses = this.getAllGolfCourses();
        return allCourses.find(course => course.id === id);
    }

    // 주변 골프장 검색 (위도, 경도 기준)
    searchNearbyGolfCourses(latitude, longitude, radius = 10000) {
        const allCourses = this.getAllGolfCourses();
        const nearbyCourses = [];

        allCourses.forEach(course => {
            const distance = this.calculateDistance(
                latitude, longitude,
                course.latitude, course.longitude
            );

            if (distance * 1000 <= radius) { // km를 m로 변환
                nearbyCourses.push({
                    ...course,
                    distance: distance * 1000, // m 단위로 저장
                    distanceText: this.formatDistance(distance * 1000)
                });
            }
        });

        // 거리순 정렬
        nearbyCourses.sort((a, b) => a.distance - b.distance);

        console.log(`주변 ${radius/1000}km 내 ${nearbyCourses.length}개 골프장 검색 완료`);
        return nearbyCourses;
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

    // 거리 포맷팅
    formatDistance(distance) {
        if (distance < 1000) {
            return `${Math.round(distance)}m`;
        } else {
            return `${(distance / 1000).toFixed(1)}km`;
        }
    }

    // 골프장 통계 정보
    getGolfCourseStats() {
        const allCourses = this.getAllGolfCourses();
        
        const stats = {
            total: allCourses.length,
            byRegion: {},
            byType: {},
            byHoles: {},
            byArea: {}
        };

        // 지역별 통계
        Object.keys(this.database).forEach(region => {
            stats.byRegion[region] = this.database[region].length;
        });

        // 유형별 통계
        allCourses.forEach(course => {
            const type = course.type || '기타';
            stats.byType[type] = (stats.byType[type] || 0) + 1;
        });

        // 홀 수별 통계
        allCourses.forEach(course => {
            const holes = course.holes || 18;
            stats.byHoles[holes] = (stats.byHoles[holes] || 0) + 1;
        });

        // 면적별 통계
        allCourses.forEach(course => {
            const area = course.totalArea || 0;
            if (area < 1000000) {
                stats.byArea['소형(100만㎡ 미만)'] = (stats.byArea['소형(100만㎡ 미만)'] || 0) + 1;
            } else if (area < 2000000) {
                stats.byArea['중형(100-200만㎡)'] = (stats.byArea['중형(100-200만㎡)'] || 0) + 1;
            } else {
                stats.byArea['대형(200만㎡ 이상)'] = (stats.byArea['대형(200만㎡ 이상)'] || 0) + 1;
            }
        });

        return stats;
    }

    // 골프장 정보 업데이트
    updateGolfCourseInfo(id, updates) {
        Object.values(this.database).forEach(regionCourses => {
            const courseIndex = regionCourses.findIndex(course => course.id === id);
            if (courseIndex !== -1) {
                regionCourses[courseIndex] = {
                    ...regionCourses[courseIndex],
                    ...updates,
                    lastUpdate: new Date().toISOString().split('T')[0]
                };
                console.log(`골프장 정보 업데이트: ${id}`);
                return;
            }
        });
    }

    // 골프장 리뷰 추가
    addGolfCourseReview(id, review) {
        const course = this.getGolfCourseById(id);
        if (course) {
            if (!course.reviews) {
                course.reviews = [];
            }
            course.reviews.push({
                ...review,
                id: Date.now(),
                date: new Date().toISOString().split('T')[0]
            });
            console.log(`골프장 리뷰 추가: ${id}`);
        }
    }

    // 골프장 평점 계산
    getGolfCourseRating(id) {
        const course = this.getGolfCourseById(id);
        if (!course || !course.reviews || course.reviews.length === 0) {
            return null;
        }

        const totalRating = course.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
        return (totalRating / course.reviews.length).toFixed(1);
    }

    // 인기 골프장 (리뷰 많은 순)
    getPopularGolfCourses(limit = 10) {
        const allCourses = this.getAllGolfCourses();
        
        return allCourses
            .filter(course => course.reviews && course.reviews.length > 0)
            .sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0))
            .slice(0, limit);
    }

    // 최근 업데이트된 골프장
    getRecentlyUpdatedGolfCourses(limit = 10) {
        const allCourses = this.getAllGolfCourses();
        
        return allCourses
            .sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate))
            .slice(0, limit);
    }

    // 대중제 골프장만 필터링
    getPublicGolfCourses() {
        const allCourses = this.getAllGolfCourses();
        return allCourses.filter(course => course.type === '대중제');
    }

    // 회원제 골프장만 필터링
    getMembershipGolfCourses() {
        const allCourses = this.getAllGolfCourses();
        return allCourses.filter(course => course.type === '회원제');
    }

    // 홀 수별 골프장 필터링
    getGolfCoursesByHoles(holes) {
        const allCourses = this.getAllGolfCourses();
        return allCourses.filter(course => course.holes === holes);
    }

    // 면적별 골프장 필터링
    getGolfCoursesByArea(minArea, maxArea) {
        const allCourses = this.getAllGolfCourses();
        return allCourses.filter(course => {
            const area = course.totalArea || 0;
            return area >= minArea && area <= maxArea;
        });
    }

    // 캐시 클리어
    clearCache() {
        this.cache.clear();
        console.log('골프장 데이터 캐시 클리어');
    }
}

// 전역 객체로 노출
window.GolfCoursesService2024 = new GolfCoursesService2024(); 