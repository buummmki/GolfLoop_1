/**
 * GolfLoop 지도 서비스
 * 카카오 지도 SDK를 활용한 지도 표시 및 마커 관리
 */

class MapService {
    constructor() {
        this.map = null;
        this.markers = [];
        this.infoWindows = [];
        this.userMarker = null;
        this.clusterer = null;
        this.isInitialized = false;
    }

    /**
     * 🗺️ 지도 초기화
     */
    async initMap(containerId, options = {}) {
        try {
            if (!window.GolfLoopAPI.initKakaoMap()) {
                throw new Error('카카오 지도 SDK 초기화 실패');
            }

            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`지도 컨테이너를 찾을 수 없습니다: ${containerId}`);
            }

            // 기본 옵션 설정
            const defaultOptions = {
                center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
                level: 8, // 확대 레벨
                mapTypeId: kakao.maps.MapTypeId.ROADMAP
            };

            const mapOptions = { ...defaultOptions, ...options };

            // 지도 생성
            this.map = new kakao.maps.Map(container, mapOptions);

            // 지도 컨트롤 추가
            this.addMapControls();

            // 마커 클러스터러 초기화
            if (window.MarkerClusterer) {
                this.clusterer = new MarkerClusterer({
                    map: this.map,
                    averageCenter: true,
                    minLevel: 5,
                    disableClickZoom: true
                });
            }

            this.isInitialized = true;
            console.log('🗺️ 지도 초기화 완료');

            return this.map;

        } catch (error) {
            console.error('지도 초기화 실패:', error);
            throw error;
        }
    }

    /**
     * 🎛️ 지도 컨트롤 추가
     */
    addMapControls() {
        // 확대/축소 컨트롤
        const zoomControl = new kakao.maps.ZoomControl();
        this.map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 지도타입 컨트롤
        const mapTypeControl = new kakao.maps.MapTypeControl();
        this.map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    }

    /**
     * 📍 사용자 위치 마커 표시
     */
    async showUserLocation() {
        try {
            const userLocation = await window.LocationService.getUserLocation();
            
            // 기존 사용자 마커 제거
            if (this.userMarker) {
                this.userMarker.setMap(null);
            }

            // 사용자 위치 마커 생성
            const userPosition = new kakao.maps.LatLng(
                userLocation.latitude,
                userLocation.longitude
            );

            this.userMarker = new kakao.maps.Marker({
                position: userPosition,
                map: this.map,
                image: this.createCustomMarkerImage('user'),
                title: '내 위치'
            });

            // 지도 중심을 사용자 위치로 이동
            this.map.setCenter(userPosition);
            this.map.setLevel(6);

            // 정확도 원 표시
            if (userLocation.accuracy) {
                const accuracyCircle = new kakao.maps.Circle({
                    center: userPosition,
                    radius: userLocation.accuracy,
                    strokeWeight: 2,
                    strokeColor: '#4285f4',
                    strokeOpacity: 0.8,
                    fillColor: '#4285f4',
                    fillOpacity: 0.2
                });
                accuracyCircle.setMap(this.map);
            }

            console.log('📍 사용자 위치 마커 표시 완료');
            return userPosition;

        } catch (error) {
            console.error('사용자 위치 표시 실패:', error);
            throw error;
        }
    }

    /**
     * ⛳ 골프장 마커들 표시
     */
    showGolfCourseMarkers(golfCourses) {
        try {
            // 기존 골프장 마커 제거
            this.clearGolfMarkers();

            const bounds = new kakao.maps.LatLngBounds();
            const newMarkers = [];

            golfCourses.forEach((course, index) => {
                const position = new kakao.maps.LatLng(
                    course.latitude,
                    course.longitude
                );

                // 마커 생성
                const marker = new kakao.maps.Marker({
                    position: position,
                    image: this.createCustomMarkerImage('golf', course.status),
                    title: course.name,
                    clickable: true
                });

                // 정보창 콘텐츠 생성
                const infoContent = this.createInfoWindowContent(course);
                const infoWindow = new kakao.maps.InfoWindow({
                    content: infoContent,
                    removable: true
                });

                // 마커 클릭 이벤트
                kakao.maps.event.addListener(marker, 'click', () => {
                    // 다른 정보창 닫기
                    this.closeAllInfoWindows();
                    
                    // 현재 정보창 열기
                    infoWindow.open(this.map, marker);
                    this.infoWindows.push(infoWindow);
                    
                    // 선택된 골프장 처리
                    this.onGolfCourseSelected(course);
                });

                newMarkers.push(marker);
                bounds.extend(position);
            });

            // 마커들을 지도에 표시
            if (this.clusterer) {
                this.clusterer.addMarkers(newMarkers);
            } else {
                newMarkers.forEach(marker => marker.setMap(this.map));
            }

            this.markers = newMarkers;

            // 모든 마커가 보이도록 지도 범위 조정
            if (golfCourses.length > 0) {
                this.map.setBounds(bounds);
            }

            console.log(`⛳ ${golfCourses.length}개 골프장 마커 표시 완료`);

        } catch (error) {
            console.error('골프장 마커 표시 실패:', error);
        }
    }

    /**
     * 🎨 커스텀 마커 이미지 생성
     */
    createCustomMarkerImage(type, status = 'good') {
        let imageSrc, imageSize, imageOption;

        if (type === 'user') {
            // 사용자 위치 마커
            imageSrc = 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="12" fill="#4285f4" stroke="white" stroke-width="3"/>
                    <circle cx="16" cy="16" r="4" fill="white"/>
                </svg>
            `);
            imageSize = new kakao.maps.Size(32, 32);
        } else {
            // 골프장 마커 (상태별 색상)
            const colors = {
                'excellent': '#00C851', // 초록
                'good': '#2196F3',      // 파랑
                'normal': '#FF9800',    // 주황
                'poor': '#F44336'       // 빨강
            };
            
            const color = colors[status] || colors.good;
            
            imageSrc = 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                    <path d="M20 2C13.383 2 8 7.383 8 14c0 10.5 12 24 12 24s12-13.5 12-24c0-6.617-5.383-12-12-12z" 
                          fill="${color}" stroke="white" stroke-width="2"/>
                    <circle cx="20" cy="14" r="6" fill="white"/>
                    <text x="20" y="18" text-anchor="middle" fill="${color}" font-size="10" font-weight="bold">⛳</text>
                </svg>
            `);
            imageSize = new kakao.maps.Size(40, 40);
            imageOption = { offset: new kakao.maps.Point(20, 40) };
        }

        return new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
    }

    /**
     * 💬 정보창 콘텐츠 생성
     */
    createInfoWindowContent(course) {
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

        return `
            <div style="padding: 15px; width: 280px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #333;">
                    ${course.name}
                </h4>
                <div style="margin-bottom: 8px; font-size: 13px; color: #666;">
                    📍 ${course.address}
                </div>
                <div style="margin-bottom: 8px; font-size: 13px; color: #666;">
                    🚗 ${course.distanceText} · ⭐ ${course.rating} (${course.reviewCount})</div>
                <div style="margin-bottom: 8px; font-size: 13px;">
                    ${statusEmoji[course.status]} <span style="font-weight: 500;">${statusText[course.status]}</span>
                    <span style="margin-left: 10px; color: #666;">💰 ${course.price.formatted}</span>
                </div>
                <div style="margin-top: 12px; display: flex; gap: 8px;">
                    <button onclick="window.MapService.viewGolfCourseDetails('${course.id}')" 
                            style="flex: 1; padding: 6px 12px; background: #2196F3; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                        후기 보기
                    </button>
                    <button onclick="window.MapService.bookGolfCourse('${course.id}')" 
                            style="flex: 1; padding: 6px 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
                        예약하기
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 🏌️ 골프장 선택 이벤트 처리
     */
    onGolfCourseSelected(course) {
        // 커스텀 이벤트 발생
        window.dispatchEvent(new CustomEvent('golfCourseSelected', {
            detail: course
        }));
        
        console.log('골프장 선택됨:', course.name);
    }

    /**
     * 📝 골프장 상세 보기
     */
    viewGolfCourseDetails(courseId) {
        window.location.href = `golf-reviews.html?course=${courseId}`;
    }

    /**
     * 🎯 골프장 예약하기
     */
    bookGolfCourse(courseId) {
        window.location.href = `booking.html?course=${courseId}`;
    }

    /**
     * 💬 모든 정보창 닫기
     */
    closeAllInfoWindows() {
        this.infoWindows.forEach(infoWindow => infoWindow.close());
        this.infoWindows = [];
    }

    /**
     * 🗑️ 골프장 마커 제거
     */
    clearGolfMarkers() {
        if (this.clusterer) {
            this.clusterer.clear();
        } else {
            this.markers.forEach(marker => marker.setMap(null));
        }
        this.markers = [];
        this.closeAllInfoWindows();
    }

    /**
     * 📍 특정 위치로 이동
     */
    moveToLocation(latitude, longitude, level = 6) {
        if (!this.map) return;
        
        const position = new kakao.maps.LatLng(latitude, longitude);
        this.map.setCenter(position);
        this.map.setLevel(level);
    }

    /**
     * 🔄 지도 새로고침
     */
    refresh() {
        if (this.map) {
            this.map.relayout();
        }
    }

    /**
     * 🗑️ 지도 정리
     */
    destroy() {
        this.clearGolfMarkers();
        if (this.userMarker) {
            this.userMarker.setMap(null);
        }
        this.map = null;
        this.isInitialized = false;
    }
}

// 전역 인스턴스 생성
window.MapService = new MapService();

console.log('🗺️ MapService 초기화 완료'); 