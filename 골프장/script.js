// 골프 커뮤니티 JavaScript - 모든 기능 구현

// 전역 변수
let currentUser = {
    name: '김골프',
    points: 1250,
    reviews: [],
    bookings: [],
    currentLocation: null
};

let selectedGolfCourse = null;

let reviews = [
    {
        id: 1,
        golfCourse: '오크밸리CC',
        region: '강원',
        hole: '18홀',
        rating: 'excellent',
        content: '코스 컨디션이 정말 좋았습니다. 그린 상태도 완벽하고 캐디분도 친절하셨어요.',
        author: '이골프',
        date: '2024-07-24',
        likes: 12,
        photos: [],
        location: { lat: 37.6564, lng: 128.6814, distance: '5.2km' },
        realtime: true
    },
    {
        id: 2,
        golfCourse: '베어크릭CC',
        region: '경기',
        hole: '18홀',
        rating: 'good',
        content: '전체적으로 만족스러운 라운드였습니다. 다만 대기시간이 조금 길었어요.',
        author: '박골퍼',
        date: '2024-07-23',
        likes: 8,
        photos: [],
        location: { lat: 37.7749, lng: 127.0478, distance: '12.8km' },
        realtime: false
    },
    {
        id: 3,
        golfCourse: '스카이힐CC',
        region: '경기',
        hole: '27홀',
        rating: 'excellent',
        content: '뷰가 정말 환상적이에요! 코스도 잘 관리되어 있고 클럽하우스도 깔끔합니다.',
        author: '최골프',
        date: '2024-07-22',
        likes: 15,
        photos: [],
        location: { lat: 37.2636, lng: 127.0286, distance: '8.7km' },
        realtime: true
    }
];

// 가상의 골프장 데이터 (실제로는 API에서 가져올 데이터)
let nearbyGolfCourses = [
    {
        id: 1,
        name: '스카이힐CC',
        location: { lat: 37.2636, lng: 127.0286 },
        address: '경기도 성남시 분당구',
        distance: null, // 계산될 값
        status: 'excellent',
        lastUpdate: '10분 전',
        weather: 'sunny',
        greenCondition: 'perfect',
        fairwayCondition: 'good',
        waitingTime: 'short'
    },
    {
        id: 2,
        name: '베어크릭CC',
        location: { lat: 37.7749, lng: 127.0478 },
        address: '경기도 파주시',
        distance: null,
        status: 'good',
        lastUpdate: '25분 전',
        weather: 'cloudy',
        greenCondition: 'good',
        fairwayCondition: 'good',
        waitingTime: 'medium'
    },
    {
        id: 3,
        name: '라데나GC',
        location: { lat: 37.4419, lng: 127.1389 },
        address: '경기도 광주시',
        distance: null,
        status: 'normal',
        lastUpdate: '1시간 전',
        weather: 'sunny',
        greenCondition: 'fair',
        fairwayCondition: 'fair',
        waitingTime: 'none'
    },
    {
        id: 4,
        name: '오크밸리CC',
        location: { lat: 37.6564, lng: 128.6814 },
        address: '강원도 원주시',
        distance: null,
        status: 'excellent',
        lastUpdate: '5분 전',
        weather: 'sunny',
        greenCondition: 'perfect',
        fairwayCondition: 'perfect',
        waitingTime: 'none'
    }
];

let golfCourses = {
    '서울': ['용산CC', '한강CC', '서울CC'],
    '경기': ['베어크릭CC', '스카이힐CC', '레이크사이드CC', '남서울CC'],
    '인천': ['인천CC', '송도CC', '영종도CC'],
    '강원': ['오크밸리CC', '비발디파크CC', '휘닉스CC'],
    '충청': ['대전CC', '청주CC', '충남CC'],
    '전라': ['무주CC', '전주CC', '여수CC'],
    '경상': ['부산CC', '대구CC', '울산CC'],
    '제주': ['제주CC', '핀크스CC', '나인브릿지']
};

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeGolfCommunity();
});

// 골프 커뮤니티 초기화
function initializeGolfCommunity() {
    initSmoothScrolling();
    initActiveNavigation();
    initAnimationOnScroll();
    initMobileMenu();
    loadReviews();
    updateUserPoints();
    initFormHandlers();
}

// 부드러운 스크롤링
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 활성 네비게이션 처리
function initActiveNavigation() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 스크롤 시 애니메이션
function initAnimationOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.feature-card, .review-item, .region-card').forEach(el => {
        observer.observe(el);
    });
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-open');
}

