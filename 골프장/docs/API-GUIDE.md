# 🏌️ GolfLoop API 사용 가이드

## 📋 개요

**GolfLoop**에서 사용하는 **카카오 지도/위치 API** 통합 가이드입니다.  
실제 위치 기반 골프장 검색, 지도 표시, 후기 위치 기록 등의 기능을 구현합니다.

---

## 🔑 API 키 설정

### 1. 카카오 개발자센터 등록
```bash
# 1. https://developers.kakao.com 접속
# 2. 애플리케이션 추가하기 클릭
# 3. 앱 이름: "GolfLoop" 입력
# 4. 회사명: 원하는 이름 입력
```

### 2. API 키 발급
```javascript
// config/api-config.js에 설정
const API_CONFIG = {
    KAKAO_APP_KEY: 'YOUR_JAVASCRIPT_KEY',    // 웹에서 사용
    KAKAO_REST_KEY: 'YOUR_REST_API_KEY'      // 서버에서 사용
};
```

### 3. 플랫폼 등록
```bash
# 개발자센터 > 내 애플리케이션 > 앱 설정 > 플랫폼
# Web 플랫폼 추가:
# - 사이트 도메인: http://localhost:3000 (개발용)
# - 사이트 도메인: https://yourdomain.com (운영용)
```

---

## 🗺️ 1. 지도 API 사용법

### HTML에 SDK 추가
```html
<!-- 카카오 지도 SDK 로드 -->
<script type="text/javascript" 
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_JAVASCRIPT_KEY&libraries=services,clusterer">
</script>

<!-- 지도 컨테이너 -->
<div id="map" style="width:100%; height:400px;"></div>
```

### 지도 초기화
```javascript
// MapService 사용
await window.MapService.initMap('map', {
    center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 중심
    level: 8 // 확대 레벨
});

// 사용자 위치 표시
await window.MapService.showUserLocation();
```

### 골프장 마커 표시
```javascript
// 골프장 검색 후 마커 표시
const golfCourses = await window.LocationService.searchNearbyGolfCourses(
    37.5665, 126.9780, 10000
);

window.MapService.showGolfCourseMarkers(golfCourses);
```

---

## 📍 2. 위치 검색 API

### 주변 골프장 검색
```javascript
/**
 * 주변 골프장 검색
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도  
 * @param {number} radius - 검색 반경 (미터)
 * @returns {Array} 골프장 목록
 */
const golfCourses = await window.LocationService.searchNearbyGolfCourses(
    37.5665,   // 위도
    126.9780,  // 경도
    10000      // 10km 반경
);

// 결과 구조
[
    {
        id: "place_id",
        name: "스카이힐 컨트리클럽",
        address: "경기도 성남시 분당구...",
        phone: "031-123-4567",
        latitude: 37.4563,
        longitude: 127.1234,
        distance: 2.5,              // km
        distanceText: "2.5km",
        rating: "4.8",
        reviewCount: 126,
        price: {
            weekday: 120000,
            weekend: 180000,
            formatted: "평일 120,000원"
        },
        status: "excellent"         // excellent, good, normal, poor
    }
]
```

### 골프장 이름으로 검색
```javascript
const results = await window.LocationService.searchGolfCourseByName("스카이힐");
```

### 지역별 골프장 검색
```javascript
const results = await window.LocationService.searchGolfCoursesByRegion("경기도");
```

---

## 🏠 3. 주소 ↔ 좌표 변환

### 주소 → 좌표 변환
```javascript
const coords = await window.LocationService.getCoordsFromAddress(
    "서울시 강남구 테헤란로 123"
);

// 결과
{
    latitude: 37.5665,
    longitude: 126.9780,
    address: "서울 강남구 테헤란로 123"
}
```

### 좌표 → 주소 변환
```javascript
const address = await window.LocationService.getAddressFromCoords(
    37.5665, 126.9780
);

// 결과
{
    roadAddress: "서울 강남구 테헤란로 123",
    jibunAddress: "서울 강남구 역삼동 123-45",
    region: "서울특별시",
    district: "강남구",
    formatted: "서울 강남구 테헤란로 123"
}
```

---

## 📝 4. 후기 위치 자동 기록

### 위치 기반 골프장 추천
```javascript
// 현재 위치에서 가까운 골프장 자동 추천
const recommendations = await window.ReviewLocationService.detectAndRecommendGolfCourses();

// 골프장 선택
window.ReviewLocationService.selectGolfCourse(golfCourse);

// 위치 메타데이터 수집
const locationData = window.ReviewLocationService.getLocationMetadata();
```

### 후기 데이터 구조
```javascript
// 위치가 포함된 후기 데이터
const reviewData = {
    // 기본 후기 정보
    content: "그린 상태가 정말 좋았어요!",
    rating: 5,
    photos: ["photo1.jpg", "photo2.jpg"],
    
    // 위치 메타데이터
    location: {
        golfCourse: {
            id: "place_123",
            name: "스카이힐 컨트리클럽",
            address: "경기도 성남시...",
            latitude: 37.4563,
            longitude: 127.1234
        },
        userLocation: {
            latitude: 37.4560,
            longitude: 127.1230,
            address: "경기도 성남시 분당구...",
            accuracy: 10 // 미터
        },
        distance: 0.3, // km
        timestamp: 1640995200000,
        detectMethod: "gps_auto"
    }
};
```

---

## 🧭 5. 현재 위치 가져오기

