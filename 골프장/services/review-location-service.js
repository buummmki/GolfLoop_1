/**
 * GolfLoop 후기 위치 서비스
 * 후기 작성 시 위치 기반 자동 추천 및 기록 관리
 */

class ReviewLocationService {
    constructor() {
        this.currentReviewLocation = null;
        this.selectedGolfCourse = null;
        this.nearbyRecommendations = [];
        this.isLocationDetecting = false;
    }

    /**
     * 🎯 후기 작성용 위치 기반 골프장 추천
     */
    async detectAndRecommendGolfCourses() {
        try {
            this.isLocationDetecting = true;
            this.updateLocationStatus('위치를 확인하는 중...');

            // 사용자 현재 위치 가져오기
            const userLocation = await window.LocationService.getUserLocation();
            this.currentReviewLocation = userLocation;

            // 주변 골프장 검색 (반경 5km)
            const nearbyGolfCourses = await window.LocationService.searchNearbyGolfCourses(
                userLocation.latitude,
                userLocation.longitude,
                5000 // 5km
            );

            // 최근 방문한 골프장 우선순위 적용
            this.nearbyRecommendations = this.prioritizeRecommendations(nearbyGolfCourses);

            // UI 업데이트
            this.updateLocationStatus('✅ 주변 골프장을 찾았습니다!');
            this.displayNearbyRecommendations();

            console.log(`📍 ${this.nearbyRecommendations.length}개 골프장 추천 완료`);
            
            return this.nearbyRecommendations;

        } catch (error) {
            console.error('위치 기반 추천 실패:', error);
            this.updateLocationStatus('⚠️ 위치를 확인할 수 없습니다. 직접 검색해주세요.');
            this.showManualSearchOption();
            throw error;
        } finally {
            this.isLocationDetecting = false;
        }
    }

    /**
     * 🏆 골프장 추천 우선순위 설정
     */
    prioritizeRecommendations(golfCourses) {
        // 최근 방문 기록 가져오기 (로컬스토리지에서)
        const recentVisits = this.getRecentGolfCourseVisits();
        
        return golfCourses.map(course => {
            let priorityScore = 0;
            
            // 거리 점수 (가까울수록 높음)
            if (course.distance < 1) priorityScore += 30;
            else if (course.distance < 3) priorityScore += 20;
            else if (course.distance < 5) priorityScore += 10;
            
            // 최근 방문 점수
            const recentVisit = recentVisits.find(v => v.name === course.name);
            if (recentVisit) {
                const daysSince = (Date.now() - recentVisit.lastVisit) / (1000 * 60 * 60 * 24);
                if (daysSince < 30) priorityScore += 25;
                else if (daysSince < 90) priorityScore += 15;
            }
            
            // 평점 점수
            if (course.rating >= 4.5) priorityScore += 15;
            else if (course.rating >= 4.0) priorityScore += 10;
            else if (course.rating >= 3.5) priorityScore += 5;
            
            // 현재 상태 점수
            if (course.status === 'excellent') priorityScore += 15;
            else if (course.status === 'good') priorityScore += 10;
            else if (course.status === 'normal') priorityScore += 5;

            return { ...course, priorityScore };
        }).sort((a, b) => b.priorityScore - a.priorityScore);
    }

    /**
     * 📋 주변 골프장 추천 목록 표시
     */
    displayNearbyRecommendations() {
        const container = document.getElementById('nearby-courses-for-review');
        if (!container) return;

        container.innerHTML = '';

        // 상위 5개만 표시
        const topRecommendations = this.nearbyRecommendations.slice(0, 5);

        topRecommendations.forEach((course, index) => {
            const courseElement = this.createGolfCourseOption(course, index === 0);
            container.appendChild(courseElement);
        });

        // 추천 섹션 표시
        const recommendationsSection = document.getElementById('recommended-courses');
        if (recommendationsSection) {
            recommendationsSection.style.display = 'block';
        }
    }

    /**
     * 🏌️ 골프장 선택 옵션 요소 생성
     */
    createGolfCourseOption(course, isRecommended = false) {
        const div = document.createElement('div');
        div.className = `course-option ${isRecommended ? 'recommended' : ''}`;
        div.onclick = () => this.selectGolfCourse(course);

        const statusEmoji = {
            'excellent': '🟢',
            'good': '🔵', 
            'normal': '🟡',
            'poor': '🔴'
        };

        const statusText = {
            'excellent': '최고',
            'good': '좋음',
            'normal': '보통',
            'poor': '나쁨'
        };

        div.innerHTML = `
            <div class="course-info">
                <div class="course-header">
                    <h5>${course.name}</h5>
                    ${isRecommended ? '<span class="recommended-badge">✨ 추천</span>' : ''}
                </div>
                <p class="course-location">📍 ${course.address}</p>
                <div class="course-meta">
                    <span class="distance">🚗 ${course.distanceText}</span>
                    <span class="rating">⭐ ${course.rating}</span>
                    <span class="status">${statusEmoji[course.status]} ${statusText[course.status]}</span>
                </div>
                ${this.getRecentVisitInfo(course.name)}
            </div>
        `;

        return div;
    }

    /**
     * 📅 최근 방문 정보 표시
     */
    getRecentVisitInfo(courseName) {
        const recentVisits = this.getRecentGolfCourseVisits();
        const visit = recentVisits.find(v => v.name === courseName);
        
        if (visit) {
            const daysSince = Math.floor((Date.now() - visit.lastVisit) / (1000 * 60 * 60 * 24));
            return `<div class="recent-visit">🕒 ${daysSince}일 전 방문</div>`;
        }
        
        return '';
    }

