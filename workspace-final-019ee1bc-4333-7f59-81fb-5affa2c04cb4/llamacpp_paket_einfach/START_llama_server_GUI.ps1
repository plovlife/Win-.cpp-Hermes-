Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$settingsPath = Join-Path $scriptDir 'llamacpp_settings.json'

function Write-Section($text) {
    Write-Host ''
    Write-Host ('=' * 60) -ForegroundColor DarkCyan
    Write-Host (' ' + $text) -ForegroundColor Cyan
    Write-Host ('=' * 60) -ForegroundColor DarkCyan
}

function Select-FileDialog {
    param(
        [string]$Title,
        [string]$Filter,
        [string]$InitialDirectory = ''
    )

    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.Title = $Title
    $dialog.Filter = $Filter
    $dialog.Multiselect = $false
    if ($InitialDirectory -and (Test-Path $InitialDirectory)) {
        $dialog.InitialDirectory = $InitialDirectory
    }

    $result = $dialog.ShowDialog()
    if ($result -ne [System.Windows.Forms.DialogResult]::OK) {
        throw "Auswahl abgebrochen: $Title"
    }

    return $dialog.FileName
}

function Load-Settings {
    if (Test-Path $settingsPath) {
        try {
            return Get-Content $settingsPath -Raw | ConvertFrom-Json
        } catch {
            Write-Host 'Gespeicherte Einstellungen konnten nicht gelesen werden. Es werden neue Einstellungen angelegt.' -ForegroundColor Yellow
        }
    }

    return [PSCustomObject]@{
        LlamaServerExe = ''
        ModelFile      = ''
        Host           = '127.0.0.1'
        Port           = 8080
        Context        = 65536
        Parallel       = 1
        CacheTypeK     = 'q8_0'
        CacheTypeV     = 'q8_0'
        FlashAttn      = 'on'
        Batch          = 2048
        UBatch         = 512
        Threads        = 8
        GPULayers      = 'all'
        Jinja          = $true
    }
}

function Save-Settings($settings) {
    $settings | ConvertTo-Json -Depth 5 | Set-Content -Path $settingsPath -Encoding UTF8
}

function Ensure-Path($settings, $propertyName, $title, $filter, $initialDirectory = '') {
    $value = $settings.$propertyName
    if (-not $value -or -not (Test-Path $value)) {
        $selected = Select-FileDialog -Title $title -Filter $filter -InitialDirectory $initialDirectory
        $settings | Add-Member -NotePropertyName $propertyName -NotePropertyValue $selected -Force
    }
}

try {
    Write-Section 'LLAMA.CPP EINFACHSTART'
    Write-Host 'Dieses Skript hilft dir beim einfachen Start von llama-server.' -ForegroundColor Gray
    Write-Host 'Beim ersten Start werden die noetigen Dateien per Dateiauswahl gesetzt.' -ForegroundColor Gray

    $settings = Load-Settings

    Ensure-Path -settings $settings -propertyName 'LlamaServerExe' -title 'Bitte llama-server.exe auswaehlen' -filter 'llama-server.exe|llama-server.exe|EXE-Dateien|*.exe' -initialDirectory 'C:\llama.cpp'
    Ensure-Path -settings $settings -propertyName 'ModelFile' -title 'Bitte dein GGUF-Modell auswaehlen' -filter 'GGUF-Modelle|*.gguf|Alle Dateien|*.*' -initialDirectory 'C:\000.mAIn\Model\01_LLMs\GGUF'

    Save-Settings $settings

    $exeDir = Split-Path -Parent $settings.LlamaServerExe

    Write-Section 'AKTUELLE EINSTELLUNGEN'
    Write-Host ('llama-server.exe : ' + $settings.LlamaServerExe)
    Write-Host ('Modell           : ' + $settings.ModelFile)
    Write-Host ('Host             : ' + $settings.Host)
    Write-Host ('Port             : ' + $settings.Port)
    Write-Host ('Kontext          : ' + $settings.Context)
    Write-Host ('Slots            : ' + $settings.Parallel)
    Write-Host ('GPU-Layer        : ' + $settings.GPULayers)
    Write-Host ('KV-Cache         : ' + $settings.CacheTypeK + ' / ' + $settings.CacheTypeV)
    Write-Host ('Flash Attention  : ' + $settings.FlashAttn)
    Write-Host ('Batch / UBatch   : ' + $settings.Batch + ' / ' + $settings.UBatch)
    Write-Host ('Threads          : ' + $settings.Threads)
    Write-Host ('Jinja            : ' + $settings.Jinja)

    Write-Section 'SERVERSTART'
    Write-Host 'Der Server startet jetzt.' -ForegroundColor Green
    Write-Host 'WICHTIG: Dieses Fenster bleibt offen, solange llama-server laeuft.' -ForegroundColor Yellow
    Write-Host 'Zum Stoppen dieses Fenster schliessen ODER STOP_llama_server.bat benutzen.' -ForegroundColor Yellow
    Write-Host ''

    $args = @(
        '-m', $settings.ModelFile,
        '--host', [string]$settings.Host,
        '--port', [string]$settings.Port,
        '-ngl', [string]$settings.GPULayers,
        '-c', [string]$settings.Context,
        '-np', [string]$settings.Parallel,
        '-ctk', [string]$settings.CacheTypeK,
        '-ctv', [string]$settings.CacheTypeV,
        '-fa', [string]$settings.FlashAttn,
        '-b', [string]$settings.Batch,
        '-ub', [string]$settings.UBatch,
        '-t', [string]$settings.Threads
    )

    if ($settings.Jinja) {
        $args += '--jinja'
    }

    Push-Location $exeDir
    & $settings.LlamaServerExe @args
    Pop-Location
}
catch {
    Write-Host ''
    Write-Host 'FEHLER:' -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ''
    Write-Host 'Tipp: Wenn du andere Dateien neu auswaehlen willst, starte EINSTELLUNGEN_ZURUECKSETZEN.bat.' -ForegroundColor Yellow
    Read-Host 'Zum Beenden Enter druecken'
}