// 모바일 메뉴 초기화
function initMobileMenu() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.querySelector('.nav');
            nav.classList.remove('mobile-open');
        });
    });
}

// 후기 탭 전환
function showReviewTab(tab) {
    // 탭 버튼 활성화
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 탭 컨텐츠 전환
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`review-${tab}-tab`).classList.add('active');
    
    if (tab === 'view') {
        loadReviews();
    }
}

// 후기 목록 로드
function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item" data-id="${review.id}">
            <div class="review-header">
                <div class="review-title">${review.golfCourse}</div>
                <div class="review-rating">${getRatingStars(review.rating)}</div>
            </div>
            <div class="review-meta">
                <span>📍 ${review.region}</span>
                <span>⛳ ${review.hole}</span>
                <span>👤 ${review.author}</span>
                <span>📅 ${review.date}</span>
                <span>👍 ${review.likes}</span>
            </div>
            <div class="review-content">${review.content}</div>
            <div class="review-actions">
                <button onclick="likeReview(${review.id})" class="btn-secondary">👍 좋아요</button>
                <button onclick="shareReview(${review.id})" class="btn-secondary">📤 공유</button>
            </div>
        </div>
    `).join('');
}

// 평점 별표 변환
function getRatingStars(rating) {
    const stars = {
        'excellent': '⭐⭐⭐⭐⭐',
        'good': '⭐⭐⭐⭐',
        'normal': '⭐⭐⭐',
        'poor': '⭐⭐'
    };
    return stars[rating] || '⭐⭐⭐';
}

// 후기 작성 폼 핸들러
function initFormHandlers() {
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }
    
    // 사진 미리보기
    const photoInput = document.getElementById('photos');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoPreview);
    }
}

// 후기 제출 처리
function handleReviewSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reviewData = {
        id: reviews.length + 1,
        golfCourse: formData.get('golf-course') || document.getElementById('golf-course').value,
        region: formData.get('region') || document.getElementById('region').value,
        hole: formData.get('hole-number') || document.getElementById('hole-number').value,
        rating: formData.get('condition'),
        content: formData.get('review-content') || document.getElementById('review-content').value,
        author: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        photos: []
    };
    
    // 유효성 검사
    if (!reviewData.golfCourse || !reviewData.region || !reviewData.hole || !reviewData.rating || !reviewData.content) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }
    
    // 후기 추가
    reviews.unshift(reviewData);
    currentUser.reviews.push(reviewData);
    
    // 포인트 적립
    addPoints(100, '후기 작성');
    
    // 사진이 있으면 추가 포인트
    const photos = document.getElementById('photos').files;
    if (photos.length > 0) {
        addPoints(50, '사진 첨부');
    }
    
    // 성공 메시지
    alert('후기가 성공적으로 등록되었습니다! 포인트가 적립되었어요 🎉');
    
    // 폼 초기화
    clearForm();
    
    // 후기 보기 탭으로 전환
    showReviewTab('view');
}

// 사진 미리보기
function handlePhotoPreview(e) {
    const files = e.target.files;
    const preview = document.getElementById('photo-preview');
    
    preview.innerHTML = '';
    
    for (let i = 0; i < Math.min(files.length, 5); i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cssText = 'width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin: 4px;';
            preview.appendChild(img);
        };
        
        reader.readAsDataURL(file);
    }
}

// 폼 초기화
function clearForm() {
    const form = document.getElementById('review-form');
    if (form) {
        form.reset();
        document.getElementById('photo-preview').innerHTML = '';
    }
}

// 포인트 적립
function addPoints(points, reason) {
    currentUser.points += points;
    updateUserPoints();
    
    // 포인트 적립 알림 (간단한 토스트)
    showToast(`+${points}P ${reason}`);
}

// 사용자 포인트 업데이트
function updateUserPoints() {
    const pointElements = document.querySelectorAll('#user-points, #user-points-display');
    pointElements.forEach(el => {
        if (el) el.textContent = currentUser.points.toLocaleString();
    });
}

// 토스트 메시지
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #0066ff;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 후기 좋아요
function likeReview(reviewId) {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
        review.likes++;
        addPoints(10, '좋아요 받기');
        loadReviews();
    }
}

// 후기 공유
function shareReview(reviewId) {
    const review = reviews.find(r => r.id === reviewId);
    if (review) {
        if (navigator.share) {
            navigator.share({
                title: `${review.golfCourse} 후기`,
                text: review.content,
                url: window.location.href
            });
        } else {
            // 폴백: 클립보드 복사
            navigator.clipboard.writeText(`${review.golfCourse} 후기: ${review.content}\n${window.location.href}`);
            showToast('링크가 클립보드에 복사되었습니다!');
        }
    }
}

// 검색 탭 전환
function showSearchTab(tab) {
    document.querySelectorAll('.search-tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('.search-tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tab}-search`).classList.add('active');
}

