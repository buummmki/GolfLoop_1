from flask import Blueprint, request, jsonify
from src.models.database import golf_courses_collection
from datetime import datetime
from bson import ObjectId
import json

golf_courses_bp = Blueprint('golf_courses', __name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

@golf_courses_bp.route('/golf-courses', methods=['GET'])
def get_golf_courses():
    """골프장 목록 조회"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        location = request.args.get('location')
        search = request.args.get('search')
        
        query = {}
        if location:
            query['location'] = {'$regex': location, '$options': 'i'}
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'description': {'$regex': search, '$options': 'i'}}
            ]
        
        skip = (page - 1) * limit
        
        courses = list(golf_courses_collection.find(query)
                      .sort('name', 1)
                      .skip(skip)
                      .limit(limit))
        
        total = golf_courses_collection.count_documents(query)
        
        # ObjectId를 문자열로 변환하고 평균 평점 계산
        for course in courses:
            course['_id'] = str(course['_id'])
            reviews = course.get('reviews', [])
            if reviews:
                avg_rating = sum(review.get('rating', 0) for review in reviews) / len(reviews)
                course['average_rating'] = round(avg_rating, 1)
                course['reviews_count'] = len(reviews)
            else:
                course['average_rating'] = 0
                course['reviews_count'] = 0
        
        return jsonify({
            'courses': courses,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@golf_courses_bp.route('/golf-courses/<course_id>', methods=['GET'])
def get_golf_course(course_id):
    """특정 골프장 조회"""
    try:
        course = golf_courses_collection.find_one({'_id': ObjectId(course_id)})
        if not course:
            return jsonify({'error': '골프장을 찾을 수 없습니다.'}), 404
        
        course['_id'] = str(course['_id'])
        
        # 평균 평점 계산
        reviews = course.get('reviews', [])
        if reviews:
            avg_rating = sum(review.get('rating', 0) for review in reviews) / len(reviews)
            course['average_rating'] = round(avg_rating, 1)
            course['reviews_count'] = len(reviews)
        else:
            course['average_rating'] = 0
            course['reviews_count'] = 0
        
        return jsonify(course)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@golf_courses_bp.route('/golf-courses', methods=['POST'])
def create_golf_course():
    """골프장 등록"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'location']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field}는 필수입니다.'}), 400
        
        # 중복 골프장 확인
        existing_course = golf_courses_collection.find_one({'name': data['name']})
        if existing_course:
            return jsonify({'error': '이미 등록된 골프장입니다.'}), 400
        
        course = {
            'name': data['name'],
            'location': data['location'],
            'description': data.get('description', ''),
            'contact': data.get('contact', ''),
            'website': data.get('website', ''),
            'reviews': [],
            'images': data.get('images', []),
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        result = golf_courses_collection.insert_one(course)
        course['_id'] = str(result.inserted_id)
        course['average_rating'] = 0
        course['reviews_count'] = 0
        
        return jsonify(course), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@golf_courses_bp.route('/golf-courses/<course_id>/reviews', methods=['POST'])
def add_review(course_id):
    """골프장 리뷰 추가"""
    try:
        data = request.get_json()
        
        required_fields = ['rating', 'comment']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field}는 필수입니다.'}), 400
        
        # 평점 검증
        try:
            rating = int(data['rating'])
            if rating < 1 or rating > 5:
                return jsonify({'error': '평점은 1-5 사이의 값이어야 합니다.'}), 400
        except ValueError:
            return jsonify({'error': '올바른 평점을 입력해주세요.'}), 400
        
        review = {
            '_id': ObjectId(),
            'author': data.get('author', 'Anonymous'),
            'rating': rating,
            'comment': data['comment'],
            'createdAt': datetime.now()
        }
        
        result = golf_courses_collection.update_one(
            {'_id': ObjectId(course_id)},
            {
                '$push': {'reviews': review},
                '$set': {'updatedAt': datetime.now()}
            }
        )
        
        if result.matched_count == 0:
            return jsonify({'error': '골프장을 찾을 수 없습니다.'}), 404
        
        review['_id'] = str(review['_id'])
        return jsonify(review), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@golf_courses_bp.route('/golf-courses/<course_id>/reviews', methods=['GET'])
def get_reviews(course_id):
    """골프장 리뷰 목록 조회"""
    try:
        course = golf_courses_collection.find_one({'_id': ObjectId(course_id)})
        if not course:
            return jsonify({'error': '골프장을 찾을 수 없습니다.'}), 404
        
        reviews = course.get('reviews', [])
        
        # ObjectId를 문자열로 변환
        for review in reviews:
            review['_id'] = str(review['_id'])
        
        # 최신순으로 정렬
        reviews.sort(key=lambda x: x['createdAt'], reverse=True)
        
        return jsonify({
            'reviews': reviews,
            'total': len(reviews)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

