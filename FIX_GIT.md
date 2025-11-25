# حل مشكلة Git Fork Bomb في Windows

## المشكلة
تظهر رسالة `BUG (fork bomb): C:\Program Files\Git\bin\git.exe` عند محاولة تشغيل أوامر Git.

## الحلول المتاحة

### ✅ الحل الأول: استخدام GitHub Desktop (الأسهل - موصى به)

1. **حمّل GitHub Desktop**
   - اذهب إلى: https://desktop.github.com/
   - حمّل وثبّت البرنامج

2. **سجل دخولك**
   - افتح GitHub Desktop
   - سجل دخولك بحساب GitHub الخاص بك

3. **أضف المشروع**
   - اختر `File` → `Add Local Repository`
   - اختر المجلد: `C:\Users\yahia\Desktop\New folder\yahia-store`
   - إذا طلب منك إنشاء repository، اضغط `Create Repository`

4. **ارفع المشروع**
   - في الجانب الأيسر، ستجد قائمة بجميع الملفات المتغيرة
   - اكتب رسالة commit مثل: "Initial commit"
   - اضغط `Commit to main`
   - اضغط `Publish repository`
   - اختر repository: `yahia-store`
   - تأكد من إلغاء تحديد "Keep this code private" إذا كنت تريده عاماً
   - اضغط `Publish Repository`

---

### ✅ الحل الثاني: إصلاح Git في PowerShell

جرب تشغيل PowerShell **كمسؤول** ونفذ الأوامر التالية:

```powershell
# 1. احذف متغيرات البيئة المتعارضة
$env:GIT_ASKPASS = $null
$env:SSH_ASKPASS = $null

# 2. انتقل إلى مجلد المشروع
cd "C:\Users\yahia\Desktop\New folder\yahia-store"

# 3. ابدأ Git repository
git init

# 4. أضف جميع الملفات
git add .

# 5. اعمل commit
git commit -m "Initial commit"

# 6. اربط بـ GitHub
git remote add origin https://github.com/Yahia-Dev-1/yahia-store.git

# 7. غيّر اسم الفرع إلى main
git branch -M main

# 8. ارفع المشروع
git push -u origin main
```

---

### ✅ الحل الثالث: إعادة تثبيت Git

إذا لم تنجح الحلول السابقة:

1. **احذف Git الحالي**
   - اذهب إلى `Control Panel` → `Programs and Features`
   - ابحث عن `Git` واحذفه

2. **حمّل Git من جديد**
   - اذهب إلى: https://git-scm.com/download/win
   - حمّل النسخة الأحدث
   - عند التثبيت، اختر الإعدادات الافتراضية

3. **أعد تشغيل الكمبيوتر**

4. **جرب الأوامر مرة أخرى**

---

### ✅ الحل الرابع: استخدام Git Bash بدلاً من PowerShell

1. افتح **Git Bash** (ابحث عنه في قائمة Start)
2. انتقل إلى المجلد:
   ```bash
   cd "/c/Users/yahia/Desktop/New folder/yahia-store"
   ```
3. نفذ الأوامر:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/Yahia-Dev-1/yahia-store.git
   git branch -M main
   git push -u origin main
   ```

---

## بعد رفع المشروع على GitHub

### تفعيل GitHub Pages

1. اذهب إلى repository على GitHub: https://github.com/Yahia-Dev-1/yahia-store
2. اضغط على `Settings`
3. من القائمة الجانبية، اختر `Pages`
4. في قسم `Source`، اختر `GitHub Actions`
5. أنشئ ملف workflow جديد (سأوفره لك)

### نشر الموقع

بعد رفع المشروع، نفذ:

```powershell
npm run deploy
```

هذا سينشئ فرع `gh-pages` ويرفع الموقع عليه.

---

## ملاحظات مهمة

- ✅ تم تحديث `package.json` لإضافة سكريبتات النشر
- ✅ تم تحديث `next.config.mjs` لدعم التصدير الثابت
- ✅ تم إنشاء ملف `.nojekyll` لضمان عمل GitHub Pages
- ⚠️ تأكد من وجود ملف `.env.local` في `.gitignore` لحماية بيانات MongoDB

---

## الخطوات التالية

بعد رفع المشروع بنجاح:

1. **تحقق من البناء**: تأكد أن `npm run build` يعمل بدون أخطاء
2. **انشر الموقع**: نفذ `npm run deploy`
3. **افتح الموقع**: سيكون متاحاً على: `https://yahia-dev-1.github.io/yahia-store/`

---

## المساعدة

إذا واجهت أي مشاكل، جرب:
- استخدام GitHub Desktop (الأسهل)
- فتح PowerShell كمسؤول
- استخدام Git Bash بدلاً من PowerShell
- إعادة تثبيت Git