// 지역별 검색
function searchByRegion(region) {
    const courses = golfCourses[region] || [];
    displaySearchResults(courses.map(course => ({
        name: course,
        region: region,
        type: '골프장',
        rating: (Math.random() * 2 + 3).toFixed(1),
        price: Math.floor(Math.random() * 100000 + 80000).toLocaleString()
    })));
}

// 골프장명 검색
function searchByName() {
    const searchTerm = document.getElementById('golf-course-search').value.toLowerCase();
    if (!searchTerm) {
        alert('골프장명을 입력해주세요.');
        return;
    }
    
    const results = [];
    Object.entries(golfCourses).forEach(([region, courses]) => {
        courses.forEach(course => {
            if (course.toLowerCase().includes(searchTerm)) {
                results.push({
                    name: course,
                    region: region,
                    type: '골프장',
                    rating: (Math.random() * 2 + 3).toFixed(1),
                    price: Math.floor(Math.random() * 100000 + 80000).toLocaleString()
                });
            }
        });
    });
    
    displaySearchResults(results);
}

// 날짜별 검색
function searchByDate() {
    const date = document.getElementById('search-date').value;
    const time = document.getElementById('search-time').value;
    
    if (!date) {
        alert('날짜를 선택해주세요.');
        return;
    }
    
    // 시뮬레이션: 예약 가능한 골프장들
    const availableCourses = [];
    Object.entries(golfCourses).forEach(([region, courses]) => {
        courses.slice(0, Math.floor(Math.random() * 3 + 2)).forEach(course => {
            availableCourses.push({
                name: course,
                region: region,
                type: '예약 가능',
                rating: (Math.random() * 2 + 3).toFixed(1),
                price: Math.floor(Math.random() * 100000 + 80000).toLocaleString(),
                time: time || '예약 가능'
            });
        });
    });
    
    displaySearchResults(availableCourses);
}

// 검색 결과 표시
function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">검색 결과가 없습니다.</p>';
        return;
    }
    
    searchResults.innerHTML = `
        <h3 style="margin-bottom: 20px;">검색 결과 (${results.length}개)</h3>
        <div class="search-results-grid">
            ${results.map(result => `
                <div class="search-result-card">
                    <h4>${result.name}</h4>
                    <div class="result-meta">
                        <span>📍 ${result.region}</span>
                        <span>⭐ ${result.rating}</span>
                        ${result.time ? `<span>⏰ ${result.time}</span>` : ''}
                    </div>
                    <div class="result-price">₩${result.price}</div>
                    <button class="cta-button" onclick="bookGolfCourse('${result.name}', '${result.region}')">예약하기</button>
                </div>
            `).join('')}
        </div>
    `;
}

// 골프장 예약
function bookGolfCourse(courseName, region) {
    if (confirm(`${courseName} (${region})을 예약하시겠습니까?`)) {
        const booking = {
            id: currentUser.bookings.length + 1,
            courseName: courseName,
            region: region,
            date: new Date().toISOString().split('T')[0],
            status: '예약 완료'
        };
        
        currentUser.bookings.push(booking);
        addPoints(200, '예약 완료');
        
        alert('예약이 완료되었습니다! 포인트가 적립되었어요 🎉');
    }
}

// 포인트 내역 표시
function showPointHistory() {
    alert('포인트 적립 내역을 확인할 수 있습니다.\n\n최근 적립 내역:\n• 후기 작성: +100P\n• 사진 첨부: +50P\n• 좋아요 받기: +10P\n• 예약 완료: +200P');
}

