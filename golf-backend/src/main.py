import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db
from src.routes.user import user_bp
from src.routes.posts import posts_bp
from src.routes.rounds import rounds_bp
from src.routes.market import market_bp
from src.routes.golf_courses import golf_courses_bp
from src.routes.upload import upload_bp
from src.models.database import init_sample_data

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# 파일 업로드 설정
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB 최대 업로드 크기

# CORS 설정
CORS(app, origins="*")

# 블루프린트 등록
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(posts_bp, url_prefix='/api')
app.register_blueprint(rounds_bp, url_prefix='/api')
app.register_blueprint(market_bp, url_prefix='/api')
app.register_blueprint(golf_courses_bp, url_prefix='/api')
app.register_blueprint(upload_bp, url_prefix='/api')

# SQLite 데이터베이스 설정 (사용자 관리용)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()

# MongoDB 샘플 데이터 초기화
init_sample_data()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    # uploads 폴더의 파일들은 직접 서빙
    if path.startswith('static/uploads/'):
        filename = path.replace('static/uploads/', '')
        uploads_dir = os.path.join(static_folder_path, 'uploads')
        if os.path.exists(os.path.join(uploads_dir, filename)):
            return send_from_directory(uploads_dir, filename)

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
