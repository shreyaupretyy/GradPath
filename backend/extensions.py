# File: extensions.py

from flask_bcrypt import Bcrypt
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
import os
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Bcrypt
bcrypt = Bcrypt()

# Initialize CORS
cors = CORS()

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s %(name)s : %(message)s'
)
logger = logging.getLogger(__name__)

# Database configuration
dbconfig = {
    "user": os.getenv('MYSQL_USER'),
    "password": os.getenv('MYSQL_PASSWORD'),
    "host": os.getenv('MYSQL_HOST', 'localhost'),
    "database": os.getenv('MYSQL_DB'),
    "raise_on_warnings": True
}

try:
    # Create a connection pool
    cnxpool = pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=10,  # Increased pool size for better concurrency
        pool_reset_session=True,
        **dbconfig
    )
    logger.debug("MySQL connection pool created successfully.")
except mysql.connector.Error as err:
    logger.error(f"Error creating MySQL connection pool: {err}")
    cnxpool = None