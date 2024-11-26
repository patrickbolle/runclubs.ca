DROP TABLE IF EXISTS City;
DROP TABLE IF EXISTS RunClub;

CREATE TABLE City (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  description TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

CREATE TABLE RunClub (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  day TEXT,
  time TEXT,
  location TEXT,
  description TEXT,
  instagram TEXT,
  facebook TEXT,
  cityId TEXT,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (cityId) REFERENCES City(id)
);

CREATE INDEX idx_runclub_city ON RunClub(cityId); 
