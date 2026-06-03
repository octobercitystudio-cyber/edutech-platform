-- إصلاح مشكلة خطأ الشراء (عدم القدرة على الإضافة لجدول enrollments)
-- هذا الكود يقوم بفك الحماية عن جدول الاشتراكات (enrollments) للسماح للطلاب بتسجيل أنفسهم في الكورسات.

-- السماح للطلاب برؤية اشتراكاتهم
drop policy if exists "Users can view their enrollments." on enrollments;
create policy "Anyone can view enrollments" on enrollments for select using (true);

-- السماح للطلاب (أو النظام) بإضافة اشتراكات جديدة بعد إتمام الدفع
create policy "Anyone can insert enrollments" on enrollments for insert with check (true);

-- السماح بتحديث نسبة تقدم الطالب (Progress) أو حذف الاشتراك
create policy "Anyone can update enrollments" on enrollments for update using (true);
create policy "Anyone can delete enrollments" on enrollments for delete using (true);