// 리워드 상품 교환
function exchangeReward(rewardType) {
    const rewards = {
        'golf-balls': { name: '프리미엄 골프공 세트', price: 500 },
        'gloves': { name: '골프 장갑', price: 800 },
        'tees': { name: '목재 티 세트', price: 300 },
        'coupon': { name: '그린피 할인 쿠폰', price: 1000 }
    };
    
    const reward = rewards[rewardType];
    if (!reward) return;
    
    if (currentUser.points < reward.price) {
        alert(`포인트가 부족합니다. 현재 ${currentUser.points}P, 필요 ${reward.price}P`);
        return;
    }
    
    if (confirm(`${reward.name}을 ${reward.price}P로 교환하시겠습니까?`)) {
        currentUser.points -= reward.price;
        updateUserPoints();
        alert(`${reward.name} 교환이 완료되었습니다! 🎁`);
    }
}

// 예약 채널 열기
function openBookingChannel(channel) {
    const channels = {
        'golfang': { name: '골팡', url: 'https://golfang.com' },
        'kakao': { name: '카카오골프', url: 'https://kakaogolf.com' },
        'membership': { name: '회원제골프', url: '#' }
    };
    
    const channelInfo = channels[channel];
    if (channelInfo) {
        if (channel === 'membership') {
            alert('회원제 골프장 예약은 별도 문의가 필요합니다.\n고객센터: 1588-0000');
        } else {
            if (confirm(`${channelInfo.name} 사이트로 이동하시겠습니까?`)) {
                window.open(channelInfo.url, '_blank');
            }
        }
    }
}

// 마이페이지 섹션 표시
function showMyPageSection(section) {
    const content = document.getElementById('mypage-content');
    
    const sections = {
        'my-reviews': `
            <h3>나의 후기</h3>
            <div class="my-reviews-list">
                ${currentUser.reviews.map(review => `
                    <div class="my-review-item">
                        <h4>${review.golfCourse}</h4>
                        <p>${review.content}</p>
                        <small>${review.date} | 👍 ${review.likes}</small>
                    </div>
                `).join('') || '<p>작성한 후기가 없습니다.</p>'}
            </div>
        `,
        'point-management': `
            <h3>포인트 관리</h3>
            <div class="point-summary">
                <p>현재 포인트: <strong>${currentUser.points.toLocaleString()}P</strong></p>
                <p>누적 적립: <strong>${(currentUser.points + 500).toLocaleString()}P</strong></p>
                <p>사용 가능: <strong>${currentUser.points.toLocaleString()}P</strong></p>
            </div>
        `,
        'bookings': `
            <h3>예약 내역</h3>
            <div class="booking-list">
                ${currentUser.bookings.map(booking => `
                    <div class="booking-item">
                        <h4>${booking.courseName}</h4>
                        <p>📍 ${booking.region} | 📅 ${booking.date}</p>
                        <span class="status">${booking.status}</span>
                    </div>
                `).join('') || '<p>예약 내역이 없습니다.</p>'}
            </div>
        `,
        'settings': `
            <h3>설정</h3>
            <div class="settings-list">
                <div class="setting-item">
                    <label>
                        <input type="checkbox" checked> 후기 알림 받기
                    </label>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox" checked> 포인트 적립 알림
                    </label>
                </div>
                <div class="setting-item">
                    <label>
                        <input type="checkbox"> 마케팅 정보 수신
                    </label>
                </div>
            </div>
        `
    };
    
    content.innerHTML = sections[section] || '<p>준비 중입니다.</p>';
}

// 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const nav = document.querySelector('.nav');
        nav.classList.remove('mobile-open');
    }
});

// 헤더 스크롤 효과
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// 필터 적용
document.addEventListener('change', (e) => {
    if (e.target.matches('#filter-region, #filter-sort, #filter-date')) {
        applyFilters();
    }
});

