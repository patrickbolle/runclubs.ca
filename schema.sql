-- Drop existing tables if they exist
DROP TABLE IF EXISTS club_events;
DROP TABLE IF EXISTS clubs;
DROP TABLE IF EXISTS cities;

-- Create cities table
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create clubs table
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  description TEXT,
  instagram TEXT,
  facebook TEXT,
  "cityId" UUID REFERENCES cities(id),
  status VARCHAR(50) DEFAULT 'approved',
  submitter_email VARCHAR(255),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP,
  reviewed_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create club_events table for multiple meeting times
CREATE TABLE club_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL, -- e.g., 'Monday', 'Tuesday', etc.
  start_time TIME NOT NULL,  -- e.g., '18:30'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_clubs_city ON clubs("cityId");
CREATE INDEX idx_clubs_status ON clubs(status);
CREATE INDEX idx_club_events_club ON club_events(club_id);
