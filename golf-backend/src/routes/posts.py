from flask import Blueprint, request, jsonify
from src.models.database import posts_collection
from datetime import datetime
from bson import ObjectId
import json

posts_bp = Blueprint('posts', __name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

@posts_bp.route('/posts', methods=['GET'])
def get_posts():
    """게시글 목록 조회"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        category = request.args.get('category')
        
        query = {}
        if category:
            query['category'] = category
        
        skip = (page - 1) * limit
        
        posts = list(posts_collection.find(query)
                    .sort('createdAt', -1)
                    .skip(skip)
                    .limit(limit))
        
        total = posts_collection.count_documents(query)
        
        # ObjectId를 문자열로 변환
        for post in posts:
            post['_id'] = str(post['_id'])
            post['likes_count'] = len(post.get('likes', []))
            post['comments_count'] = len(post.get('comments', []))
        
        return jsonify({
            'posts': posts,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    """특정 게시글 조회"""
    try:
        post = posts_collection.find_one({'_id': ObjectId(post_id)})
        if not post:
            return jsonify({'error': '게시글을 찾을 수 없습니다.'}), 404
        
        # 조회수 증가
        posts_collection.update_one(
            {'_id': ObjectId(post_id)},
            {'$inc': {'views': 1}}
        )
        
        post['_id'] = str(post['_id'])
        post['likes_count'] = len(post.get('likes', []))
        post['comments_count'] = len(post.get('comments', []))
        
        return jsonify(post)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/posts', methods=['POST'])
def create_post():
    """게시글 작성"""
    try:
        data = request.get_json()
        
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': '제목과 내용은 필수입니다.'}), 400
        
        post = {
            'title': data['title'],
            'content': data['content'],
            'author': data.get('author', 'Anonymous'),
            'category': data.get('category', '자유게시판'),
            'comments': [],
            'likes': [],
            'views': 0,
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        result = posts_collection.insert_one(post)
        post['_id'] = str(result.inserted_id)
        
        return jsonify(post), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/posts/<post_id>/comments', methods=['POST'])
def add_comment(post_id):
    """댓글 추가"""
    try:
        data = request.get_json()
        
        if not data.get('content'):
            return jsonify({'error': '댓글 내용은 필수입니다.'}), 400
        
        comment = {
            '_id': ObjectId(),
            'author': data.get('author', 'Anonymous'),
            'content': data['content'],
            'createdAt': datetime.now()
        }
        
        result = posts_collection.update_one(
            {'_id': ObjectId(post_id)},
            {'$push': {'comments': comment}}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': '게시글을 찾을 수 없습니다.'}), 404
        
        comment['_id'] = str(comment['_id'])
        return jsonify(comment), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@posts_bp.route('/posts/<post_id>/like', methods=['POST'])
def toggle_like(post_id):
    """좋아요 토글"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'anonymous')
        
        post = posts_collection.find_one({'_id': ObjectId(post_id)})
        if not post:
            return jsonify({'error': '게시글을 찾을 수 없습니다.'}), 404
        
        likes = post.get('likes', [])
        
        if user_id in likes:
            # 좋아요 취소
            posts_collection.update_one(
                {'_id': ObjectId(post_id)},
                {'$pull': {'likes': user_id}}
            )
            liked = False
        else:
            # 좋아요 추가
            posts_collection.update_one(
                {'_id': ObjectId(post_id)},
                {'$push': {'likes': user_id}}
            )
            liked = True
        
        # 업데이트된 좋아요 수 반환
        updated_post = posts_collection.find_one({'_id': ObjectId(post_id)})
        likes_count = len(updated_post.get('likes', []))
        
        return jsonify({
            'liked': liked,
            'likes_count': likes_count
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