function applyFilters() {
    const region = document.getElementById('filter-region')?.value;
    const sort = document.getElementById('filter-sort')?.value;
    const date = document.getElementById('filter-date')?.value;
    
    let filteredReviews = [...reviews];
    
    if (region) {
        filteredReviews = filteredReviews.filter(review => review.region === region);
    }
    
    if (date) {
        filteredReviews = filteredReviews.filter(review => review.date === date);
    }
    
    if (sort === 'popular') {
        filteredReviews.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'rating') {
        filteredReviews.sort((a, b) => getRatingValue(b.rating) - getRatingValue(a.rating));
    } else {
        filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    // 임시로 전역 reviews 교체하여 표시
    const originalReviews = [...reviews];
    reviews.splice(0, reviews.length, ...filteredReviews);
    loadReviews();
    reviews.splice(0, reviews.length, ...originalReviews);
}

function getRatingValue(rating) {
    const values = { 'excellent': 5, 'good': 4, 'normal': 3, 'poor': 2 };
    return values[rating] || 0;
}

// ============= 위치 기반 기능들 =============

// 위치 기반 골프장 찾기 (2024년 완전한 데이터베이스 사용)
async function requestLocation() {
    showToast('내 주변 골프장을 찾는 중...');
    
    if (!navigator.geolocation) {
        alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
        return;
    }
    
    // 위치 상태 표시
    const locationStatus = document.getElementById('location-status');
    if (locationStatus) {
        locationStatus.style.display = 'block';
    }
    
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            });
        });
        
        const { latitude, longitude } = position.coords;
        currentUser.currentLocation = { lat: latitude, lng: longitude };
        
        // 위치 정보 업데이트
        updateLocationStatus(latitude, longitude);
        
        // 2024년 완전한 데이터베이스에서 주변 골프장 검색
        if (window.GolfCoursesService2024) {
            const nearbyGolfCourses = window.GolfCoursesService2024.searchNearbyGolfCourses(
                latitude, 
                longitude, 
                10000 // 10km 반경
            );
            
            // 근처 골프장 표시
            showNearbyGolfCourses(nearbyGolfCourses);
            
            showToast(`✅ ${nearbyGolfCourses.length}개 골프장을 찾았습니다!`);
        } else {
            // 서비스가 없으면 기본 더미 데이터 사용
            showNearbyGolfCourses();
            showToast('✅ 근처 골프장을 찾았습니다!');
        }
        
    } catch (error) {
        console.error('위치 오류:', error);
        let errorMessage = '위치를 확인할 수 없습니다.';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = '위치 권한이 필요합니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = '현재 위치를 확인할 수 없습니다.';
                break;
            case error.TIMEOUT:
                errorMessage = '위치 확인에 시간이 오래 걸리고 있습니다.';
                break;
        }
        
        showToast(`⚠️ ${errorMessage}`);
        if (locationStatus) {
            locationStatus.style.display = 'none';
        }
    }
}

// 위치 상태 업데이트
function updateLocationStatus(lat, lng) {
    const locationText = document.getElementById('current-location-text');
    
    // 실제로는 역지오코딩 API를 사용하여 주소를 가져와야 함
    // 여기서는 시뮬레이션
    const mockAddress = getLocationAddress(lat, lng);
    locationText.textContent = `현재 위치: ${mockAddress}`;
}

// 가상의 주소 변환 (실제로는 역지오코딩 API 사용)
function getLocationAddress(lat, lng) {
    const addresses = [
        '서울특별시 강남구',
        '경기도 성남시 분당구',
        '경기도 수원시 영통구',
        '인천광역시 연수구',
        '경기도 고양시 일산동구'
    ];
    return addresses[Math.floor(Math.random() * addresses.length)];
}

// 근처 골프장 표시 (2024년 데이터베이스 형식 지원)
function showNearbyGolfCourses(courses = null) {
    if (!currentUser.currentLocation) return;
    
    // courses가 전달되지 않으면 기본 더미 데이터 사용
    const coursesToDisplay = courses || nearbyGolfCourses;
    
    // 거리 계산 및 정렬
    const coursesWithDistance = coursesToDisplay.map(course => {
        let distance;
        
        if (courses) {
            // 2024년 데이터베이스 형식 (이미 distance가 계산됨)
            distance = course.distance / 1000; // m를 km로 변환
        } else {
            // 기존 더미 데이터 형식
            distance = calculateDistance(
                currentUser.currentLocation.lat,
                currentUser.currentLocation.lng,
                course.location.lat,
                course.location.lng
            );
        }
        
        return { ...course, distance: distance };
    }).sort((a, b) => a.distance - b.distance);
    
    // 근처 골프장 섹션 표시
    const nearbyCourses = document.getElementById('nearby-courses');
    const coursesList = document.getElementById('nearby-courses-list');
    
    if (!nearbyCourses || !coursesList) return;
    
    coursesList.innerHTML = coursesWithDistance.slice(0, 4).map(course => {
        // 2024년 데이터베이스 형식과 기존 형식 모두 지원
        const courseName = course.name || course.golfCourse;
        const courseAddress = course.address || '주소 정보 없음';
        const courseDistance = course.distance ? `${course.distance.toFixed(1)}km` : '거리 계산 중';
        const courseHoles = course.holes ? `${course.holes}홀` : '';
        const courseType = course.type || '';
        
        return `
            <div class="nearby-course-card" onclick="selectGolfCourseFromNearby('${course.id}')">
                <div class="course-header">
                    <div class="course-name">${courseName}</div>
                    <div class="course-distance">${courseDistance}</div>
                </div>
                <div class="course-meta">📍 ${courseAddress}</div>
                <div class="course-meta">🏌️ ${courseHoles} ${courseType}</div>
                ${course.status ? `
                <div class="course-status">
                    <span class="status-badge status-${course.status}">
                        ${getStatusText(course.status)}
                    </span>
                    ${course.weather ? `<span class="status-badge">${getWeatherEmoji(course.weather)} ${getWeatherText(course.weather)}</span>` : ''}
                </div>
                ` : ''}
            </div>
        `;
    }).join('');
    
    nearbyCourses.style.display = 'block';
}

