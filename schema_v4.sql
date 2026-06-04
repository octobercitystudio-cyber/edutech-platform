-- تحديثات لوحة تحكم الطالب V2

-- 1. جدول المعاملات المالية للطلاب (Transactions)
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  amount numeric not null,
  description text not null,
  type text not null, -- 'شحن محفظة' أو 'شراء كورس'
  status text default 'مكتملة', -- 'مكتملة', 'قيد المراجعة', 'مرفوضة'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;
create policy "Students can view their transactions" on transactions for select using (auth.uid() = student_id);
-- للإدارة فقط صلاحية التعديل والإضافة الكاملة (مبسط هنا)
create policy "Enable insert for authenticated users" on transactions for insert with check (auth.uid() = student_id);

-- 2. تحديث جدول profiles لإضافة النقاط وساعات التعلم
alter table public.profiles 
add column if not exists points integer default 0,
add column if not exists learning_minutes integer default 0;
