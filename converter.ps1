$currentDirectory = $PSScriptRoot

Start-Process powershell -NoNewWindow -ArgumentList "-NoProfile -ExecutionPolicy Bypass -Command cd '$currentDirectory\frontend'; npm i; npm run dev"

cd "$currentDirectory\backend"

npm i

npm run dev