// 거리 계산 (하버사인 공식)
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // 소수점 첫째자리까지
}

// 근처 골프장에서 선택 (2024년 데이터베이스 형식 지원)
function selectGolfCourseFromNearby(courseId) {
    // 2024년 데이터베이스에서 골프장 찾기
    if (window.GolfCoursesService2024) {
        const course = window.GolfCoursesService2024.getGolfCourseById(courseId);
        if (course) {
            // 후기 작성 탭으로 이동
            showReviewTab('write');
            
            // 골프장 선택 처리
            selectGolfCourse(course);
            
            showToast(`${course.name}이 선택되었습니다!`);
            return;
        }
    }
    
    // 기존 더미 데이터에서 골프장 찾기
    const course = nearbyGolfCourses.find(c => c.id == courseId);
    if (course) {
        // 후기 작성 탭으로 이동
        showReviewTab('write');
        
        // 골프장 선택 처리
        selectGolfCourse(course);
        
        showToast(`${course.name}이 선택되었습니다!`);
    }
}

// 빠른 작성 버튼
function showQuickWrite() {
    // 후기 작성 섹션으로 스크롤
    const reviewSection = document.getElementById('golf-reviews');
    reviewSection.scrollIntoView({ behavior: 'smooth' });
    
    // 후기 작성 탭으로 전환
    setTimeout(() => {
        showReviewTab('write');
    }, 500);
}

