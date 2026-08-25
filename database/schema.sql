CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  vision TEXT NOT NULL,
  mission TEXT NOT NULL,
  featured_program TEXT NOT NULL,
  image TEXT NOT NULL,
  occupation VARCHAR(255) NOT NULL,
  cohort VARCHAR(4) NOT NULL,
  votes INTEGER NOT NULL DEFAULT 0 CHECK (votes >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cohort VARCHAR(4) NOT NULL,
  candidate_id INTEGER REFERENCES candidates(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'Mahasiswa'
    CHECK (role IN ('Mahasiswa', 'Admin', 'Super Administrator')),
  voter_id INTEGER UNIQUE REFERENCES voters(id) ON DELETE SET NULL,
  has_voted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_voters_candidate_id ON voters(candidate_id);
CREATE INDEX IF NOT EXISTS idx_voters_name ON voters(name);
CREATE INDEX IF NOT EXISTS idx_voters_cohort ON voters(cohort);
CREATE INDEX IF NOT EXISTS idx_users_voter_id ON users(voter_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_candidates_name ON candidates(name);
