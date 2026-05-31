-- إنشاء جدول الملفات الشخصية (profiles) الذي يرتبط بمصادقة Supabase
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  phone text,
  parent_phone text,
  grade text,
  governorate text,
  gender text,
  email text not null,
  role text default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- تأمين الجداول بتفعيل Row Level Security (RLS)
alter table public.profiles enable row level security;

-- السماح للمستخدمين بقراءة بياناتهم الشخصية فقط
create policy "Users can view their own profile." on profiles
  for select using (auth.uid() = id);

-- السماح للمستخدمين بتعديل بياناتهم الشخصية
create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- إنشاء جدول الكورسات (courses)
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price numeric default 0,
  instructor_name text,
  status text default 'متاح',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;
-- السماح للجميع بمشاهدة الكورسات
create policy "Anyone can view courses." on courses for select using (true);

-- إنشاء جدول الاشتراكات (enrollments)
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  progress numeric default 0,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.enrollments enable row level security;
create policy "Users can view their enrollments." on enrollments for select using (auth.uid() = student_id);

-- إنشاء جدول المحفظة (wallet)
create table public.wallet (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null unique,
  balance numeric default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.wallet enable row level security;
create policy "Users can view their wallet." on wallet for select using (auth.uid() = student_id);

-- إنشاء دالة لإنشاء حساب شخصي ومحفظة تلقائياً عند تسجيل مستخدم جديد (اختياري)
-- هذه الدالة ستعمل كمشغل (Trigger) متى ما تم تسجيل الدخول عبر Supabase Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.wallet (student_id, balance)
  values (new.id, 0);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_user();
