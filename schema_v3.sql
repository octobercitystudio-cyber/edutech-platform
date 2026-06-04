-- تحديثات لوحة تحكم المعلم V3

-- 1. جدول الواجبات والتكليفات (Assignments)
create table if not exists public.assignments (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  instructor_name text not null,
  title text not null,
  description text,
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assignments enable row level security;
create policy "Anyone can view assignments" on assignments for select using (true);
create policy "Instructors can manage assignments" on assignments for all using (true);

-- 2. جدول الفصول المباشرة (Live Sessions)
create table if not exists public.live_sessions (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  instructor_name text not null,
  title text not null,
  meeting_link text not null,
  start_time timestamp with time zone not null,
  duration_minutes integer default 60,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.live_sessions enable row level security;
create policy "Anyone can view live sessions" on live_sessions for select using (true);
create policy "Instructors can manage live sessions" on live_sessions for all using (true);

-- 3. جدول الإعلانات (Announcements)
create table if not exists public.announcements (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  instructor_name text not null,
  title text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.announcements enable row level security;
create policy "Anyone can view announcements" on announcements for select using (true);
create policy "Instructors can manage announcements" on announcements for all using (true);
