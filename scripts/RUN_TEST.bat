@echo off
REM ====================================================================
REM Script de Standardisation - MODE TEST
REM ====================================================================
REM Ce script lance la standardisation en mode TEST (sans modification)
REM ====================================================================

echo.
echo ========================================
echo   STANDARDISATION DES FICHES - MODE TEST
echo ========================================
echo.
echo Ce script va analyser toutes les fiches
echo SANS LES MODIFIER (mode simulation)
echo.
pause

cd /d "%~dp0.."

echo.
echo Demarrage du script...
echo.

node scripts/standardize-fiches.js

echo.
echo ========================================
echo   EXECUTION TERMINEE
echo ========================================
echo.
echo Consultez le rapport ci-dessus.
echo.
pause
