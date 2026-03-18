# 관리자 권한으로 실행 필요: PowerShell을 "관리자 권한으로 실행" 후 이 스크립트 실행
# 또는 우클릭 -> "관리자 권한으로 실행"
$ruleName = "자산현황 웹서버 8080"
$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "이미 규칙이 있습니다. 제거 후 다시 추가합니다."
    Remove-NetFirewallRule -DisplayName $ruleName
}
New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow
Write-Host "방화벽 규칙 추가 완료. 다른 PC에서 http://172.30.1.160:8080/asset-status.html 로 접속해 보세요."
