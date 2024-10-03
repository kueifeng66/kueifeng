# Step 1: Get the current timestamp in "YYYY-MM-DD HH:MM:SS" format
$current_time = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Step 2: Write the current timestamp to a JavaScript file (e.g., 'update_time.js')
Set-Content -Path "update_time.js" -Value "const lastUpdated = '$current_time';"

# Step 3: Use Git to add, commit, and push the changes
#git add update_time.js
#git commit -m "Updated website time: $current_time"
#git push origin main
