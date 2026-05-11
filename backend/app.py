from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Roadmap
from ai_service import generate_ai_roadmap
import os

app = Flask(__name__)
CORS(app)

# Database configuration
base_dir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(base_dir, "roadmap.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/api/generate-roadmap', methods=['POST'])
def generate_roadmap():
    data = request.json
    skills = data.get('currentSkills')
    target_role = data.get('targetRole')
    timeline = data.get('timeline')

    if not all([skills, target_role, timeline]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        # Call the AI service to generate the roadmap
        roadmap_data = generate_ai_roadmap(skills, target_role, timeline)
        
        # Optionally, save it to the database here (ignoring user_id for now as it's not authenticated)
        new_roadmap = Roadmap(
            target_role=target_role,
            timeline=timeline,
            roadmap_json=roadmap_data
        )
        db.session.add(new_roadmap)
        db.session.commit()

        return jsonify({
            'success': True,
            'roadmap_id': new_roadmap.id,
            'data': roadmap_data
        })
    except Exception as e:
        print(f"Error generating roadmap: {e}")
        return jsonify({'error': 'Failed to generate roadmap'}), 500

@app.route('/api/roadmaps/<int:roadmap_id>', methods=['GET'])
def get_roadmap(roadmap_id):
    roadmap = Roadmap.query.get(roadmap_id)
    if not roadmap:
        return jsonify({'error': 'Roadmap not found'}), 404
    
    return jsonify({
        'id': roadmap.id,
        'target_role': roadmap.target_role,
        'timeline': roadmap.timeline,
        'data': roadmap.roadmap_json,
        'created_at': roadmap.created_at
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
