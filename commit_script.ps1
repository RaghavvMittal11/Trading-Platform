
$filesRaw = git ls-files --others --exclude-standard
$files = $filesRaw -split "`r`n"

$count = 0

foreach ($file in $files) {
    if ($file -match "node_modules") { continue }
    if ($file -match ".git/") { continue }
    
    # Stage the file
    git add "$file"
    
    # Create a commit message based on the file path
    $msg = "feat: add $file"
    if ($file -match "docs/") { $msg = "docs: add definition for $(Split-Path $file -Leaf)" }
    elseif ($file -match "components/") { $msg = "feat(ui): add $(Split-Path $file -Leaf) component" }
    elseif ($file -match "pages/") { $msg = "feat(pages): add $(Split-Path $file -Leaf) page" }
    elseif ($file -match "hooks/") { $msg = "feat(hooks): add $(Split-Path $file -Leaf) hook" }
    elseif ($file -match "\.css") { $msg = "style: application styles in $(Split-Path $file -Leaf)" }
    
    # Commit
    git commit -m "$msg"
    
    $count++
    Write-Host "Committed [$count]: $file"
}

Write-Host "Total commits created: $count"