### HTML5 Geolocation 사용
```javascript
try {
    const position = await window.GolfLoopAPI.getCurrentPosition();
    
    console.log('현재 위치:', {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy
    });
    
} catch (error) {
    console.error('위치 가져오기 실패:', error.message);
    // 위치 권한 거부, 타임아웃 등 처리
}
```

### 위치 권한 처리
```javascript
// 위치 권한 상태 확인
navigator.permissions.query({name: 'geolocation'}).then(function(result) {
    if (result.state === 'granted') {
        console.log('위치 권한 허용됨');
    } else if (result.state === 'prompt') {
        console.log('위치 권한 요청 필요');
    } else {
        console.log('위치 권한 거부됨');
    }
});
```

---

## 💰 6. API 요금 및 제한사항

### 카카오 API 요금 (2024년 기준)
| API | 무료 사용량 | 초과 시 요금 |
|-----|------------|-------------|
| 키워드 장소 검색 | 10,000건/일 | 2원/건 |
| 주소 검색 | 300,000건/일 | 0.5원/건 |
| 좌표→주소 변환 | 300,000건/일 | 0.5원/건 |
| 지도 SDK | 무제한 | 무료 |

### 사용량 최적화 팁
```javascript
// 1. 캐싱 활용
const cache = new Map();
const cacheKey = `golf_${lat}_${lng}`;
if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
}

// 2. 검색 범위 제한
const radius = 5000; // 5km로 제한

// 3. 결과 개수 제한
const size = 15; // 최대 15개

// 4. 디바운싱 적용 (검색 입력 시)
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
};
```

---

## 🔧 7. 실제 구현 예시

### 완전한 골프장 검색 컴포넌트
```html
<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" 
            src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KEY&libraries=services">
    </script>
    <script src="config/api-config.js"></script>
    <script src="services/location-service.js"></script>
    <script src="services/map-service.js"></script>
</head>
<body>
    <button onclick="findNearbyGolfCourses()">내 주변 골프장 찾기</button>
    <div id="map" style="width:100%; height:400px;"></div>
    <div id="results"></div>

    <script>
        async function findNearbyGolfCourses() {
            try {
                // 1. 지도 초기화
                await window.MapService.initMap('map');
                
                // 2. 사용자 위치 표시
                await window.MapService.showUserLocation();
                
                // 3. 주변 골프장 검색
                const userLocation = await window.LocationService.getUserLocation();
                const golfCourses = await window.LocationService.searchNearbyGolfCourses(
                    userLocation.latitude,
                    userLocation.longitude,
                    10000
                );
                
                // 4. 지도에 마커 표시
                window.MapService.showGolfCourseMarkers(golfCourses);
                
                // 5. 결과 목록 표시
                displayResults(golfCourses);
                
            } catch (error) {
                console.error('검색 실패:', error);
                alert('위치 권한을 허용해주세요.');
            }
        }
        
        function displayResults(golfCourses) {
            const container = document.getElementById('results');
            container.innerHTML = golfCourses.map(course => `
                <div class="golf-course-item">
                    <h3>${course.name}</h3>
                    <p>📍 ${course.address}</p>
                    <p>🚗 ${course.distanceText} | ⭐ ${course.rating}</p>
                    <p>💰 ${course.price.formatted}</p>
                </div>
            `).join('');
        }
    </script>
</body>
</html>
```

---

## 🚨 8. 에러 처리 및 디버깅

### 주요 에러 상황
```javascript
try {
    const golfCourses = await window.LocationService.searchNearbyGolfCourses(lat, lng);
} catch (error) {
    switch (error.message) {
        case 'API 요청 실패: 401':
            console.error('API 키가 유효하지 않습니다.');
            break;
        case 'API 요청 실패: 429':
            console.error('API 사용량 초과입니다.');
            break;
        case '위치 권한이 거부되었습니다.':
            console.error('위치 권한을 허용해주세요.');
            break;
        default:
            console.error('알 수 없는 오류:', error);
    }
}
```

### 디버깅 팁
```javascript
// 1. API 응답 로깅
console.log('API 응답:', response);

// 2. 위치 정확도 확인
console.log('위치 정확도:', position.accuracy, '미터');

// 3. 캐시 상태 확인
console.log('캐시 크기:', window.LocationService.cache.size);

// 4. 브라우저 지원 확인
if (!navigator.geolocation) {
    console.error('이 브라우저는 위치 서비스를 지원하지 않습니다.');
}
```

---

## ✅ 9. 체크리스트

### 개발 전 준비사항
- [ ] 카카오 개발자센터 계정 생성
- [ ] 애플리케이션 등록 및 API 키 발급
- [ ] 플랫폼 도메인 등록
- [ ] HTTPS 설정 (위치 권한 필요)

### 구현 체크리스트
- [ ] API 키 설정 완료
- [ ] 지도 SDK 로드 확인
- [ ] 위치 권한 요청 구현
- [ ] 에러 처리 구현
- [ ] 사용량 모니터링 설정

### 운영 전 체크리스트
- [ ] API 사용량 한도 확인
- [ ] 실제 도메인으로 플랫폼 등록
- [ ] 프로덕션 API 키로 교체
- [ ] 에러 로깅 시스템 구축

---

## 🔗 참고 자료

- [카카오 지도 API 문서](https://apis.map.kakao.com/)
- [카카오 로컬 API 문서](https://developers.kakao.com/docs/latest/ko/local/common)
- [HTML5 Geolocation API](https://developer.mozilla.org/ko/docs/Web/API/Geolocation_API)

---

**🏌️ 이제 GolfLoop에서 실제 위치 기반 골프장 검색과 지도 기능을 사용할 수 있습니다!** 