// 위치 기반 골프장 감지 (후기 작성에서) - 2024년 데이터베이스 사용
async function detectCurrentLocation() {
    if (!navigator.geolocation) {
        alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
        return;
    }
    
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="location-pulse">📍</span> 주변 골프장 찾는 중...';
    btn.disabled = true;
    
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            });
        });
        
        const { latitude, longitude } = position.coords;
        currentUser.currentLocation = { lat: latitude, lng: longitude };
        
        // 2024년 완전한 데이터베이스에서 주변 골프장 검색
        if (window.GolfCoursesService2024) {
            const nearbyGolfCourses = window.GolfCoursesService2024.searchNearbyGolfCourses(
                latitude, 
                longitude, 
                10000 // 10km 반경
            );
            
            // 근처 골프장 추천 표시
            showRecommendedCourses(nearbyGolfCourses);
            
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            showToast(`✅ ${nearbyGolfCourses.length}개 골프장을 찾았습니다!`);
        } else {
            // 서비스가 없으면 기본 더미 데이터 사용
            showRecommendedCourses();
            
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            showToast('✅ 주변 골프장을 찾았습니다!');
        }
        
    } catch (error) {
        console.error('위치 오류:', error);
        showToast('⚠️ 위치를 확인할 수 없습니다. 위치 권한을 허용해주세요.');
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

// 추천 골프장 표시 (후기 작성용) - 2024년 데이터베이스 형식 지원
function showRecommendedCourses(courses = null) {
    if (!currentUser.currentLocation) return;
    
    // courses가 전달되지 않으면 기본 더미 데이터 사용
    const coursesToDisplay = courses || nearbyGolfCourses.map(course => {
        const distance = calculateDistance(
            currentUser.currentLocation.lat,
            currentUser.currentLocation.lng,
            course.location.lat,
            course.location.lng
        );
        return { ...course, distance: distance };
    });
    
    // 거리순 정렬
    const sortedCourses = coursesToDisplay.sort((a, b) => a.distance - b.distance);
    
    const recommendedSection = document.getElementById('recommended-courses');
    const coursesList = document.getElementById('nearby-courses-for-review');
    
    if (!recommendedSection || !coursesList) return;
    
    coursesList.innerHTML = sortedCourses.slice(0, 5).map(course => {
        // 2024년 데이터베이스 형식과 기존 형식 모두 지원
        const courseName = course.name || course.golfCourse;
        const courseAddress = course.address || '주소 정보 없음';
        const courseDistance = course.distance ? `${course.distance.toFixed(1)}km` : '거리 계산 중';
        const courseHoles = course.holes ? `${course.holes}홀` : '';
        const courseType = course.type || '';
        
        return `
            <div class="course-option" onclick="selectGolfCourse(${JSON.stringify(course).replace(/"/g, '&quot;')})">
                <div class="course-header">
                    <div class="course-name">${courseName}</div>
                    <div class="course-distance">${courseDistance}</div>
                </div>
                <div class="course-meta">📍 ${courseAddress}</div>
                <div class="course-meta">🏌️ ${courseHoles} ${courseType}</div>
                ${course.lastUpdate ? `<div class="course-meta">⏱️ ${course.lastUpdate} 최신 정보</div>` : ''}
            </div>
        `;
    }).join('');
    
    recommendedSection.style.display = 'block';
}

// 골프장 선택
function selectGolfCourse(course) {
    selectedGolfCourse = course;
    
    // 선택된 골프장 정보 표시
    const selectedInfo = document.getElementById('selected-course-info');
    const courseName = document.getElementById('selected-course-name');
    const courseLocation = document.getElementById('selected-course-location');
    const courseDistance = document.getElementById('selected-course-distance');
    
    courseName.textContent = course.name;
    courseLocation.textContent = `📍 ${course.address}`;
    courseDistance.textContent = `🚗 ${course.distance}km`;
    
    selectedInfo.style.display = 'block';
    
    // 추천 섹션 숨기기
    document.getElementById('recommended-courses').style.display = 'none';
    
    // 후기 작성 폼 표시
    document.getElementById('location-review-form').style.display = 'block';
}

// 선택된 골프장 변경
function changeSelectedCourse() {
    selectedGolfCourse = null;
    document.getElementById('selected-course-info').style.display = 'none';
    document.getElementById('location-review-form').style.display = 'none';
    document.getElementById('recommended-courses').style.display = 'block';
}

// 수동 검색 토글
function toggleManualSearch() {
    const form = document.getElementById('manual-search-form');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// 골프장 수동 검색
function searchGolfCourses(query) {
    if (!query || query.length < 2) {
        document.getElementById('manual-search-results').innerHTML = '';
        return;
    }
    
    const results = nearbyGolfCourses.filter(course => 
        course.name.toLowerCase().includes(query.toLowerCase()) ||
        course.address.toLowerCase().includes(query.toLowerCase())
    );
    
    document.getElementById('manual-search-results').innerHTML = results.map(course => `
        <div class="course-option" onclick="selectGolfCourse(${JSON.stringify(course).replace(/"/g, '&quot;')})">
            <div class="course-name">${course.name}</div>
            <div class="course-meta">📍 ${course.address}</div>
        </div>
    `).join('');
}

// 빠른 상태 선택
function selectQuickStatus(status) {
    // 모든 칩 비활성화
    document.querySelectorAll('.status-chip').forEach(chip => chip.classList.remove('selected'));
    
    // 선택된 칩 활성화
    event.target.classList.add('selected');
    
    // 상세 정보 자동 설정
    const statusMapping = {
        'excellent': { green: 'perfect', fairway: 'perfect', weather: 'sunny', waiting: 'none' },
        'good': { green: 'good', fairway: 'good', weather: 'sunny', waiting: 'short' },
        'normal': { green: 'fair', fairway: 'fair', weather: 'cloudy', waiting: 'medium' },
        'poor': { green: 'poor', fairway: 'poor', weather: 'rainy', waiting: 'long' }
    };
    
    const mapping = statusMapping[status];
    if (mapping) {
        document.getElementById('green-condition').value = mapping.green;
        document.getElementById('fairway-condition').value = mapping.fairway;
        document.getElementById('weather-condition').value = mapping.weather;
        document.getElementById('waiting-time').value = mapping.waiting;
    }
}

// 실시간 사진 업로드 처리
document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('realtime-photos');
    if (photoInput) {
        photoInput.addEventListener('change', handleRealtimePhotoPreview);
    }
});

function handleRealtimePhotoPreview(e) {
    const files = e.target.files;
    const preview = document.getElementById('realtime-photo-preview');
    
    preview.innerHTML = '';
    
    for (let i = 0; i < Math.min(files.length, 5); i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cssText = 'width: 80px; height: 80px; object-fit: cover; border-radius: 8px; margin: 4px;';
            preview.appendChild(img);
        };
        
        reader.readAsDataURL(file);
    }
}

