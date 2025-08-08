from flask import Blueprint, request, jsonify
from src.models.database import market_items_collection
from datetime import datetime
from bson import ObjectId
import json

market_bp = Blueprint('market', __name__)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

@market_bp.route('/market', methods=['GET'])
def get_market_items():
    """중고 장터 상품 목록 조회"""
    try:
        page = int(request.args.get('page', 1))
        limit = int(request.args.get('limit', 10))
        status = request.args.get('status')
        condition = request.args.get('condition')
        min_price = request.args.get('min_price')
        max_price = request.args.get('max_price')
        
        query = {}
        if status:
            query['status'] = status
        if condition:
            query['condition'] = condition
        if min_price or max_price:
            price_query = {}
            if min_price:
                price_query['$gte'] = int(min_price)
            if max_price:
                price_query['$lte'] = int(max_price)
            query['price'] = price_query
        
        skip = (page - 1) * limit
        
        items = list(market_items_collection.find(query)
                    .sort('createdAt', -1)
                    .skip(skip)
                    .limit(limit))
        
        total = market_items_collection.count_documents(query)
        
        # ObjectId를 문자열로 변환
        for item in items:
            item['_id'] = str(item['_id'])
        
        return jsonify({
            'items': items,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/market/<item_id>', methods=['GET'])
def get_market_item(item_id):
    """특정 중고 장터 상품 조회"""
    try:
        item = market_items_collection.find_one({'_id': ObjectId(item_id)})
        if not item:
            return jsonify({'error': '상품을 찾을 수 없습니다.'}), 404
        
        item['_id'] = str(item['_id'])
        
        return jsonify(item)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/market', methods=['POST'])
def create_market_item():
    """중고 장터 상품 등록"""
    try:
        data = request.get_json()
        
        required_fields = ['title', 'description', 'price', 'condition']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field}는 필수입니다.'}), 400
        
        # 가격이 숫자인지 확인
        try:
            price = int(data['price'])
            if price < 0:
                return jsonify({'error': '가격은 0 이상이어야 합니다.'}), 400
        except ValueError:
            return jsonify({'error': '올바른 가격을 입력해주세요.'}), 400
        
        # 상태 검증
        valid_conditions = ['새상품', '최상', '상', '중', '하']
        if data['condition'] not in valid_conditions:
            return jsonify({'error': f'상태는 {", ".join(valid_conditions)} 중 하나여야 합니다.'}), 400
        
        item = {
            'title': data['title'],
            'description': data['description'],
            'seller': data.get('seller', 'Anonymous'),
            'price': price,
            'condition': data['condition'],
            'images': data.get('images', []),
            'status': '판매중',
            'createdAt': datetime.now(),
            'updatedAt': datetime.now()
        }
        
        result = market_items_collection.insert_one(item)
        item['_id'] = str(result.inserted_id)
        
        return jsonify(item), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/market/<item_id>', methods=['PUT'])
def update_market_item(item_id):
    """중고 장터 상품 수정"""
    try:
        data = request.get_json()
        
        item = market_items_collection.find_one({'_id': ObjectId(item_id)})
        if not item:
            return jsonify({'error': '상품을 찾을 수 없습니다.'}), 404
        
        # 수정 가능한 필드들
        update_fields = {}
        if 'title' in data:
            update_fields['title'] = data['title']
        if 'description' in data:
            update_fields['description'] = data['description']
        if 'price' in data:
            try:
                price = int(data['price'])
                if price < 0:
                    return jsonify({'error': '가격은 0 이상이어야 합니다.'}), 400
                update_fields['price'] = price
            except ValueError:
                return jsonify({'error': '올바른 가격을 입력해주세요.'}), 400
        if 'condition' in data:
            valid_conditions = ['새상품', '최상', '상', '중', '하']
            if data['condition'] not in valid_conditions:
                return jsonify({'error': f'상태는 {", ".join(valid_conditions)} 중 하나여야 합니다.'}), 400
            update_fields['condition'] = data['condition']
        if 'status' in data:
            valid_statuses = ['판매중', '거래완료', '예약중']
            if data['status'] not in valid_statuses:
                return jsonify({'error': f'상태는 {", ".join(valid_statuses)} 중 하나여야 합니다.'}), 400
            update_fields['status'] = data['status']
        if 'images' in data:
            update_fields['images'] = data['images']
        
        update_fields['updatedAt'] = datetime.now()
        
        market_items_collection.update_one(
            {'_id': ObjectId(item_id)},
            {'$set': update_fields}
        )
        
        # 업데이트된 상품 반환
        updated_item = market_items_collection.find_one({'_id': ObjectId(item_id)})
        updated_item['_id'] = str(updated_item['_id'])
        
        return jsonify(updated_item)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/market/<item_id>', methods=['DELETE'])
def delete_market_item(item_id):
    """중고 장터 상품 삭제"""
    try:
        result = market_items_collection.delete_one({'_id': ObjectId(item_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': '상품을 찾을 수 없습니다.'}), 404
        
        return jsonify({'message': '상품이 삭제되었습니다.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

