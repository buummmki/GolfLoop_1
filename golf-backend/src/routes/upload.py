import os
import uuid
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from PIL import Image
import io

upload_bp = Blueprint('upload', __name__)

# 허용되는 이미지 확장자
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# 최대 파일 크기 (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024

def allowed_file(filename):
    """파일 확장자가 허용되는지 확인"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def resize_image(image_data, max_width=1200, max_height=1200, quality=85):
    """이미지 크기 조정 및 최적화"""
    try:
        image = Image.open(io.BytesIO(image_data))
        
        # EXIF 정보에 따른 회전 처리
        if hasattr(image, '_getexif'):
            exif = image._getexif()
            if exif is not None:
                orientation = exif.get(274)
                if orientation == 3:
                    image = image.rotate(180, expand=True)
                elif orientation == 6:
                    image = image.rotate(270, expand=True)
                elif orientation == 8:
                    image = image.rotate(90, expand=True)
        
        # RGB 모드로 변환 (RGBA나 다른 모드일 경우)
        if image.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        # 크기 조정
        image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        # 최적화된 이미지를 바이트로 변환
        output = io.BytesIO()
        image.save(output, format='JPEG', quality=quality, optimize=True)
        return output.getvalue()
    
    except Exception as e:
        print(f"이미지 처리 오류: {e}")
        return image_data

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    """파일 업로드 처리"""
    try:
        # 파일이 요청에 포함되어 있는지 확인
        if 'file' not in request.files:
            return jsonify({'error': '파일이 선택되지 않았습니다.'}), 400
        
        file = request.files['file']
        
        # 파일이 선택되었는지 확인
        if file.filename == '':
            return jsonify({'error': '파일이 선택되지 않았습니다.'}), 400
        
        # 파일 크기 확인
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return jsonify({'error': f'파일 크기가 너무 큽니다. 최대 {MAX_FILE_SIZE // (1024*1024)}MB까지 업로드 가능합니다.'}), 400
        
        # 파일 확장자 확인
        if not allowed_file(file.filename):
            return jsonify({'error': '지원하지 않는 파일 형식입니다. PNG, JPG, JPEG, GIF, WEBP 파일만 업로드 가능합니다.'}), 400
        
        # 업로드 디렉토리 생성
        upload_dir = os.path.join(current_app.root_path, 'static', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # 고유한 파일명 생성
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        
        # 파일 읽기 및 이미지 최적화
        file_data = file.read()
        optimized_data = resize_image(file_data)
        
        # 최적화된 이미지를 JPEG로 저장
        final_filename = f"{uuid.uuid4().hex}.jpg"
        file_path = os.path.join(upload_dir, final_filename)
        
        with open(file_path, 'wb') as f:
            f.write(optimized_data)
        
        # 파일 URL 생성
        file_url = f"/static/uploads/{final_filename}"
        
        # 업로드 정보 반환
        return jsonify({
            'success': True,
            'message': '파일이 성공적으로 업로드되었습니다.',
            'file_url': file_url,
            'filename': final_filename,
            'original_filename': file.filename,
            'file_size': len(optimized_data),
            'upload_time': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"파일 업로드 오류: {e}")
        return jsonify({'error': '파일 업로드 중 오류가 발생했습니다.'}), 500

@upload_bp.route('/upload/multiple', methods=['POST'])
def upload_multiple_files():
    """다중 파일 업로드 처리"""
    try:
        files = request.files.getlist('files')
        
        if not files or len(files) == 0:
            return jsonify({'error': '파일이 선택되지 않았습니다.'}), 400
        
        # 최대 5개 파일까지 허용
        if len(files) > 5:
            return jsonify({'error': '최대 5개 파일까지 업로드 가능합니다.'}), 400
        
        uploaded_files = []
        errors = []
        
        for file in files:
            if file.filename == '':
                continue
                
            try:
                # 파일 크기 확인
                file.seek(0, os.SEEK_END)
                file_size = file.tell()
                file.seek(0)
                
                if file_size > MAX_FILE_SIZE:
                    errors.append(f'{file.filename}: 파일 크기가 너무 큽니다.')
                    continue
                
                # 파일 확장자 확인
                if not allowed_file(file.filename):
                    errors.append(f'{file.filename}: 지원하지 않는 파일 형식입니다.')
                    continue
                
                # 업로드 디렉토리 생성
                upload_dir = os.path.join(current_app.root_path, 'static', 'uploads')
                os.makedirs(upload_dir, exist_ok=True)
                
                # 파일 읽기 및 이미지 최적화
                file_data = file.read()
                optimized_data = resize_image(file_data)
                
                # 최적화된 이미지를 JPEG로 저장
                final_filename = f"{uuid.uuid4().hex}.jpg"
                file_path = os.path.join(upload_dir, final_filename)
                
                with open(file_path, 'wb') as f:
                    f.write(optimized_data)
                
                # 파일 URL 생성
                file_url = f"/static/uploads/{final_filename}"
                
                uploaded_files.append({
                    'file_url': file_url,
                    'filename': final_filename,
                    'original_filename': file.filename,
                    'file_size': len(optimized_data)
                })
                
            except Exception as e:
                errors.append(f'{file.filename}: 업로드 중 오류가 발생했습니다.')
                print(f"파일 업로드 오류 ({file.filename}): {e}")
        
        return jsonify({
            'success': True,
            'message': f'{len(uploaded_files)}개 파일이 성공적으로 업로드되었습니다.',
            'uploaded_files': uploaded_files,
            'errors': errors,
            'upload_time': datetime.now().isoformat()
        }), 200
        
    except Exception as e:
        print(f"다중 파일 업로드 오류: {e}")
        return jsonify({'error': '파일 업로드 중 오류가 발생했습니다.'}), 500

@upload_bp.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    """업로드된 파일 삭제"""
    try:
        # 보안을 위해 파일명 검증
        secure_name = secure_filename(filename)
        if secure_name != filename:
            return jsonify({'error': '잘못된 파일명입니다.'}), 400
        
        file_path = os.path.join(current_app.root_path, 'static', 'uploads', filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({
                'success': True,
                'message': '파일이 성공적으로 삭제되었습니다.'
            }), 200
        else:
            return jsonify({'error': '파일을 찾을 수 없습니다.'}), 404
            
    except Exception as e:
        print(f"파일 삭제 오류: {e}")
        return jsonify({'error': '파일 삭제 중 오류가 발생했습니다.'}), 500

