from flask import Flask, render_template, request, jsonify
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

# Cấu hình để sử dụng schema UDCSDL_11
opts = ClientOptions(schema="UDCSDL_11")
supabase: Client = create_client(url, key, options=opts) if url and key else None

@app.route('/')
def index():
    return render_template('index.html')

# --- API LOẠI XE ---
@app.route('/api/loaixe', methods=['GET'])
def get_loaixe():
    if not supabase: return jsonify([]), 500
    try:
        response = supabase.table('LoaiXe').select('*').execute()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/loaixe', methods=['POST'])
def create_loaixe():
    if not supabase: return jsonify({"error": "Config missing"}), 500
    try:
        data = request.json
        # Dữ liệu gửi lên: { "MoTa": "...", "GiaThue": 100000 }
        response = supabase.table('LoaiXe').insert(data).execute()
        return jsonify({"message": "Success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- API XE ---
@app.route('/api/xe', methods=['POST'])
def create_xe():
    if not supabase: return jsonify({"error": "Config missing"}), 500
    try:
        data = request.json
        # Dữ liệu gửi lên: { "bienso": "...", "id_LoaiXe": 1, ... }
        response = supabase.table('Xe').insert(data).execute()
        return jsonify({"message": "Success", "data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # debug=True: Tự động tải lại server khi bạn sửa code Python
    # use_reloader=True: Đảm bảo tính năng theo dõi thay đổi file hoạt động
    app.run(debug=True, port=5000)
