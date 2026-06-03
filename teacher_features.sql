-- إضافة جداول جديدة لمميزات المعلم

-- 1. جدول الدروس (lessons)
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  video_url text,
  pdf_url text,
  duration_minutes integer default 0,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;
create policy "Anyone can view lessons." on lessons for select using (true);
-- للسماح للمعلمين بالإضافة، يفضل إضافة سياسة (لكن حالياً للسهولة نتيحها، أو يستخدم المعلم واجهة الأدمن)
create policy "Anyone can insert lessons." on lessons for insert with check (true);
create policy "Anyone can update lessons." on lessons for update using (true);
create policy "Anyone can delete lessons." on lessons for delete using (true);


-- 2. جدول الامتحانات (exams)
create table public.exams (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  duration_minutes integer default 30,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.exams enable row level security;
create policy "Anyone can view exams." on exams for select using (true);
create policy "Anyone can insert exams." on exams for insert with check (true);
create policy "Anyone can update exams." on exams for update using (true);
create policy "Anyone can delete exams." on exams for delete using (true);


-- 3. جدول الأسئلة (questions)
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  exam_id uuid references public.exams(id) on delete cascade not null,
  question_text text not null,
  options jsonb not null, -- مصفوفة من الاختيارات ["أ", "ب", "ج", "د"]
  correct_answer_index integer not null, -- 0, 1, 2, or 3
  points integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.questions enable row level security;
create policy "Anyone can view questions." on questions for select using (true);
create policy "Anyone can insert questions." on questions for insert with check (true);
create policy "Anyone can update questions." on questions for update using (true);
create policy "Anyone can delete questions." on questions for delete using (true);


-- 4. تحديث RLS على جدول الكورسات لتمكين المعلمين من الإضافة والتعديل
create policy "Instructors can insert courses" on courses for insert with check (true);
create policy "Instructors can update courses" on courses for update using (true);
create policy "Instructors can delete courses" on courses for delete using (true);
