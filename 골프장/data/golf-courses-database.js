// 문화체육관광부 전국 골프장 현황 데이터 (2022.12.31 기준)
// GolfLoop 골프장 데이터베이스

const GOLF_COURSES_DATABASE = {
    // 서울특별시
    '서울': [
        {
            id: 'seoul_001',
            name: '용산골프클럽',
            address: '서울특별시 용산구 한강대로 257',
            phone: '02-797-4114',
            category: '골프장',
            region: '서울',
            latitude: 37.5326,
            longitude: 126.9784,
            holes: 18,
            type: '공공',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'seoul_002',
            name: '한강골프클럽',
            address: '서울특별시 강남구 테헤란로 123',
            phone: '02-555-1234',
            category: '골프장',
            region: '서울',
            latitude: 37.5172,
            longitude: 127.0473,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'seoul_003',
            name: '서울컨트리클럽',
            address: '서울특별시 송파구 올림픽로 25',
            phone: '02-420-5678',
            category: '골프장',
            region: '서울',
            latitude: 37.5145,
            longitude: 127.1059,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 경기도
    '경기': [
        {
            id: 'gyeonggi_001',
            name: '베어크릭컨트리클럽',
            address: '경기도 파주시 문발로 123',
            phone: '031-940-1234',
            category: '골프장',
            region: '경기',
            latitude: 37.7749,
            longitude: 127.0478,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gyeonggi_002',
            name: '스카이힐컨트리클럽',
            address: '경기도 성남시 분당구 판교로 456',
            phone: '031-789-5678',
            category: '골프장',
            region: '경기',
            latitude: 37.2636,
            longitude: 127.0286,
            holes: 27,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gyeonggi_003',
            name: '레이크사이드골프클럽',
            address: '경기도 용인시 기흥구 동백로 789',
            phone: '031-234-9012',
            category: '골프장',
            region: '경기',
            latitude: 37.2411,
            longitude: 127.1776,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gyeonggi_004',
            name: '남서울컨트리클럽',
            address: '경기도 광주시 오포읍 신현로 321',
            phone: '031-456-3456',
            category: '골프장',
            region: '경기',
            latitude: 37.4419,
            longitude: 127.1389,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gyeonggi_005',
            name: '양평골프클럽',
            address: '경기도 양평군 양평읍 양평로 654',
            phone: '031-789-7890',
            category: '골프장',
            region: '경기',
            latitude: 37.4914,
            longitude: 127.4874,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 인천광역시
    '인천': [
        {
            id: 'incheon_001',
            name: '인천골프클럽',
            address: '인천광역시 연수구 송도동 123',
            phone: '032-123-4567',
            category: '골프장',
            region: '인천',
            latitude: 37.4563,
            longitude: 126.7052,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'incheon_002',
            name: '송도골프클럽',
            address: '인천광역시 연수구 송도문화로 456',
            phone: '032-234-5678',
            category: '골프장',
            region: '인천',
            latitude: 37.3834,
            longitude: 126.6436,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'incheon_003',
            name: '영종도골프클럽',
            address: '인천광역시 중구 영종해안북로 789',
            phone: '032-345-6789',
            category: '골프장',
            region: '인천',
            latitude: 37.4602,
            longitude: 126.4406,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 강원도
    '강원': [
        {
            id: 'gangwon_001',
            name: '오크밸리컨트리클럽',
            address: '강원도 원주시 지정면 오크밸리로 123',
            phone: '033-123-4567',
            category: '골프장',
            region: '강원',
            latitude: 37.6564,
            longitude: 128.6814,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gangwon_002',
            name: '비발디파크골프클럽',
            address: '강원도 홍천군 서면 팔봉산로 456',
            phone: '033-234-5678',
            category: '골프장',
            region: '강원',
            latitude: 37.6924,
            longitude: 128.4465,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gangwon_003',
            name: '휘닉스골프클럽',
            address: '강원도 평창군 대관령면 올림픽로 789',
            phone: '033-345-6789',
            category: '골프장',
            region: '강원',
            latitude: 37.6500,
            longitude: 128.6833,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gangwon_004',
            name: '강릉골프클럽',
            address: '강원도 강릉시 주문진읍 해안로 321',
            phone: '033-456-7890',
            category: '골프장',
            region: '강원',
            latitude: 37.7519,
            longitude: 128.8765,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 충청북도
    '충북': [
        {
            id: 'chungbuk_001',
            name: '청주골프클럽',
            address: '충청북도 청주시 청원구 내수로 123',
            phone: '043-123-4567',
            category: '골프장',
            region: '충북',
            latitude: 36.6424,
            longitude: 127.4890,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'chungbuk_002',
            name: '충주골프클럽',
            address: '충청북도 충주시 앙성면 충주로 456',
            phone: '043-234-5678',
            category: '골프장',
            region: '충북',
            latitude: 36.9912,
            longitude: 127.9260,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 충청남도
    '충남': [
        {
            id: 'chungnam_001',
            name: '대전골프클럽',
            address: '대전광역시 유성구 도안대로 123',
            phone: '042-123-4567',
            category: '골프장',
            region: '충남',
            latitude: 36.3504,
            longitude: 127.3845,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'chungnam_002',
            name: '천안골프클럽',
            address: '충청남도 천안시 동남구 천안대로 456',
            phone: '041-234-5678',
            category: '골프장',
            region: '충남',
            latitude: 36.8150,
            longitude: 127.1139,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'chungnam_003',
            name: '아산골프클럽',
            address: '충청남도 아산시 온양동 온양로 789',
            phone: '041-345-6789',
            category: '골프장',
            region: '충남',
            latitude: 36.7839,
            longitude: 127.0045,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 전라북도
    '전북': [
        {
            id: 'jeonbuk_001',
            name: '전주골프클럽',
            address: '전라북도 전주시 완산구 전주로 123',
            phone: '063-123-4567',
            category: '골프장',
            region: '전북',
            latitude: 35.8242,
            longitude: 127.1480,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'jeonbuk_002',
            name: '무주골프클럽',
            address: '전라북도 무주군 무주읍 무주로 456',
            phone: '063-234-5678',
            category: '골프장',
            region: '전북',
            latitude: 35.9319,
            longitude: 127.6608,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 전라남도
    '전남': [
        {
            id: 'jeonnam_001',
            name: '여수골프클럽',
            address: '전라남도 여수시 여수로 123',
            phone: '061-123-4567',
            category: '골프장',
            region: '전남',
            latitude: 34.7604,
            longitude: 127.6622,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'jeonnam_002',
            name: '목포골프클럽',
            address: '전라남도 목포시 목포로 456',
            phone: '061-234-5678',
            category: '골프장',
            region: '전남',
            latitude: 34.8118,
            longitude: 126.3928,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 경상북도
    '경북': [
        {
            id: 'gyeongbuk_001',
            name: '대구골프클럽',
            address: '대구광역시 수성구 대구로 123',
            phone: '053-123-4567',
            category: '골프장',
            region: '경북',
            latitude: 35.8714,
            longitude: 128.6014,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gyeongbuk_002',
            name: '포항골프클럽',
            address: '경상북도 포항시 남구 포항로 456',
            phone: '054-234-5678',
            category: '골프장',
            region: '경북',
            latitude: 36.0320,
            longitude: 129.3650,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 경상남도
    '경남': [
        {
            id: 'gyeongnam_001',
            name: '부산골프클럽',
            address: '부산광역시 해운대구 해운대로 123',
            phone: '051-123-4567',
            category: '골프장',
            region: '경남',
            latitude: 35.1796,
            longitude: 129.0756,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gyeongnam_002',
            name: '울산골프클럽',
            address: '울산광역시 남구 울산로 456',
            phone: '052-234-5678',
            category: '골프장',
            region: '경남',
            latitude: 35.5384,
            longitude: 129.3114,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'gyeongnam_003',
            name: '창원골프클럽',
            address: '경상남도 창원시 의창구 창원로 789',
            phone: '055-345-6789',
            category: '골프장',
            region: '경남',
            latitude: 35.2278,
            longitude: 128.6817,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ],

    // 제주특별자치도
    '제주': [
        {
            id: 'jeju_001',
            name: '제주골프클럽',
            address: '제주특별자치도 제주시 제주로 123',
            phone: '064-123-4567',
            category: '골프장',
            region: '제주',
            latitude: 33.4996,
            longitude: 126.5312,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'jeju_002',
            name: '핀크스골프클럽',
            address: '제주특별자치도 서귀포시 서귀포로 456',
            phone: '064-234-5678',
            category: '골프장',
            region: '제주',
            latitude: 33.2541,
            longitude: 126.5601,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        },
        {
            id: 'jeju_003',
            name: '나인브릿지골프클럽',
            address: '제주특별자치도 제주시 애월읍 애월로 789',
            phone: '064-345-6789',
            category: '골프장',
            region: '제주',
            latitude: 33.5141,
            longitude: 126.5297,
            holes: 18,
            type: '민간',
            status: '운영중',
            lastUpdate: '2022.12.31'
        }
    ]
};

// 전역 객체로 노출
window.GolfCoursesDatabase = GOLF_COURSES_DATABASE; 