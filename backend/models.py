from extensions import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    user_type = db.Column(db.String(20), nullable=False)  # 'family' or 'sitter'
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    city = db.Column(db.String(100))
    zip_code = db.Column(db.String(20))
    profile_photo = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Family(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    children_count = db.Column(db.String(10))
    children_ages = db.Column(db.String(200))  # Comma-separated list of age ranges
    sitting_needs = db.Column(db.String(50))
    additional_info = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Sitter(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    experience = db.Column(db.String(20))
    services = db.Column(db.String(200))  # Comma-separated list of services
    age_groups = db.Column(db.String(200))  # Comma-separated list of age groups
    certifications = db.Column(db.String(200))  # Comma-separated list of certifications
    is_verified = db.Column(db.Boolean, default=False)
    verification_requested = db.Column(db.Boolean, default=False)
    hourly_rate = db.Column(db.Float, default=0)
    bio = db.Column(db.Text)
    is_profile_public = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Availability(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sitter_id = db.Column(db.Integer, db.ForeignKey('sitter.id'), nullable=False)
    day = db.Column(db.String(10), nullable=False)  # Monday, Tuesday, etc.
    start_time = db.Column(db.String(10), nullable=False)  # HH:MM format
    end_time = db.Column(db.String(10), nullable=False)  # HH:MM format
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

