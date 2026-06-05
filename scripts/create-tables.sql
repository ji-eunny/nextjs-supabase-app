-- Supabase 데이터베이스 테이블 생성 스크립트
-- Supabase 대시보드 → SQL 에디터에서 이 전체 내용을 복사-붙여넣기 후 실행

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS public.users (
  id text PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 모임 테이블
CREATE TABLE IF NOT EXISTS public.groups (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  max_members integer NOT NULL,
  owner_id text NOT NULL REFERENCES public.users(id),
  member_count integer DEFAULT 0,
  next_event_title text,
  next_event_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 이벤트 테이블
CREATE TABLE IF NOT EXISTS public.events (
  id text PRIMARY KEY,
  group_id text NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  max_participants integer NOT NULL,
  participant_count integer DEFAULT 0,
  waiting_count integer DEFAULT 0,
  fee integer DEFAULT 0,
  carpool_enabled boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 참가자 테이블
CREATE TABLE IF NOT EXISTS public.participants (
  id text PRIMARY KEY,
  event_id text NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.users(id),
  status text DEFAULT 'confirmed',
  fee_paid boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_events_group_id ON public.events(group_id);
CREATE INDEX IF NOT EXISTS idx_groups_owner_id ON public.groups(owner_id);
CREATE INDEX IF NOT EXISTS idx_participants_event_id ON public.participants(event_id);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON public.participants(user_id);

-- RLS (Row Level Security) 활성화 - 개발 환경에서는 PUBLIC 접근 허용
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (개발 환경: 모든 사용자 접근 가능)
CREATE POLICY "users_public_read" ON public.users FOR SELECT USING (true);
CREATE POLICY "users_public_insert" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_public_update" ON public.users FOR UPDATE USING (true);

CREATE POLICY "groups_public_read" ON public.groups FOR SELECT USING (true);
CREATE POLICY "groups_public_insert" ON public.groups FOR INSERT WITH CHECK (true);
CREATE POLICY "groups_public_update" ON public.groups FOR UPDATE USING (true);
CREATE POLICY "groups_public_delete" ON public.groups FOR DELETE USING (true);

CREATE POLICY "events_public_read" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_public_insert" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "events_public_update" ON public.events FOR UPDATE USING (true);
CREATE POLICY "events_public_delete" ON public.events FOR DELETE USING (true);

CREATE POLICY "participants_public_read" ON public.participants FOR SELECT USING (true);
CREATE POLICY "participants_public_insert" ON public.participants FOR INSERT WITH CHECK (true);
CREATE POLICY "participants_public_update" ON public.participants FOR UPDATE USING (true);
CREATE POLICY "participants_public_delete" ON public.participants FOR DELETE USING (true);