// 위치 기반 후기 제출
document.addEventListener('DOMContentLoaded', function() {
    const locationForm = document.getElementById('location-review-form');
    if (locationForm) {
        locationForm.addEventListener('submit', handleLocationReviewSubmit);
    }
});

function handleLocationReviewSubmit(e) {
    e.preventDefault();
    
    if (!selectedGolfCourse) {
        alert('골프장을 선택해주세요.');
        return;
    }
    
    // 선택된 상태 확인
    const selectedChip = document.querySelector('.status-chip.selected');
    if (!selectedChip) {
        alert('골프장 상태를 선택해주세요.');
        return;
    }
    
    const reviewData = {
        id: reviews.length + 1,
        golfCourse: selectedGolfCourse.name,
        region: selectedGolfCourse.address.split(' ')[0] + ' ' + selectedGolfCourse.address.split(' ')[1],
        rating: selectedChip.dataset.status,
        greenCondition: document.getElementById('green-condition').value,
        fairwayCondition: document.getElementById('fairway-condition').value,
        weatherCondition: document.getElementById('weather-condition').value,
        waitingTime: document.getElementById('waiting-time').value,
        content: document.getElementById('quick-memo').value || '실시간 골프장 상태 공유',
        author: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        photos: [],
        location: {
            lat: selectedGolfCourse.location.lat,
            lng: selectedGolfCourse.location.lng,
            distance: selectedGolfCourse.distance + 'km'
        },
        realtime: true
    };
    
    // 후기 추가
    reviews.unshift(reviewData);
    currentUser.reviews.push(reviewData);
    
    // 포인트 적립 (상세한 정보 공유 시 더 많이)
    addPoints(150, '소중한 정보 공유');
    
    // 사진이 있으면 추가 포인트
    const photos = document.getElementById('realtime-photos').files;
    if (photos.length > 0) {
        addPoints(50, '사진 첨부');
    }
    
    // 성공 메시지
    showToast('⚡ 후기가 공유되었습니다! 포인트가 적립되었어요 🎉');
    
    // 폼 초기화
    cancelLocationReview();
    
    // 후기 보기 탭으로 전환
    showReviewTab('view');
}

// 위치 기반 후기 작성 취소
function cancelLocationReview() {
    selectedGolfCourse = null;
    document.getElementById('selected-course-info').style.display = 'none';
    document.getElementById('location-review-form').style.display = 'none';
    document.getElementById('recommended-courses').style.display = 'none';
    document.getElementById('location-review-form').reset();
    document.querySelectorAll('.status-chip').forEach(chip => chip.classList.remove('selected'));
    document.getElementById('realtime-photo-preview').innerHTML = '';
}

// 상태 텍스트 변환
function getStatusText(status) {
    const statusMap = {
        'excellent': '최고',
        'good': '좋음',
        'normal': '보통',
        'poor': '나쁨'
    };
    return statusMap[status] || '알 수 없음';
}

// 날씨 이모지
function getWeatherEmoji(weather) {
    const weatherMap = {
        'sunny': '☀️',
        'cloudy': '☁️',
        'rainy': '🌧️',
        'windy': '💨'
    };
    return weatherMap[weather] || '🌤️';
}

// 날씨 텍스트
function getWeatherText(weather) {
    const weatherMap = {
        'sunny': '맑음',
        'cloudy': '흐림',
        'rainy': '비',
        'windy': '바람'
    };
    return weatherMap[weather] || '알 수 없음';
}

// 기존 데이터 업데이트
currentUser.currentLocation = null;
selectedGolfCourse = null;

// 기존 reviews 배열에 위치 정보 추가
reviews.forEach((review, index) => {
    if (!review.location) {
        const course = nearbyGolfCourses.find(c => c.name === review.golfCourse);
        if (course) {
            review.location = {
                lat: course.location.lat,
                lng: course.location.lng,
                distance: (Math.random() * 20 + 2).toFixed(1) + 'km'
            };
            review.realtime = index < 2; // 최신 2개는 실시간으로 설정
        }
    }
});

console.log('🏌️ GolfLoop - Golf Community Platform Loaded');
console.log('현재 사용자:', currentUser.name);
console.log('보유 포인트:', currentUser.points);
console.log('📍 골프장 정보 공유 기능 활성화됨'); 