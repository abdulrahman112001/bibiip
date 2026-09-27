# رفع تحديث على السيرفر 🚀

خطوات تحديث الموقع الشغال حاليًا على السيرفر، من غير ما تحتاج تعمل كل حاجة
من الأول زي أول مرة. المفروض العملية كلها تاخد أقل من دقيقة.

---

## 0) بيانات السيرفر (مرجع سريع)

| الحاجة | القيمة |
|---|---|
| IP السيرفر | `187.7.23.222` |
| الدومين الحي | `https://www.bibiip.online` |
| مسار المشروع على السيرفر | `/var/www/bibiib` |
| مسار قاعدة البيانات (خارج مجلد المشروع) | `/var/www/data/bibiib/prod.db` |
| مفتاح SSH (على جهازك) | `~/.ssh/bibiib_hostinger` |
| اسم البروسيس في PM2 | `bibiib` |
| مستودع GitHub | `https://github.com/abdulrahman112001/bibiip.git` |

> ⚠️ الدومين الأساسي `bibiip.online` (من غير www) بيشغّل داشبورد تاني مختلف
> تمامًا على استضافة Hostinger المشتركة القديمة - **متلمسهوش**. مشروعنا
> ده شغال بس على السب-دومين `www.bibiip.online` وسيرفر الـ VPS ده.

الدخول على السيرفر من جهازك:

```bash
ssh -i ~/.ssh/bibiib_hostinger root@187.7.23.222
```

---

## 1) الحالة الشائعة: عدّلت في الكود بس (زي أي تعديل في src/)

من جهازك (Windows)، اعمل commit وpush زي العادي:

```bash
cd "d:/my work/bibiib"
git add -A
git commit -m "وصف التعديل"
git push origin main
```

بعد كده على السيرفر (أو نفّذها عن بُعد بـ ssh زي الأمر تحت):

```bash
ssh -i ~/.ssh/bibiib_hostinger root@187.7.23.222 '
  cd /var/www/bibiib &&
  git pull origin main &&
  npm run build &&
  pm2 restart bibiib
'
```

كده بس. `pm2 restart` بياخد لحظات وميقطعش الموقع لمدة طويلة.

---

## 2) لو ضفت مكتبة جديدة (اتغيّر package.json)

نفس خطوات فوق، بس ضيف `npm ci` قبل الـ build:

```bash
ssh -i ~/.ssh/bibiib_hostinger root@187.7.23.222 '
  cd /var/www/bibiib &&
  git pull origin main &&
  npm ci --no-audit --no-fund &&
  npm run build &&
  pm2 restart bibiib
'
```

---

## 3) لو غيّرت في schema.prisma (جدول جديد أو عمود جديد)

لازم تعمل migration جديدة **محليًا الأول** (بتتسجّل في `prisma/migrations/`
وتتبعت مع الكود على GitHub):

```bash
cd "d:/my work/bibiib"
npx prisma migrate dev --name وصف_قصير_للتغيير
git add -A && git commit -m "db: وصف التعديل" && git push origin main
```

بعد كده على السيرفر، لازم تطبّق الـ migration الجديدة على قاعدة بيانات
الإنتاج (`migrate deploy`، **مش** `migrate dev`):

```bash
ssh -i ~/.ssh/bibiib_hostinger root@187.7.23.222 '
  cd /var/www/bibiib &&
  git pull origin main &&
  npm ci --no-audit --no-fund &&
  npx prisma generate &&
  npx prisma migrate deploy &&
  npm run build &&
  pm2 restart bibiib
'
```

---

## 4) أوامر مفيدة على السيرفر

```bash
pm2 status              # الموقع شغال ولا لأ
pm2 logs bibiib          # آخر اللوجات (لو فيه مشكلة بعد تحديث)
pm2 restart bibiib       # إعادة تشغيل بعد أي تحديث
pm2 monit                 # استهلاك CPU/RAM لحظة بلحظة
nginx -t                  # التأكد إن إعدادات Nginx سليمة بعد أي تعديل فيها
systemctl reload nginx    # تطبيق تعديل في إعدادات Nginx من غير قطع الاتصالات الحالية
```

---

## 5) لو حصلت مشكلة بعد تحديث (Rollback سريع)

ارجع لآخر commit كان شغال قبل التحديث:

```bash
ssh -i ~/.ssh/bibiib_hostinger root@187.7.23.222 '
  cd /var/www/bibiib &&
  git log --oneline -5 &&
  git reset --hard <hash الكوميت القديم> &&
  npm ci --no-audit --no-fund &&
  npm run build &&
  pm2 restart bibiib
'
```

---

## 6) ملاحظات مهمة

- ملف `.env` على السيرفر **مش موجود على GitHub خالص** (متعمّد، عشان الأسرار
  متترفعش). لو محتاج تغيّر فيه حاجة (زي كلمة سر الأدمن)، لازم تعدّله يدويًا
  على السيرفر نفسه:
  ```bash
  ssh -i ~/.ssh/bibiib_hostinger root@187.7.23.222 "nano /var/www/bibiib/.env"
  ```
  وبعدها `pm2 restart bibiib` عشان التغيير يتفعّل.
- قاعدة بيانات الإنتاج (`prod.db`) متخزنة **برّه** مجلد المشروع
  (`/var/www/data/bibiib/`) عشان لو يوم عملت `git pull` أو مسحت مجلد
  المشروع بالغلط، البيانات تفضل سليمة.
- سكريبت الـ seed (`npm run db:seed`) محتاج الـ env يبقى محمّل يدويًا لو
  شغّلته مباشرة (مش عن طريق أوامر Prisma CLI)، لأنه بيستخدم `tsx` اللي
  مش بيحمّل `.env` لوحده:
  ```bash
  cd /var/www/bibiib && set -a && source .env && set +a && npm run db:seed
  ```
- SSL بيتجدد لوحده أوتوماتيك (certbot عامل timer)، مفيش داعي تعمل حاجة.
