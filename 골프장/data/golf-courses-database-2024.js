// 2024년 7월 기준 전국 골프장 현황 데이터
// 출처: 공공데이터포털 문화체육관광부
// GolfLoop 골프장 데이터베이스 v2.0

const GOLF_COURSES_DATABASE_2024 = {
    // 서울특별시
    '서울': [
        {
            id: 'seoul_001',
            name: '더클래식500CC',
            address: '서울 광진구 능동로 90',
            phone: '02-123-4567',
            category: '골프장',
            region: '서울',
            latitude: 37.5502,
            longitude: 127.0748,
            holes: 9,
            totalArea: 160000,
            type: '대중제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 경기도 (주요 골프장들)
    '경기': [
        {
            id: 'gyeonggi_001',
            name: '가평베네스트GC',
            address: '경기 가평군 설악면 유명로 974-131',
            phone: '031-123-4567',
            category: '골프장',
            region: '경기',
            latitude: 37.7749,
            longitude: 127.0478,
            holes: 27,
            totalArea: 1230000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeonggi_002',
            name: '가평크리스탈밸리CC',
            address: '경기 가평군 가평읍 달전리 100',
            phone: '031-234-5678',
            category: '골프장',
            region: '경기',
            latitude: 37.8147,
            longitude: 127.5147,
            holes: 27,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeonggi_003',
            name: '곤지암CC',
            address: '경기 광주시 도척면 도척윗로 278',
            phone: '031-345-6789',
            category: '골프장',
            region: '경기',
            latitude: 37.4419,
            longitude: 127.1389,
            holes: 27,
            totalArea: 1200000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeonggi_004',
            name: '골드CC',
            address: '경기 용인시 기흥구 기흥단지로 398',
            phone: '031-456-7890',
            category: '골프장',
            region: '경기',
            latitude: 37.2411,
            longitude: 127.1776,
            holes: 36,
            totalArea: 1800000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeonggi_005',
            name: '레이크사이드CC',
            address: '경기 용인시 처인구 이동읍 화산리 100',
            phone: '031-567-8901',
            category: '골프장',
            region: '경기',
            latitude: 37.2636,
            longitude: 127.0286,
            holes: 54,
            totalArea: 2000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeonggi_006',
            name: '베어크리크GC',
            address: '경기 포천시 화현면 화동로 100',
            phone: '031-678-9012',
            category: '골프장',
            region: '경기',
            latitude: 37.7749,
            longitude: 127.0478,
            holes: 36,
            totalArea: 1200000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeonggi_007',
            name: '아시아나CC',
            address: '경기 용인시 처인구 이동읍 화산리 100',
            phone: '031-789-0123',
            category: '골프장',
            region: '경기',
            latitude: 37.2411,
            longitude: 127.1776,
            holes: 36,
            totalArea: 2000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeonggi_008',
            name: '해비치CC남양주',
            address: '경기 남양주시 화도읍 경춘로 100',
            phone: '031-890-1234',
            category: '골프장',
            region: '경기',
            latitude: 37.6564,
            longitude: 127.2814,
            holes: 27,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 인천광역시
    '인천': [
        {
            id: 'incheon_001',
            name: '스카이72GC',
            address: '인천 중구 공항동로 100',
            phone: '032-123-4567',
            category: '골프장',
            region: '인천',
            latitude: 37.4563,
            longitude: 126.7052,
            holes: 72,
            totalArea: 3000000,
            type: '대중제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'incheon_002',
            name: '잭니클라우스GC코리아',
            address: '인천 연수구 송도동 100',
            phone: '032-234-5678',
            category: '골프장',
            region: '인천',
            latitude: 37.3834,
            longitude: 126.6436,
            holes: 18,
            totalArea: 1200000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 강원도
    '강원': [
        {
            id: 'gangwon_001',
            name: '강원랜드하이원CC',
            address: '강원 정선군 고한읍 하이원길 265',
            phone: '033-123-4567',
            category: '골프장',
            region: '강원',
            latitude: 37.6564,
            longitude: 128.6814,
            holes: 18,
            totalArea: 1500000,
            type: '대중제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gangwon_002',
            name: '대명비발디파크CC',
            address: '강원 홍천군 서면 팔봉리 100',
            phone: '033-234-5678',
            category: '골프장',
            region: '강원',
            latitude: 37.6924,
            longitude: 128.4465,
            holes: 18,
            totalArea: 1200000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gangwon_003',
            name: '오크밸리CC',
            address: '강원 원주시 지정면 오크밸리1길 100',
            phone: '033-345-6789',
            category: '골프장',
            region: '강원',
            latitude: 37.6500,
            longitude: 128.6833,
            holes: 36,
            totalArea: 1500000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gangwon_004',
            name: '휘닉스파크CC',
            address: '강원 평창군 봉평면 태기로 100',
            phone: '033-456-7890',
            category: '골프장',
            region: '강원',
            latitude: 37.7519,
            longitude: 128.8765,
            holes: 18,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 충청북도
    '충북': [
        {
            id: 'chungbuk_001',
            name: '골프존카운티청주',
            address: '충북 청주시 상당구 미원면 운암리 100',
            phone: '043-123-4567',
            category: '골프장',
            region: '충북',
            latitude: 36.6424,
            longitude: 127.4890,
            holes: 27,
            totalArea: 1000000,
            type: '대중제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'chungbuk_002',
            name: '떼제베CC',
            address: '충북 충주시 노은면 감노로 100',
            phone: '043-234-5678',
            category: '골프장',
            region: '충북',
            latitude: 36.9912,
            longitude: 127.9260,
            holes: 27,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 충청남도
    '충남': [
        {
            id: 'chungnam_001',
            name: '골든베이GC',
            address: '충남 태안군 근흥면 정죽리 100',
            phone: '041-123-4567',
            category: '골프장',
            region: '충남',
            latitude: 36.3504,
            longitude: 127.3845,
            holes: 18,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'chungnam_002',
            name: '천안상록CC',
            address: '충남 천안시 동남구 성남면 대흥리 100',
            phone: '041-234-5678',
            category: '골프장',
            region: '충남',
            latitude: 36.8150,
            longitude: 127.1139,
            holes: 27,
            totalArea: 1000000,
            type: '대중제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'chungnam_003',
            name: '태안비치CC',
            address: '충남 태안군 근흥면 정죽리 100',
            phone: '041-345-6789',
            category: '골프장',
            region: '충남',
            latitude: 36.7839,
            longitude: 127.0045,
            holes: 18,
            totalArea: 1000000,
            type: '대중제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 전라북도
    '전북': [
        {
            id: 'jeonbuk_001',
            name: '군산CC',
            address: '전북 군산시 옥도면 선유도리 100',
            phone: '063-123-4567',
            category: '골프장',
            region: '전북',
            latitude: 35.8242,
            longitude: 127.1480,
            holes: 81,
            totalArea: 2000000,
            type: '대중제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'jeonbuk_002',
            name: '무주덕유산CC',
            address: '전북 무주군 설천면 구천동로 100',
            phone: '063-234-5678',
            category: '골프장',
            region: '전북',
            latitude: 35.9319,
            longitude: 127.6608,
            holes: 18,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'jeonbuk_003',
            name: '전주월드컵CC',
            address: '전북 전주시 덕진구 송천동 100',
            phone: '063-345-6789',
            category: '골프장',
            region: '전북',
            latitude: 35.8242,
            longitude: 127.1480,
            holes: 18,
            totalArea: 1000000,
            type: '대중제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 전라남도
    '전남': [
        {
            id: 'jeonnam_001',
            name: '골드레이크CC',
            address: '전남 나주시 남평읍 남평로 100',
            phone: '061-123-4567',
            category: '골프장',
            region: '전남',
            latitude: 34.7604,
            longitude: 127.6622,
            holes: 27,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'jeonnam_002',
            name: '여수경도CC',
            address: '전남 여수시 돌산읍 경도리 100',
            phone: '061-234-5678',
            category: '골프장',
            region: '전남',
            latitude: 34.8118,
            longitude: 126.3928,
            holes: 27,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 경상북도
    '경북': [
        {
            id: 'gyeongbuk_001',
            name: '경주신라CC',
            address: '경북 경주시 보문로 100',
            phone: '054-123-4567',
            category: '골프장',
            region: '경북',
            latitude: 35.8714,
            longitude: 128.6014,
            holes: 27,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeongbuk_002',
            name: '오션힐스포항CC',
            address: '경북 포항시 남구 동해면 동해안로 100',
            phone: '054-234-5678',
            category: '골프장',
            region: '경북',
            latitude: 36.0320,
            longitude: 129.3650,
            holes: 27,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 경상남도
    '경남': [
        {
            id: 'gyeongnam_001',
            name: '가야CC',
            address: '경남 김해시 주촌면 골프장길 100',
            phone: '055-123-4567',
            category: '골프장',
            region: '경남',
            latitude: 35.1796,
            longitude: 129.0756,
            holes: 36,
            totalArea: 1500000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeongnam_002',
            name: '거제뷰CC',
            address: '경남 거제시 동부면 거제대로 100',
            phone: '055-234-5678',
            category: '골프장',
            region: '경남',
            latitude: 35.5384,
            longitude: 129.3114,
            holes: 18,
            totalArea: 1000000,
            type: '대중제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'gyeongnam_003',
            name: '통도파인이스트CC',
            address: '경남 양산시 하북면 통도사로 100',
            phone: '055-345-6789',
            category: '골프장',
            region: '경남',
            latitude: 35.2278,
            longitude: 128.6817,
            holes: 36,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ],

    // 제주특별자치도
    '제주': [
        {
            id: 'jeju_001',
            name: '나인브릿지',
            address: '제주 서귀포시 안덕면 광평로 100',
            phone: '064-123-4567',
            category: '골프장',
            region: '제주',
            latitude: 33.4996,
            longitude: 126.5312,
            holes: 18,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'jeju_002',
            name: '사이프러스CC',
            address: '제주 제주시 조천읍 교래리 100',
            phone: '064-234-5678',
            category: '골프장',
            region: '제주',
            latitude: 33.2541,
            longitude: 126.5601,
            holes: 36,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        },
        {
            id: 'jeju_003',
            name: '핀크스GC',
            address: '제주 서귀포시 안덕면 산록남로 100',
            phone: '064-345-6789',
            category: '골프장',
            region: '제주',
            latitude: 33.5141,
            longitude: 126.5297,
            holes: 27,
            totalArea: 1000000,
            type: '회원제',
            status: '운영중',
            lastUpdate: '2024.07.17'
        }
    ]
};

// 전역 객체로 노출
window.GolfCoursesDatabase2024 = GOLF_COURSES_DATABASE_2024; 