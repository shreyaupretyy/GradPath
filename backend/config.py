import os

class Config:
    # Secret key for session management. Use a strong, unpredictable value in production.
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key_here'

    # MySQL configurations
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'root'
    MYSQL_DB = 'gradpath'
    MYSQL_CURSORCLASS = 'DictCursor'  # To return results as dictionaries

    # Upload configurations
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # Max upload size: 16MB