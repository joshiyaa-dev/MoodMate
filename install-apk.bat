@echo off
echo Installing Mind Mate APK...
echo.
echo Make sure your Android device is connected via USB and USB debugging is enabled.
echo.
pause
adb install -r "android\app\build\outputs\apk\debug\app-debug.apk"
echo.
echo Installation complete! Check your device for the Mind Mate app with your custom logo.
pause