@echo off
echo Installing Mind Mate Debug APK...
echo.
echo Make sure your Android device is connected via USB and USB debugging is enabled.
echo.
pause
adb install -r "android\app\build\outputs\apk\debug\app-debug.apk"
echo.
echo Debug installation complete! Check your device for the Mind Mate app.
pause