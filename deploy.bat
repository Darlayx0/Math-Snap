@echo off
echo Memulai proses deploy otomatis ke GitHub...
git add .
set /p msg="Masukkan pesan commit (atau tekan Enter untuk 'Auto deploy update'): "
if "%msg%"=="" set msg=Auto deploy update
git commit -m "%msg%"
git push origin main
echo.
echo Deploy berhasil di-push ke GitHub!
echo GitHub Actions akan memproses deploy ke GitHub Pages dalam beberapa menit.
pause
