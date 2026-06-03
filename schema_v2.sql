-- تحديثات لوحة تحكم المعلم V2

-- إنشاء جدول أكواد الخصم
create table if not exists public.promo_codes (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  discount_percentage numeric not null default 0,
  instructor_name text not null,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.promo_codes enable row level security;
create policy "Anyone can view promo codes." on promo_codes for select using (true);
create policy "Instructors can manage their promo codes" on promo_codes for all using (true); -- Simplified for now

-- إنشاء جدول طلبات السحب المالي للمدرسين
create table if not exists public.withdrawals (
  id uuid default uuid_generate_v4() primary key,
  instructor_name text not null,
  amount numeric not null,
  status text default 'قيد الانتظار', -- قيد الانتظار, مكتمل, مرفوض
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.withdrawals enable row level security;
create policy "Instructors can manage their withdrawals" on withdrawals for all using (true);

-- إنشاء جدول الباقات (Bundles)
create table if not exists public.bundles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price numeric not null,
  instructor_name text not null,
  course_ids uuid[] not null, -- مصفوفة من أرقام الكورسات
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bundles enable row level security;
create policy "Anyone can view bundles" on bundles for select using (true);
create policy "Instructors can manage their bundles" on bundles for all using (true);
