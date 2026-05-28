$content = Get-Content 'assets.js' -Raw
$matches = [regex]::Matches($content, '"category"\s*:\s*"([^"]+)"')
$matches | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique
