/**
 * GolfLoop API 설정 파일
 * 카카오 지도/위치 API 통합 관리
 */

// ⚠️ 실제 운영 시에는 환경변수(.env)로 관리하세요!
const API_CONFIG = {
    // 카카오 개발자센터에서 발급받은 JavaScript 키
    KAKAO_APP_KEY: '25171caa731cc576b1f8345acdebfcb9',
    
    // 카카오 REST API 키 (서버 사이드 호출용)
    KAKAO_REST_KEY: 'b7f8ba92ee7993c3311c1653718788aa',
    
    // API 엔드포인트
    ENDPOINTS: {
        // 키워드로 장소 검색
        PLACE_SEARCH: 'https://dapi.kakao.com/v2/local/search/keyword.json',
        
        // 주소 검색 (주소 → 좌표)
        ADDRESS_SEARCH: 'https://dapi.kakao.com/v2/local/search/address.json',
        
        // 좌표 → 주소 변환
        COORD_TO_ADDRESS: 'https://dapi.kakao.com/v2/local/geo/coord2address.json',
        
        // 카테고리로 장소 검색
        CATEGORY_SEARCH: 'https://dapi.kakao.com/v2/local/search/category.json'
    },
    
    // 검색 옵션
    SEARCH_OPTIONS: {
        // 골프장 검색 반경 (미터)
        GOLF_SEARCH_RADIUS: 10000, // 10km
        
        // 기본 검색 결과 개수
        DEFAULT_SIZE: 15,
        
        // 골프장 카테고리 코드
        GOLF_CATEGORY: 'AT4', // 관광명소 > 골프장
        
        // 검색 키워드
        GOLF_KEYWORDS: ['골프장', '골프클럽', '컨트리클럽', '골프리조트']
    }
};

/**
 * 카카오 지도 SDK 초기화
 */
function initKakaoMap() {
    if (typeof kakao === 'undefined') {
        console.error('카카오 지도 SDK가 로드되지 않았습니다.');
        return false;
    }
    
    if (!API_CONFIG.KAKAO_APP_KEY || API_CONFIG.KAKAO_APP_KEY === 'YOUR_KAKAO_JAVASCRIPT_KEY_HERE') {
        console.warn('카카오 API 키를 설정해주세요.');
        return false;
    }
    
    return true;
}

/**
 * API 요청 헤더 생성
 */
function getApiHeaders(useRestKey = false) {
    const key = useRestKey ? API_CONFIG.KAKAO_REST_KEY : API_CONFIG.KAKAO_APP_KEY;
    
    return {
        'Authorization': `KakaoAK ${key}`,
        'Content-Type': 'application/json'
    };
}

/**
 * 현재 위치 가져오기 (HTML5 Geolocation)
 */
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'));
            return;
        }
        
        const options = {
            enableHighAccuracy: true, // 정확도 우선
            timeout: 10000,          // 10초 타임아웃
            maximumAge: 300000       // 5분간 캐시 사용
        };
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
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
            options
        );
    });
}

/**
 * 두 지점 사이의 거리 계산 (Haversine 공식)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // 소수점 2자리
}

/**
 * 거리를 읽기 쉬운 형태로 변환
 */
function formatDistance(distance) {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m`;
    } else {
        return `${distance}km`;
    }
}

// 전역 객체로 내보내기
window.GolfLoopAPI = {
    config: API_CONFIG,
    initKakaoMap,
    getApiHeaders,
    getCurrentPosition,
    calculateDistance,
    formatDistance
}; 