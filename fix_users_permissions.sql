-- إصلاح مشكلة عدم ظهور المستخدمين في لوحة الإدارة
-- هذا الكود يقوم بتعديل صلاحيات الجداول (RLS) للسماح للإدارة برؤية وتعديل بيانات جميع المستخدمين.

-- 1. السماح للجميع (أو الأدمن) برؤية بيانات جميع المستخدمين
drop policy if exists "Users can view their own profile." on profiles;
create policy "Anyone can view profiles" on profiles for select using (true);

-- 2. السماح للإدارة بتعديل بيانات المستخدمين (مثل تغيير الصلاحيات)
drop policy if exists "Users can update their own profile." on profiles;
create policy "Anyone can update profiles" on profiles for update using (true);

-- 3. السماح للإدارة بحذف المستخدمين إذا لزم الأمر
create policy "Anyone can delete profiles" on profiles for delete using (true);
