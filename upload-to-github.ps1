# Upload Yahia Store to GitHub
# Run this script from the project directory

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Upload Yahia Store to GitHub" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Clean environment variables that may cause issues
$env:GIT_ASKPASS = $null
$env:SSH_ASKPASS = $null
$env:GIT_TERMINAL_PROMPT = "0"

# Try to find Git
$gitPaths = @(
    "C:\Program Files\Git\cmd\git.exe",
    "C:\Program Files (x86)\Git\cmd\git.exe",
    "git" # from PATH
)

$gitExe = $null
foreach ($path in $gitPaths) {
    try {
        if ($path -eq "git") {
            $result = Get-Command git -ErrorAction SilentlyContinue
            if ($result) {
                $gitExe = "git"
                break
            }
        } elseif (Test-Path $path) {
            $gitExe = $path
            break
        }
    } catch {
        continue
    }
}

if (-not $gitExe) {
    Write-Host "ERROR: Git not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Yellow
    Write-Host "1. Download GitHub Desktop: https://desktop.github.com/" -ForegroundColor White
    Write-Host "2. Install Git from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Found Git: $gitExe" -ForegroundColor Green
Write-Host ""

# Check if .git exists
if (Test-Path ".git") {
    Write-Host "WARNING: Git repository already exists" -ForegroundColor Yellow
    $response = Read-Host "Continue? (y/n)"
    if ($response -ne "y") {
        exit 0
    }
} else {
    Write-Host "[1/7] Initializing Git repository..." -ForegroundColor Cyan
    try {
        & $gitExe init
        if ($LASTEXITCODE -ne 0) {
            throw "git init failed"
        }
        Write-Host "SUCCESS" -ForegroundColor Green
    } catch {
        Write-Host "FAILED: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Use GitHub Desktop instead:" -ForegroundColor Yellow
        Write-Host "https://desktop.github.com/" -ForegroundColor White
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "[2/7] Adding all files..." -ForegroundColor Cyan
& $gitExe add .
Write-Host "SUCCESS" -ForegroundColor Green

Write-Host ""
Write-Host "[3/7] Creating commit..." -ForegroundColor Cyan
& $gitExe commit -m "Initial commit - Yahia Store"
Write-Host "SUCCESS" -ForegroundColor Green

Write-Host ""
Write-Host "[4/7] Linking to GitHub repository..." -ForegroundColor Cyan
& $gitExe remote add origin https://github.com/Yahia-Dev-1/yahia-store.git 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Remote already exists, updating URL..." -ForegroundColor Yellow
    & $gitExe remote set-url origin https://github.com/Yahia-Dev-1/yahia-store.git
}
Write-Host "SUCCESS" -ForegroundColor Green

Write-Host ""
Write-Host "[5/7] Renaming branch to main..." -ForegroundColor Cyan
& $gitExe branch -M main
Write-Host "SUCCESS" -ForegroundColor Green

Write-Host ""
Write-Host "[6/7] Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "You may be asked to login..." -ForegroundColor Yellow
& $gitExe push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "SUCCESS" -ForegroundColor Green
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "Successfully uploaded to GitHub!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your site will be available at:" -ForegroundColor Cyan
    Write-Host "https://yahia-dev-1.github.io/yahia-store/" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/Yahia-Dev-1/yahia-store" -ForegroundColor White
    Write-Host "2. Settings -> Pages -> Source: GitHub Actions" -ForegroundColor White
    Write-Host "3. Settings -> Secrets -> New secret -> MONGODB_URI" -ForegroundColor White
} else {
    Write-Host "FAILED to push" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try GitHub Desktop:" -ForegroundColor Yellow
    Write-Host "https://desktop.github.com/" -ForegroundColor White
}

Write-Host ""
Read-Host "Press Enter to exit"
