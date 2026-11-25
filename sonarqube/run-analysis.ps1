param(
    [Parameter(Mandatory = $true)]
    [string]$Token,
    [string]$HostUrl = "http://host.docker.internal:9000"
)

$root = Split-Path -Parent $PSScriptRoot

docker run --rm `
    -e SONAR_HOST_URL=$HostUrl `
    -e SONAR_TOKEN=$Token `
    -v "${root}:/usr/src" `
    -w /usr/src `
    sonarsource/sonar-scanner-cli:latest
