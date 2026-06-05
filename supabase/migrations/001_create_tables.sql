-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 모임 테이블
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  max_members INTEGER NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id),
  member_count INTEGER DEFAULT 0,
  next_event_title TEXT,
  next_event_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이벤트 테이블
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  max_participants INTEGER NOT NULL,
  participant_count INTEGER DEFAULT 0,
  waiting_count INTEGER DEFAULT 0,
  fee INTEGER DEFAULT 0,
  carpool_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 참가자 테이블
CREATE TABLE IF NOT EXISTS participants (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  status TEXT DEFAULT 'confirmed',
  fee_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_events_group_id ON events(group_id);
CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON participants(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id);

-- 테이블 접근 권한 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (개발 환경에서는 PUBLIC 접근 허용)
CREATE POLICY "Allow public read" ON users FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update" ON users FOR UPDATE TO public USING (true);

CREATE POLICY "Allow public read" ON groups FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert" ON groups FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update" ON groups FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete" ON groups FOR DELETE TO public USING (true);

CREATE POLICY "Allow public read" ON events FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert" ON events FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update" ON events FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete" ON events FOR DELETE TO public USING (true);

CREATE POLICY "Allow public read" ON participants FOR SELECT TO public USING (true);
CREATE POLICY "Allow public insert" ON participants FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update" ON participants FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete" ON participants FOR DELETE TO public USING (true);
