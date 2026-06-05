-- 모임 테이블
create table public.groups (
  id uuid default gen_random_uuid() primary key,
  name varchar(50) not null,
  description varchar(200) not null,
  max_members integer not null default 20,
  owner_id uuid not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint groups_owner_id_fkey foreign key (owner_id) references auth.users (id) on delete cascade
);

-- 모임 멤버 테이블
create table public.group_members (
  id uuid default gen_random_uuid() primary key,
  group_id uuid not null,
  user_id uuid not null,
  role varchar(20) default 'member' not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint group_members_group_id_fkey foreign key (group_id) references public.groups (id) on delete cascade,
  constraint group_members_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade,
  constraint group_members_unique unique (group_id, user_id)
);

-- RLS (Row Level Security) 정책
alter table public.groups enable row level security;
alter table public.group_members enable row level security;

-- groups 테이블 RLS 정책
create policy "사용자는 자신의 모임을 조회할 수 있습니다"
  on public.groups
  for select
  using (true);

create policy "사용자는 소유한 모임을 수정할 수 있습니다"
  on public.groups
  for update
  using (owner_id = auth.uid());

create policy "사용자는 소유한 모임을 삭제할 수 있습니다"
  on public.groups
  for delete
  using (owner_id = auth.uid());

create policy "인증된 사용자는 모임을 생성할 수 있습니다"
  on public.groups
  for insert
  with check (owner_id = auth.uid());

-- group_members 테이블 RLS 정책
create policy "모임 멤버는 해당 모임의 멤버 목록을 조회할 수 있습니다"
  on public.group_members
  for select
  using (true);

create policy "모임 소유자는 멤버를 추가할 수 있습니다"
  on public.group_members
  for insert
  with check (
    exists (
      select 1 from public.groups
      where id = group_id and owner_id = auth.uid()
    )
  );

create policy "모임 소유자는 멤버를 제거할 수 있습니다"
  on public.group_members
  for delete
  using (
    exists (
      select 1 from public.groups
      where id = group_id and owner_id = auth.uid()
    )
  );

-- 인덱스 생성 (성능 개선)
create index groups_owner_id_idx on public.groups (owner_id);
create index group_members_group_id_idx on public.group_members (group_id);
create index group_members_user_id_idx on public.group_members (user_id);
