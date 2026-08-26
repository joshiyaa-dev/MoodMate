@echo off
echo Installing Mind Mate Release APK (Signed)...
echo.
echo Make sure your Android device is connected via USB and USB debugging is enabled.
echo.
pause
adb install -r "android\app\build\outputs\apk\release\app-release.apk"
echo.
echo Release installation complete! Check your device for the Mind Mate app.
pause