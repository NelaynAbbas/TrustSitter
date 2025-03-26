from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime, timedelta
import jwt
from extensions import db
from models import User, Family, Sitter, Availability

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///trustsitter.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt_secret_key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Initialize extensions
db.init_app(app)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 409
    
    # Create new user
    hashed_password = generate_password_hash(data['password'], method='sha256')
    
    new_user = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password=hashed_password,
        user_type=data['accountType'],
        phone=data.get('phone', ''),
        address=data.get('address', ''),
        city=data.get('city', ''),
        zip_code=data.get('zipCode', '')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Create specific user type record
    if data['accountType'] == 'family':
        new_family = Family(
            user_id=new_user.id,
            children_count=data.get('childrenCount', ''),
            sitting_needs=data.get('sittingNeeds', '')
        )
        db.session.add(new_family)
    else:  # sitter
        new_sitter = Sitter(
            user_id=new_user.id,
            experience=data.get('experience', ''),
            is_verified=False,  # Default to unverified
            services=','.join(data.get('services', [])),
            hourly_rate=data.get('hourlyRate', 0),
            bio=data.get('bio', ''),
            is_profile_public=False  # Default to private profile
        )
        db.session.add(new_sitter)
    
    db.session.commit()
    
    # Generate token
    token = jwt.encode({
        'user_id': new_user.id,
        'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
    }, app.config['JWT_SECRET_KEY'])
    
    return jsonify({
        'message': 'User registered successfully',
        'token': token,
        'user': {
            'id': new_user.id,
            'firstName': new_user.first_name,
            'lastName': new_user.last_name,
            'email': new_user.email,
            'userType': new_user.user_type,
            'isVerified': False if new_user.user_type == 'sitter' else None
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    # Check if user is a sitter and get verification status
    is_verified = None
    if user.user_type == 'sitter':
        sitter = Sitter.query.filter_by(user_id=user.id).first()
        is_verified = sitter.is_verified if sitter else False
    
    # Generate token
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
    }, app.config['JWT_SECRET_KEY'])
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'email': user.email,
            'userType': user.user_type,
            'isVerified': is_verified
        }
    }), 200

