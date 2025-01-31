# app.py

from flask import Flask
from flask_cors import CORS
import logging
from dotenv import load_dotenv
import os

# Import Blueprints
from routes.admin import admin_bp
from routes.student import student_bp
from routes.auth_routes import auth_bp  # Assuming you have auth routes

# Load environment variables
load_dotenv()

# Configure Logging
logging.basicConfig(level=logging.DEBUG)  # Adjust level as needed
logger = logging.getLogger(__name__)

def create_app():
    """
    Application factory function.
    Returns:
        app (Flask): Configured Flask application.
    """
    app = Flask(__name__)

    # Configure CORS to allow requests from frontend
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    # Load configuration from environment variables
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your_default_secret_key')
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(student_bp, url_prefix='/api/students')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    @app.route('/')
    def home():
        return "Welcome to the Flask Backend!"

    # Ensure upload directories exist
    try:
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'cvs'), exist_ok=True)
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'transcripts'), exist_ok=True)
        os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'photos'), exist_ok=True)
        logger.debug("Upload folders are ready.")
    except Exception as e:
        logger.error(f"Error creating upload folders: {e}")

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)