-- إصلاح مشكلة عدم قدرة الإدارة على شحن وتعديل محافظ الطلاب
-- هذا الكود يقوم بتعديل صلاحيات جدول المحفظة (wallet) للسماح للإدارة برؤية وتعديل الأرصدة.

-- 1. السماح للإدارة برؤية محافظ كل الطلاب
drop policy if exists "Users can view their wallet." on wallet;
create policy "Anyone can view wallets" on wallet for select using (true);

-- 2. السماح للإدارة بتعديل أرصدة المحافظ (شحن المحفظة أو الخصم)
create policy "Anyone can update wallets" on wallet for update using (true);

-- 3. السماح للإدارة بإنشاء محافظ جديدة للطلاب الذين لا يملكون محفظة
create policy "Anyone can insert wallets" on wallet for insert with check (true);

-- 4. السماح بحذف المحفظة إذا لزم الأمر
create policy "Anyone can delete wallets" on wallet for delete using (true);
