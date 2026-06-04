-- تحديثات نظام التتبع V5

-- 1. جدول تتبع الفيديوهات (Video Progress)
create table if not exists public.video_progress (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  watched_seconds integer default 0,
  is_completed boolean default false,
  last_watched_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (student_id, lesson_id)
);

alter table public.video_progress enable row level security;
create policy "Students can view and manage their video progress" on video_progress for all using (auth.uid() = student_id);

-- 2. جدول سجلات الحضور (Attendance Records)
create table if not exists public.attendance_records (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  session_id uuid references public.live_sessions(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  status text default 'present', -- 'present', 'absent'
  attended_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (student_id, session_id)
);

alter table public.attendance_records enable row level security;
create policy "Students can manage their attendance" on attendance_records for all using (auth.uid() = student_id);
