@echo off

echo "%1"

if [%1]==[""] goto usage
if "%1"=="install" goto install
if "%1"=="update" goto update
if "%1"=="generateConf" goto generateConf
if "%1"=="deploy" goto deploy

goto usage

:install
curl http://bookingsorcerer.com/latoquesite.zip --output blankToqueSite.zip && powershell.exe -NoP -NonI -Command "Expand-Archive -Force '.\blankToqueSite.zip' '.'" && npm install
goto :eof

:update
curl http://bookingsorcerer.com/latoquesite.zip --output blankToqueSite.zip && powershell.exe -NoP -NonI -Command "Expand-Archive -Force '.\blankToqueSite.zip' '.'"
goto :eof

:generateConf
gulp generateConf
goto :eof

:deploy
vercel
goto :eof

:usage
@echo USAGE
exit /B 1