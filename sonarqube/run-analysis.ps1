param(
    [Parameter(Mandatory = $true)]
    [string]$Token,

    [ValidateSet("backend", "frontend", "all")]
    [string]$Project = "all",

    [string]$HostUrl = "http://host.docker.internal:9000"
)

$root = Split-Path -Parent $PSScriptRoot

function Invoke-SonarProject {
    param(
        [string]$Folder,
        [string]$SettingsFile
    )

    docker run --rm `
        -e SONAR_HOST_URL=$HostUrl `
        -e SONAR_TOKEN=$Token `
        -v "${root}:/usr/src" `
        -w "/usr/src/$Folder" `
        sonarsource/sonar-scanner-cli:latest `
        -D"project.settings=$SettingsFile"
}

if ($Project -eq "backend" -or $Project -eq "all") {
    Invoke-SonarProject "backend" "sonar-project.properties"
}

if ($Project -eq "frontend" -or $Project -eq "all") {
    Invoke-SonarProject "frontend" "sonar-project.properties"
}
