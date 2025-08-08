from flask import Blueprint, request, jsonify
from src.models.database import rounds_collection
from datetime import datetime
from bson import ObjectId
import json

rounds_bp = Blueprint('rounds', __name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

@rounds_bp.route('/rounds', methods=['GET'])
def get_rounds():
    """라운딩 모집 목록 조회"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        status = request.args.get('status')
        
        query = {}
        if status:
            query['status'] = status
        
        skip = (page - 1) * limit
        
        rounds = list(rounds_collection.find(query)
                     .sort('date', 1)
                     .skip(skip)
                     .limit(limit))
        
        total = rounds_collection.count_documents(query)
        
        # ObjectId를 문자열로 변환하고 참여자 수 계산
        for round_item in rounds:
            round_item['_id'] = str(round_item['_id'])
            round_item['participants_count'] = len(round_item.get('participants', []))
        
        return jsonify({
            'rounds': rounds,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rounds_bp.route('/rounds/<round_id>', methods=['GET'])
def get_round(round_id):
    """특정 라운딩 모집 조회"""
    try:
        round_item = rounds_collection.find_one({'_id': ObjectId(round_id)})
        if not round_item:
            return jsonify({'error': '라운딩 모집을 찾을 수 없습니다.'}), 404
        
        round_item['_id'] = str(round_item['_id'])
        round_item['participants_count'] = len(round_item.get('participants', []))
        
        return jsonify(round_item)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rounds_bp.route('/rounds', methods=['POST'])
def create_round():
    """라운딩 모집 등록"""
    try:
        data = request.get_json()
        
        required_fields = ['title', 'golfCourse', 'date', 'time', 'maxParticipants']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field}는 필수입니다.'}), 400
        
        # 날짜 문자열을 datetime 객체로 변환
        try:
            date_obj = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        except:
            return jsonify({'error': '올바른 날짜 형식이 아닙니다.'}), 400
        
        round_item = {
            'title': data['title'],
            'description': data.get('description', ''),
            'host': data.get('host', 'Anonymous'),
            'golfCourse': data['golfCourse'],
            'date': date_obj,
            'time': data['time'],
            'maxParticipants': int(data['maxParticipants']),
            'participants': [data.get('host', 'Anonymous')],
            'status': '모집중',
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        result = rounds_collection.insert_one(round_item)
        round_item['_id'] = str(result.inserted_id)
        round_item['participants_count'] = len(round_item['participants'])
        
        return jsonify(round_item), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rounds_bp.route('/rounds/<round_id>/join', methods=['POST'])
def join_round(round_id):
    """라운딩 참여"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'anonymous')
        
        round_item = rounds_collection.find_one({'_id': ObjectId(round_id)})
        if not round_item:
            return jsonify({'error': '라운딩 모집을 찾을 수 없습니다.'}), 404
        
        participants = round_item.get('participants', [])
        max_participants = round_item.get('maxParticipants', 4)
        
        if user_id in participants:
            return jsonify({'error': '이미 참여 중입니다.'}), 400
        
        if len(participants) >= max_participants:
            return jsonify({'error': '참여 인원이 가득 찼습니다.'}), 400
        
        # 참여자 추가
        result = rounds_collection.update_one(
            {'_id': ObjectId(round_id)},
            {
                '$push': {'participants': user_id},
                '$set': {'updatedAt': datetime.now()}
            }
        )
        
        # 참여 인원이 가득 찬 경우 상태 변경
        if len(participants) + 1 >= max_participants:
            rounds_collection.update_one(
                {'_id': ObjectId(round_id)},
                {'$set': {'status': '모집완료'}}
            )
        
        return jsonify({'message': '참여가 완료되었습니다.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@rounds_bp.route('/rounds/<round_id>/leave', methods=['POST'])
def leave_round(round_id):
    """라운딩 참여 취소"""
    try:
        data = request.get_json()
        user_id = data.get('user_id', 'anonymous')
        
        round_item = rounds_collection.find_one({'_id': ObjectId(round_id)})
        if not round_item:
            return jsonify({'error': '라운딩 모집을 찾을 수 없습니다.'}), 404
        
        participants = round_item.get('participants', [])
        
        if user_id not in participants:
            return jsonify({'error': '참여하지 않은 라운딩입니다.'}), 400
        
        if round_item.get('host') == user_id:
            return jsonify({'error': '주최자는 참여를 취소할 수 없습니다.'}), 400
        
        # 참여자 제거
        rounds_collection.update_one(
            {'_id': ObjectId(round_id)},
            {
                '$pull': {'participants': user_id},
                '$set': {
                    'status': '모집중',
                    'updatedAt': datetime.now()
                }
            }
        )
        
        return jsonify({'message': '참여가 취소되었습니다.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

