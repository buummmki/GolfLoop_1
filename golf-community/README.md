# GolfLoop - 골프 커뮤니티

골프를 사랑하는 사람들의 특별한 공간입니다. 라운딩 파트너를 찾고, 골프장 정보를 공유하며, 골프 장비를 거래하는 모든 것이 가능한 골프 커뮤니티입니다.

## 주요 기능

- **게시판/포럼**: 자유로운 글쓰기, 댓글, 카테고리 분류 (라운딩 후기, 장비 리뷰, 레슨 공유 등)
- **라운딩 모집**: 함께 라운딩할 인원 모집, 날짜/장소/인원 설정, 참여 신청 및 관리
- **골프장 정보**: 국내외 골프장 정보 (위치, 코스 정보, 이용 요금, 후기 등)
- **중고 장터**: 골프 장비 중고 거래 게시판
- **이미지 업로드**: 게시글 및 상품 등록 시 이미지 첨부 기능

## 기술 스택

### 프론트엔드
- **React 18** - 사용자 인터페이스 구축
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Tailwind CSS** - 유틸리티 기반 CSS 프레임워크
- **Lucide React** - 아이콘 라이브러리
- **shadcn/ui** - 재사용 가능한 UI 컴포넌트

### 백엔드
- **Flask** - Python 웹 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Pillow** - 이미지 처리 라이브러리
- **Flask-CORS** - CORS 지원

## 로컬 개발 환경 설정

### 프론트엔드 설정

```bash
cd golf-community
npm install
npm run dev
```

### 백엔드 설정

```bash
cd golf-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python src/main.py
```

### MongoDB 설치 및 실행

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 배포

### Vercel 배포 (프론트엔드)

1. GitHub 저장소를 Vercel에 연결
2. 환경변수 설정:
   - `VITE_API_BASE_URL`: 백엔드 API 서버 URL
3. 자동 배포 완료

### 백엔드 배포 옵션

1. **Heroku**: Flask 앱을 Heroku에 배포
2. **Railway**: 간단한 Flask 앱 배포
3. **DigitalOcean**: VPS에 직접 배포
4. **AWS EC2**: 클라우드 서버에 배포

## 환경변수

### 프론트엔드 (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### 백엔드
```
MONGODB_URI=mongodb://localhost:27017/golfloop
SECRET_KEY=your-secret-key
```

## API 엔드포인트

### 게시글
- `GET /api/posts` - 게시글 목록 조회
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/:id` - 특정 게시글 조회

### 라운딩 모집
- `GET /api/rounds` - 라운딩 모집 목록 조회
- `POST /api/rounds` - 라운딩 모집 등록
- `POST /api/rounds/:id/join` - 라운딩 참여

### 중고 장터
- `GET /api/market` - 상품 목록 조회
- `POST /api/market` - 상품 등록
- `GET /api/market/:id` - 특정 상품 조회

### 이미지 업로드
- `POST /api/upload` - 단일 파일 업로드
- `POST /api/upload/multiple` - 다중 파일 업로드
- `DELETE /api/delete/:filename` - 파일 삭제

## 프로젝트 구조

```
GolfLoop_1/
├── golf-community/          # React 프론트엔드
│   ├── src/
│   │   ├── components/      # React 컴포넌트
│   │   ├── hooks/          # 커스텀 훅
│   │   └── lib/            # 유틸리티 함수
│   ├── public/             # 정적 파일
│   └── dist/               # 빌드 결과물
└── golf-backend/           # Flask 백엔드
    ├── src/
    │   ├── routes/         # API 라우트
    │   ├── models/         # 데이터 모델
    │   └── static/         # 정적 파일 (업로드된 이미지)
    └── venv/               # Python 가상환경
```

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 연락처

프로젝트 관련 문의: contact@golfloop.com

프로젝트 링크: [https://github.com/buummmki/GolfLoop_1](https://github.com/buummmki/GolfLoop_1)

