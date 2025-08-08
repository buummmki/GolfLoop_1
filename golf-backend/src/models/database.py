from pymongo import MongoClient
from datetime import datetime
import os

# MongoDB 연결 설정 (로컬 MongoDB 사용)
client = MongoClient('mongodb://localhost:27017/')
db = client['golf_community']

# 컬렉션 정의
users_collection = db['users']
posts_collection = db['posts']
rounds_collection = db['rounds']
golf_courses_collection = db['golf_courses']
market_items_collection = db['market_items']
chats_collection = db['chats']

def init_sample_data():
    """샘플 데이터 초기화"""
    
    # 샘플 골프장 데이터
    if golf_courses_collection.count_documents({}) == 0:
        sample_courses = [
            {
                "name": "레이크사이드 컨트리클럽",
                "location": "경기도 용인시",
                "description": "아름다운 호수 전망과 함께하는 18홀 골프장",
                "contact": "031-123-4567",
                "website": "http://lakeside.golf",
                "reviews": [],
                "images": [],
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "name": "스카이힐 골프클럽",
                "location": "경기도 남양주시",
                "description": "산 정상에서 즐기는 프리미엄 골프 경험",
                "contact": "031-987-6543",
                "website": "http://skyhill.golf",
                "reviews": [],
                "images": [],
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
        ]
        golf_courses_collection.insert_many(sample_courses)
    
    # 샘플 라운딩 모집 데이터
    if rounds_collection.count_documents({}) == 0:
        sample_rounds = [
            {
                "title": "주말 라운딩 모집 (3명)",
                "description": "즐거운 주말 라운딩 함께해요!",
                "host": "sample_user_1",
                "golfCourse": "레이크사이드 컨트리클럽",
                "date": datetime(2025, 8, 10),
                "time": "오전 7:00",
                "maxParticipants": 4,
                "participants": ["sample_user_1"],
                "status": "모집중",
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "title": "평일 오후 라운딩",
                "description": "평일 오후 여유로운 라운딩",
                "host": "sample_user_2",
                "golfCourse": "스카이힐 골프클럽",
                "date": datetime(2025, 8, 12),
                "time": "오후 1:30",
                "maxParticipants": 4,
                "participants": ["sample_user_2", "sample_user_3"],
                "status": "모집중",
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
        ]
        rounds_collection.insert_many(sample_rounds)
    
    # 샘플 게시글 데이터
    if posts_collection.count_documents({}) == 0:
        sample_posts = [
            {
                "title": "초보자를 위한 드라이버 선택 가이드",
                "content": "드라이버 선택 시 고려해야 할 요소들을 정리해보았습니다...",
                "author": "골프마스터",
                "category": "장비 리뷰",
                "comments": [],
                "likes": [],
                "views": 24,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "title": "남양주 골프장 라운딩 후기",
                "content": "어제 남양주 골프장에서 라운딩을 다녀왔습니다...",
                "author": "라운딩킹",
                "category": "라운딩 후기",
                "comments": [],
                "likes": [],
                "views": 15,
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
        ]
        posts_collection.insert_many(sample_posts)
    
    # 샘플 중고 장터 데이터
    if market_items_collection.count_documents({}) == 0:
        sample_items = [
            {
                "title": "타이틀리스트 드라이버 (거의 새것)",
                "description": "거의 사용하지 않은 타이틀리스트 드라이버 판매합니다.",
                "seller": "골프러버",
                "price": 350000,
                "condition": "최상",
                "images": [],
                "status": "판매중",
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            },
            {
                "title": "캘러웨이 아이언 세트",
                "description": "캘러웨이 아이언 세트 판매합니다. 상태 좋습니다.",
                "seller": "프로골퍼",
                "price": 800000,
                "condition": "상",
                "images": [],
                "status": "판매중",
                "createdAt": datetime.now(),
                "updatedAt": datetime.now()
            }
        ]
        market_items_collection.insert_many(sample_items)

def get_db():
    """데이터베이스 인스턴스 반환"""
    return db