@app.route('/api/profile', methods=['GET'])
def get_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
    
    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        profile_data = {
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'email': user.email,
            'phone': user.phone,
            'address': user.address,
            'city': user.city,
            'zipCode': user.zip_code,
            'userType': user.user_type,
        }
        
        # Add user type specific data
        if user.user_type == 'family':
            family = Family.query.filter_by(user_id=user.id).first()
            if family:
                profile_data.update({
                    'childrenCount': family.children_count,
                    'sittingNeeds': family.sitting_needs
                })
        else:  # sitter
            sitter = Sitter.query.filter_by(user_id=user.id).first()
            if sitter:
                profile_data.update({
                    'experience': sitter.experience,
                    'isVerified': sitter.is_verified,
                    'services': sitter.services.split(',') if sitter.services else [],
                    'hourlyRate': sitter.hourly_rate,
                    'bio': sitter.bio,
                    'isProfilePublic': sitter.is_profile_public,
                    'verificationRequested': sitter.verification_requested
                })
                
                # Get availability
                availabilities = Availability.query.filter_by(sitter_id=sitter.id).all()
                profile_data['availability'] = [
                    {
                        'id': a.id,
                        'day': a.day,
                        'startTime': a.start_time,
                        'endTime': a.end_time
                    } for a in availabilities
                ]
        
        return jsonify(profile_data), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
    
    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        update_data = request.get_json()
        
        # Update user data
        user.first_name = update_data.get('firstName', user.first_name)
        user.last_name = update_data.get('lastName', user.last_name)
        user.phone = update_data.get('phone', user.phone)
        user.address = update_data.get('address', user.address)
        user.city = update_data.get('city', user.city)
        user.zip_code = update_data.get('zipCode', user.zip_code)
        
        # Update user type specific data
        if user.user_type == 'family':
            family = Family.query.filter_by(user_id=user.id).first()
            if family:
                family.children_count = update_data.get('childrenCount', family.children_count)
                family.sitting_needs = update_data.get('sittingNeeds', family.sitting_needs)
        else:  # sitter
            sitter = Sitter.query.filter_by(user_id=user.id).first()
            if sitter:
                sitter.experience = update_data.get('experience', sitter.experience)
                if 'services' in update_data:
                    sitter.services = ','.join(update_data['services'])
                sitter.hourly_rate = update_data.get('hourlyRate', sitter.hourly_rate)
                sitter.bio = update_data.get('bio', sitter.bio)
                sitter.is_profile_public = update_data.get('isProfilePublic', sitter.is_profile_public)
        
        db.session.commit()
        
        return jsonify({'message': 'Profile updated successfully'}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/api/sitter/request-verification', methods=['POST'])
def request_verification():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
    
    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        
        user = User.query.get(user_id)
        if not user or user.user_type != 'sitter':
            return jsonify({'message': 'User not found or not a sitter'}), 404
        
        sitter = Sitter.query.filter_by(user_id=user.id).first()
        if not sitter:
            return jsonify({'message': 'Sitter profile not found'}), 404
        
        if sitter.is_verified:
            return jsonify({'message': 'Sitter is already verified'}), 400
        
        # In a real application, you would store verification request details
        # For now, we'll just mark the sitter as pending verification
        sitter.verification_requested = True
        db.session.commit()
        
        return jsonify({'message': 'Verification request submitted successfully'}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/api/sitter/availability', methods=['POST'])
def add_availability():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
    
    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        
        user = User.query.get(user_id)
        if not user or user.user_type != 'sitter':
            return jsonify({'message': 'User not found or not a sitter'}), 404
        
        sitter = Sitter.query.filter_by(user_id=user.id).first()
        if not sitter:
            return jsonify({'message': 'Sitter profile not found'}), 404
        
        availability_data = request.get_json()
        
        new_availability = Availability(
            sitter_id=sitter.id,
            day=availability_data['day'],
            start_time=availability_data['startTime'],
            end_time=availability_data['endTime']
        )
        
        db.session.add(new_availability)
        db.session.commit()
        
        return jsonify({
            'message': 'Availability added successfully',
            'availability': {
                'id': new_availability.id,
                'day': new_availability.day,
                'startTime': new_availability.start_time,
                'endTime': new_availability.end_time
            }
        }), 201
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/api/sitter/availability/<int:availability_id>', methods=['DELETE'])
def delete_availability(availability_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
    
    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        
        user = User.query.get(user_id)
        if not user or user.user_type != 'sitter':
            return jsonify({'message': 'User not found or not a sitter'}), 404
        
        sitter = Sitter.query.filter_by(user_id=user.id).first()
        if not sitter:
            return jsonify({'message': 'Sitter profile not found'}), 404
        
        availability = Availability.query.get(availability_id)
        if not availability or availability.sitter_id != sitter.id:
            return jsonify({'message': 'Availability not found or not authorized'}), 404
        
        db.session.delete(availability)
        db.session.commit()
        
        return jsonify({'message': 'Availability deleted successfully'}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/api/sitter/publish-profile', methods=['POST'])
def publish_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
    
    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        
        user = User.query.get(user_id)
        if not user or user.user_type != 'sitter':
            return jsonify({'message': 'User not found or not a sitter'}), 404
        
        sitter = Sitter.query.filter_by(user_id=user.id).first()
        if not sitter:
            return jsonify({'message': 'Sitter profile not found'}), 404
        
        # Check if profile is complete enough to publish
        if not sitter.services or not sitter.experience or not sitter.hourly_rate:
            return jsonify({'message': 'Profile is incomplete. Please add services, experience, and hourly rate.'}), 400
        
        # Check if there's at least one availability
        availabilities = Availability.query.filter_by(sitter_id=sitter.id).first()
        if not availabilities:
            return jsonify({'message': 'Please add at least one availability before publishing your profile.'}), 400
        
        sitter.is_profile_public = True
        db.session.commit()
        
        return jsonify({'message': 'Profile published successfully'}), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

@app.route('/api/sitters', methods=['GET'])
def get_sitters():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing'}), 401
    
    try:
        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Get query parameters for filtering
        service = request.args.get('service')
        city = request.args.get('city')
        is_verified = request.args.get('verified')
        day = request.args.get('day')
        
        # Base query - only get public profiles
        query = db.session.query(Sitter, User).join(User, Sitter.user_id == User.id).filter(Sitter.is_profile_public == True)
        
        # Apply filters
        if service:
            query = query.filter(Sitter.services.like(f'%{service}%'))
        
        if city:
            query = query.filter(User.city == city)
        
        if is_verified and is_verified.lower() == 'true':
            query = query.filter(Sitter.is_verified == True)
        
        if day:
            query = query.join(Availability, Sitter.id == Availability.sitter_id).filter(Availability.day == day)
        
        results = query.all()
        
        sitters_data = []
        for sitter, user in results:
            # Get availability for this sitter
            availabilities = Availability.query.filter_by(sitter_id=sitter.id).all()
            availability_data = [
                {
                    'id': a.id,
                    'day': a.day,
                    'startTime': a.start_time,
                    'endTime': a.end_time
                } for a in availabilities
            ]
            
            sitters_data.append({
                'id': sitter.id,
                'userId': user.id,
                'firstName': user.first_name,
                'lastName': user.last_name,
                'city': user.city,
                'isVerified': sitter.is_verified,
                'services': sitter.services.split(',') if sitter.services else [],
                'experience': sitter.experience,
                'hourlyRate': sitter.hourly_rate,
                'bio': sitter.bio,
                'availability': availability_data
            })
        
        return jsonify(sitters_data), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token'}), 401

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

