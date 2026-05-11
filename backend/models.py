from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    roadmaps = db.relationship('Roadmap', backref='user', lazy=True)

class Roadmap(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Nullable for now (guest mode)
    target_role = db.Column(db.String(100), nullable=False)
    timeline = db.Column(db.Integer, nullable=False)
    roadmap_json = db.Column(db.JSON, nullable=False) # Store the generated roadmap structure
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Roadmap {self.target_role}>'