    /**
     * ⭐ 골프장 선택 처리
     */
    selectGolfCourse(course) {
        this.selectedGolfCourse = course;
        
        // 선택된 골프장 정보 표시
        this.displaySelectedGolfCourse();
        
        // 후기 작성 폼 표시
        this.showReviewForm();
        
        // 최근 방문 기록 업데이트
        this.updateRecentVisit(course);
        
        console.log('골프장 선택됨:', course.name);
    }

    /**
     * 📍 선택된 골프장 정보 표시
     */
    displaySelectedGolfCourse() {
        const infoContainer = document.getElementById('selected-course-info');
        const nameElement = document.getElementById('selected-course-name');
        const locationElement = document.getElementById('selected-course-location');
        const distanceElement = document.getElementById('selected-course-distance');

        if (infoContainer && this.selectedGolfCourse) {
            nameElement.textContent = this.selectedGolfCourse.name;
            locationElement.textContent = `📍 ${this.selectedGolfCourse.address}`;
            distanceElement.textContent = `🚗 ${this.selectedGolfCourse.distanceText}`;
            
            infoContainer.style.display = 'block';
        }

        // 추천 섹션 숨기기
        const recommendationsSection = document.getElementById('recommended-courses');
        if (recommendationsSection) {
            recommendationsSection.style.display = 'none';
        }
    }

    /**
     * 📝 후기 작성 폼 표시
     */
    showReviewForm() {
        const form = document.getElementById('location-review-form');
        if (form) {
            form.style.display = 'block';
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * 🔄 골프장 변경 처리
     */
    changeSelectedCourse() {
        this.selectedGolfCourse = null;
        
        // 선택된 골프장 정보 숨기기
        const infoContainer = document.getElementById('selected-course-info');
        if (infoContainer) {
            infoContainer.style.display = 'none';
        }
        
        // 후기 작성 폼 숨기기
        const form = document.getElementById('location-review-form');
        if (form) {
            form.style.display = 'none';
        }
        
        // 추천 섹션 다시 표시
        const recommendationsSection = document.getElementById('recommended-courses');
        if (recommendationsSection) {
            recommendationsSection.style.display = 'block';
        }
    }

    /**
     * 🔍 수동 검색 기능
     */
    async searchGolfCourseManually(query) {
        try {
            if (!query || query.trim().length < 2) {
                return [];
            }

            const results = await window.LocationService.searchGolfCourseByName(query.trim());
            
            // 현재 위치와의 거리 계산
            if (this.currentReviewLocation) {
                results.forEach(course => {
                    course.distance = window.GolfLoopAPI.calculateDistance(
                        this.currentReviewLocation.latitude,
                        this.currentReviewLocation.longitude,
                        course.latitude,
                        course.longitude
                    );
                    course.distanceText = window.GolfLoopAPI.formatDistance(course.distance);
                });
            }

            return results;

        } catch (error) {
            console.error('수동 검색 실패:', error);
            return [];
        }
    }

    /**
     * 📊 후기 위치 데이터 수집
     */
    getLocationMetadata() {
        if (!this.selectedGolfCourse || !this.currentReviewLocation) {
            return null;
        }

        return {
            golfCourse: {
                id: this.selectedGolfCourse.id,
                name: this.selectedGolfCourse.name,
                address: this.selectedGolfCourse.address,
                latitude: this.selectedGolfCourse.latitude,
                longitude: this.selectedGolfCourse.longitude
            },
            userLocation: {
                latitude: this.currentReviewLocation.latitude,
                longitude: this.currentReviewLocation.longitude,
                address: this.currentReviewLocation.address?.formatted || '',
                accuracy: this.currentReviewLocation.accuracy
            },
            distance: this.selectedGolfCourse.distance,
            timestamp: Date.now(),
            detectMethod: 'gps_auto' // GPS 자동 감지
        };
    }

    /**
     * 💾 최근 방문 골프장 기록 관리
     */
    getRecentGolfCourseVisits() {
        const stored = localStorage.getItem('golfloop_recent_visits');
        return stored ? JSON.parse(stored) : [];
    }

    updateRecentVisit(course) {
        const visits = this.getRecentGolfCourseVisits();
        const existingIndex = visits.findIndex(v => v.name === course.name);
        
        const visitData = {
            name: course.name,
            address: course.address,
            lastVisit: Date.now()
        };

        if (existingIndex >= 0) {
            visits[existingIndex] = visitData;
        } else {
            visits.unshift(visitData);
        }

        // 최대 10개만 저장
        if (visits.length > 10) {
            visits.splice(10);
        }

        localStorage.setItem('golfloop_recent_visits', JSON.stringify(visits));
    }

    /**
     * 📱 UI 업데이트 헬퍼 함수들
     */
    updateLocationStatus(message) {
        // 기존 script.js의 showToast 함수 활용
        if (window.showToast) {
            window.showToast(message);
        }
    }

    showManualSearchOption() {
        const manualSearchToggle = document.querySelector('.toggle-search-btn');
        if (manualSearchToggle) {
            manualSearchToggle.click();
        }
    }

    /**
     * 🗑️ 데이터 초기화
     */
    reset() {
        this.currentReviewLocation = null;
        this.selectedGolfCourse = null;
        this.nearbyRecommendations = [];
        this.isLocationDetecting = false;
    }
}

// 전역 인스턴스 생성
window.ReviewLocationService = new ReviewLocationService();

console.log('📝 ReviewLocationService 초기화 완료'); 