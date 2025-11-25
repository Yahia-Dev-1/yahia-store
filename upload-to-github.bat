@echo off
echo ====================================
echo رفع مشروع Yahia Store على GitHub
echo ====================================
echo.

REM تعيين المسار الكامل لـ Git
set GIT_PATH=C:\Program Files\Git\cmd\git.exe

REM التحقق من وجود Git
if not exist "%GIT_PATH%" (
    echo خطأ: Git غير موجود في المسار المتوقع
    echo يرجى تثبيت Git من: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [1/7] تهيئة Git repository...
"%GIT_PATH%" init
if errorlevel 1 (
    echo.
    echo ⚠️ فشل تشغيل git init
    echo.
    echo الحلول البديلة:
    echo 1. استخدم GitHub Desktop: https://desktop.github.com/
    echo 2. افتح Git Bash وشغل الأوامر يدوياً
    echo 3. أعد تثبيت Git
    echo.
    pause
    exit /b 1
)

echo [2/7] إضافة جميع الملفات...
"%GIT_PATH%" add .

echo [3/7] عمل commit...
"%GIT_PATH%" commit -m "Initial commit - Yahia Store"

echo [4/7] ربط repository بـ GitHub...
"%GIT_PATH%" remote add origin https://github.com/Yahia-Dev-1/yahia-store.git

echo [5/7] تغيير اسم الفرع إلى main...
"%GIT_PATH%" branch -M main

echo [6/7] رفع المشروع على GitHub...
"%GIT_PATH%" push -u origin main

echo.
echo ====================================
echo ✅ تم رفع المشروع بنجاح!
echo ====================================
echo.
echo الموقع سيكون متاحاً على:
echo https://yahia-dev-1.github.io/yahia-store/
echo.
echo الخطوات التالية:
echo 1. اذهب إلى: https://github.com/Yahia-Dev-1/yahia-store
echo 2. Settings → Pages → Source: GitHub Actions
echo 3. Secrets → New secret → MONGODB_URI
echo.
pause
