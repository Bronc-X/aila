param(
  [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Resolve-Path (Join-Path $scriptDir "..")
$publicDir = Join-Path $root "public"
$dataPath = Join-Path $root "data\toni-now.json"

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
  $OutputPath = Join-Path $publicDir "now-share-long.png"
}

$profile = Get-Content -Raw -Encoding UTF8 $dataPath | ConvertFrom-Json

$W = 1080
$H = 22000
$bitmap = New-Object System.Drawing.Bitmap($W, $H)
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

function Color-Hex([string]$hex) {
  $clean = $hex.TrimStart("#")
  $r = [Convert]::ToInt32($clean.Substring(0, 2), 16)
  $gg = [Convert]::ToInt32($clean.Substring(2, 2), 16)
  $b = [Convert]::ToInt32($clean.Substring(4, 2), 16)
  return [System.Drawing.Color]::FromArgb($r, $gg, $b)
}

function Brush-Hex([string]$hex) {
  return New-Object System.Drawing.SolidBrush((Color-Hex $hex))
}

function Pen-Hex([string]$hex, [float]$width = 1) {
  return New-Object System.Drawing.Pen((Color-Hex $hex), $width)
}

function New-RoundRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundRect([float]$x, [float]$y, [float]$w, [float]$h, [float]$r, [System.Drawing.Brush]$brush, [System.Drawing.Pen]$pen = $null) {
  $path = New-RoundRect $x $y $w $h $r
  $script:g.FillPath($brush, $path)
  if ($null -ne $pen) {
    $script:g.DrawPath($pen, $path)
  }
  $path.Dispose()
}

function Public-Path([string]$src) {
  $rel = $src.TrimStart("/").Replace("/", "\")
  return Join-Path $script:publicDir $rel
}

function Draw-Text([string]$text, [System.Drawing.Font]$font, [System.Drawing.Brush]$brush, [float]$x, [float]$y, [float]$w, [float]$h, [string]$align = "Near") {
  $rect = New-Object System.Drawing.RectangleF($x, $y, $w, $h)
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::$align
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
  $script:g.DrawString($text, $font, $brush, $rect, $format)
  $format.Dispose()
}

function Measure-TextHeight([string]$text, [System.Drawing.Font]$font, [float]$w) {
  $size = New-Object System.Drawing.SizeF($w, 2000)
  $measured = $script:g.MeasureString($text, $font, $size)
  return [Math]::Ceiling($measured.Height)
}

function Draw-ImageCover([string]$src, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = Public-Path $src
  if (!(Test-Path $path)) { return }
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $clip = New-RoundRect $x $y $w $h $r
    $state = $script:g.Save()
    $script:g.SetClip($clip)
    $scale = [Math]::Max($w / $img.Width, $h / $img.Height)
    $dw = $img.Width * $scale
    $dh = $img.Height * $scale
    $dx = $x + (($w - $dw) / 2)
    $dy = $y + (($h - $dh) / 2)
    $script:g.DrawImage($img, $dx, $dy, $dw, $dh)
    $script:g.Restore($state)
    $script:g.DrawPath((Pen-Hex "#d5ceb9" 2), $clip)
    $clip.Dispose()
  }
  finally {
    $img.Dispose()
  }
}

function Draw-ImageContain([string]$src, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r, [string]$fill = "#ffffff") {
  Fill-RoundRect $x $y $w $h $r (Brush-Hex $fill) (Pen-Hex "#d5ceb9" 2)
  $path = Public-Path $src
  if (!(Test-Path $path)) { return }
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $pad = 18
    $iw = $w - ($pad * 2)
    $ih = $h - ($pad * 2)
    $scale = [Math]::Min($iw / $img.Width, $ih / $img.Height)
    $dw = $img.Width * $scale
    $dh = $img.Height * $scale
    $dx = $x + (($w - $dw) / 2)
    $dy = $y + (($h - $dh) / 2)
    $script:g.DrawImage($img, $dx, $dy, $dw, $dh)
  }
  finally {
    $img.Dispose()
  }
}

function Draw-ImageContainNoFrame([string]$src, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r, [string]$fill = "#ffffff") {
  Fill-RoundRect $x $y $w $h $r (Brush-Hex $fill) (Pen-Hex "#d5ceb9" 2)
  $path = Public-Path $src
  if (!(Test-Path $path)) { return }
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $clip = New-RoundRect $x $y $w $h $r
    $state = $script:g.Save()
    $script:g.SetClip($clip)
    $pad = 10
    $iw = $w - ($pad * 2)
    $ih = $h - ($pad * 2)
    $scale = [Math]::Min($iw / $img.Width, $ih / $img.Height)
    $dw = $img.Width * $scale
    $dh = $img.Height * $scale
    $dx = $x + (($w - $dw) / 2)
    $dy = $y + (($h - $dh) / 2)
    $script:g.DrawImage($img, $dx, $dy, $dw, $dh)
    $script:g.Restore($state)
    $clip.Dispose()
  }
  finally {
    $img.Dispose()
  }
}

function Get-ImageDisplaySize([string]$src, [float]$maxW, [float]$maxH) {
  $path = Public-Path $src
  if (!(Test-Path $path)) { return @(0, 0) }
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $scale = [Math]::Min($maxW / $img.Width, $maxH / $img.Height)
    return @([float]($img.Width * $scale), [float]($img.Height * $scale))
  }
  finally {
    $img.Dispose()
  }
}

function Draw-ImageNatural([string]$src, [float]$x, [float]$y, [float]$maxW, [float]$maxH, [float]$r) {
  $path = Public-Path $src
  if (!(Test-Path $path)) { return @(0, 0) }
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $scale = [Math]::Min($maxW / $img.Width, $maxH / $img.Height)
    $dw = [float]($img.Width * $scale)
    $dh = [float]($img.Height * $scale)
    $dx = $x + (($maxW - $dw) / 2)
    $clip = New-RoundRect $dx $y $dw $dh $r
    $state = $script:g.Save()
    $script:g.SetClip($clip)
    $script:g.DrawImage($img, $dx, $y, $dw, $dh)
    $script:g.Restore($state)
    $clip.Dispose()
    return @($dw, $dh)
  }
  finally {
    $img.Dispose()
  }
}

function Section-Title([string]$title) {
  $script:y += 58
  Draw-Text $title $script:fontSection $script:brushInk 64 ($script:y - 10) 952 104
  $script:y += 120
}

function Draw-InfoCard([object]$item, [bool]$showStars = $false) {
  $imgSize = Get-ImageDisplaySize $item.image 952 430
  $imgH = [float]$imgSize[1]
  $tx = 88
  $tw = 864
  $meta = ""
  if ($null -ne $item.type) { $meta = $item.type }
  elseif ($null -ne $item.label) { $meta = $item.label }
  if ($showStars -and $null -ne $item.stars) { $meta = "$meta  /  $($item.stars) Stars" }
  $titleH = [Math]::Max(58, (Measure-TextHeight $item.name $script:fontCardTitle $tw) + 12)
  $bodyH = [Math]::Max(92, (Measure-TextHeight $item.summary $script:fontBody $tw) + 10)
  $height = $imgH + 30 + 34 + $titleH + $bodyH + 52
  Fill-RoundRect 64 $script:y 952 $height 18 $script:brushPaper2 (Pen-Hex "#d5ceb9" 2)
  Draw-ImageNatural $item.image 64 $script:y 952 430 18 | Out-Null
  $textY = $script:y + $imgH + 30
  Draw-Text $meta $script:fontMeta $script:brushMuted $tx $textY $tw 34
  Draw-Text $item.name $script:fontCardTitle $script:brushInk $tx ($textY + 40) $tw $titleH
  Draw-Text $item.summary $script:fontBody $script:brushInkSoft $tx ($textY + 40 + $titleH) $tw $bodyH
  $script:y += $height + 22
}

function Draw-CaseCard([object]$item) {
  $imgSize = Get-ImageDisplaySize $item.image 952 520
  $imgH = [float]$imgSize[1]
  $tx = 88
  $tw = 864
  $labelH = [Math]::Max(34, (Measure-TextHeight $item.label $script:fontMeta $tw) + 8)
  $titleH = [Math]::Max(58, (Measure-TextHeight $item.title $script:fontCardTitle $tw) + 12)
  $bodyH = [Math]::Max(92, (Measure-TextHeight $item.summary $script:fontBody $tw) + 10)
  $height = $imgH + 30 + $labelH + $titleH + $bodyH + 52
  Fill-RoundRect 64 $script:y 952 $height 18 $script:brushPaper2 (Pen-Hex "#d5ceb9" 2)
  Draw-ImageNatural $item.image 64 $script:y 952 520 18 | Out-Null
  $textY = $script:y + $imgH + 30
  Draw-Text $item.label $script:fontMeta $script:brushMuted $tx $textY $tw $labelH
  Draw-Text $item.title $script:fontCardTitle $script:brushInk $tx ($textY + $labelH) $tw $titleH
  Draw-Text $item.summary $script:fontBody $script:brushInkSoft $tx ($textY + $labelH + $titleH) $tw $bodyH
  $script:y += $height + 22
}

$brushBg = Brush-Hex "#eee6d4"
$brushHero = Brush-Hex "#13261f"
$brushLime = Brush-Hex "#bde84a"
$brushInk = Brush-Hex "#17221c"
$brushInkSoft = Brush-Hex "#2d3a31"
$brushMuted = Brush-Hex "#657064"
$brushPaper = Brush-Hex "#f6f0df"
$brushPaper2 = Brush-Hex "#fbf6e8"
$brushWhite = Brush-Hex "#fffdf4"
$script:brushInk = $brushInk
$script:brushInkSoft = $brushInkSoft
$script:brushMuted = $brushMuted
$script:brushPaper2 = $brushPaper2

$fontHeroName = New-Object System.Drawing.Font("Georgia", 88, [System.Drawing.FontStyle]::Bold)
$fontHeroNameRight = New-Object System.Drawing.Font("Georgia", 58, [System.Drawing.FontStyle]::Bold)
$fontHero = New-Object System.Drawing.Font("Microsoft YaHei", 35, [System.Drawing.FontStyle]::Bold)
$fontHeroCompact = New-Object System.Drawing.Font("Microsoft YaHei", 34, [System.Drawing.FontStyle]::Bold)
$fontHeroBody = New-Object System.Drawing.Font("Microsoft YaHei", 24, [System.Drawing.FontStyle]::Regular)
$fontSmall = New-Object System.Drawing.Font("Microsoft YaHei", 18, [System.Drawing.FontStyle]::Regular)
$fontTiny = New-Object System.Drawing.Font("Microsoft YaHei", 16, [System.Drawing.FontStyle]::Regular)
$fontSection = New-Object System.Drawing.Font("Georgia", 54, [System.Drawing.FontStyle]::Bold)
$fontCardTitle = New-Object System.Drawing.Font("Microsoft YaHei", 30, [System.Drawing.FontStyle]::Bold)
$fontMeta = New-Object System.Drawing.Font("Microsoft YaHei", 18, [System.Drawing.FontStyle]::Bold)
$fontBody = New-Object System.Drawing.Font("Microsoft YaHei", 22, [System.Drawing.FontStyle]::Regular)
$fontBodyBold = New-Object System.Drawing.Font("Microsoft YaHei", 23, [System.Drawing.FontStyle]::Bold)
$fontContact = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
$script:fontSection = $fontSection
$script:fontCardTitle = $fontCardTitle
$script:fontMeta = $fontMeta
$script:fontBody = $fontBody

$g.Clear((Color-Hex "#eee6d4"))

$script:y = 58
Fill-RoundRect 48 $script:y 984 690 28 $brushHero $null
Draw-Text $profile.headline $fontHeroCompact $brushWhite 74 ($script:y + 76) 560 142
Draw-Text "NUS Algorithm / AI Builder / Agentic Coding" $fontSmall (Brush-Hex "#d4e8d0") 74 ($script:y + 232) 560 36
Draw-Text "Self-owned products, delivery cases, NVIDIA credential, and contact access in one readable share poster." $fontHeroBody (Brush-Hex "#e7eddc") 74 ($script:y + 330) 610 128
Draw-Text "www.toni.asia/now" $fontBodyBold $brushLime 74 ($script:y + 558) 540 42
Draw-ImageCover "/now/toni-avatar.jpg" 722 ($script:y + 62) 226 278 22
Draw-Text "Toni" $fontHeroNameRight $brushWhite 690 ($script:y + 374) 290 82 "Center"
Draw-Text "AI Builder" $fontSmall (Brush-Hex "#d4e8d0") 690 ($script:y + 458) 290 34 "Center"

$script:y += 758

Section-Title "Processing"
foreach ($update in $profile.weeklyUpdates) {
  Fill-RoundRect 64 $script:y 952 286 16 $brushPaper2 (Pen-Hex "#d5ceb9" 2)
  Draw-Text $update.date $fontMeta $brushMuted 94 ($script:y + 24) 240 30
  Draw-Text $update.title $fontCardTitle $brushInk 94 ($script:y + 62) 864 82
  Draw-Text $update.body $fontBody $brushInkSoft 94 ($script:y + 154) 864 104
  $script:y += 308
}

Section-Title "Building program"
foreach ($project in $profile.projects) {
  Draw-InfoCard $project $true
}

Section-Title "Supplement"
foreach ($case in $profile.companionCases) {
  Draw-CaseCard $case
}

Section-Title "Certificate"
$cred = $profile.credentials[0]
Fill-RoundRect 64 $script:y 952 1048 22 $brushPaper2 (Pen-Hex "#d5ceb9" 2)
Draw-ImageContain $cred.image 96 ($script:y + 34) 888 520 14 "#ffffff"
Draw-Text "$($cred.issuer) / $($cred.date)" $fontMeta $brushMuted 96 ($script:y + 586) 888 34
Draw-Text $cred.title $fontCardTitle $brushInk 96 ($script:y + 628) 888 132
Draw-Text $cred.summary $fontBody $brushInkSoft 96 ($script:y + 786) 888 188
$script:y += 1090

Section-Title "Superiority"
foreach ($service in $profile.services) {
  Fill-RoundRect 64 $script:y 952 318 16 $brushPaper2 (Pen-Hex "#d5ceb9" 2)
  Draw-Text $service.title $fontCardTitle $brushInk 94 ($script:y + 34) 864 82
  Draw-Text $service.body $fontBody $brushInkSoft 94 ($script:y + 132) 864 134
  $script:y += 340
}

Section-Title "Contact"
Fill-RoundRect 48 $script:y 984 520 28 $brushHero $null
Draw-Text "Start from one real business scene." $fontContact $brushWhite 92 ($script:y + 62) 560 92
Draw-Text "A spreadsheet, chat record, SOP, bid file, or stuck workflow is enough for the first step." $fontHeroBody (Brush-Hex "#e7eddc") 92 ($script:y + 164) 560 126
Draw-Text "https://www.toni.asia/now" $fontBodyBold $brushLime 92 ($script:y + 292) 560 42
Draw-Text "GitHub: github.com/Bronc-X" $fontSmall (Brush-Hex "#d4e8d0") 92 ($script:y + 348) 560 32
Draw-Text "Email: Broncin@163.com" $fontSmall (Brush-Hex "#d4e8d0") 92 ($script:y + 386) 560 32
Draw-ImageContain "/wechat-qr-toni.png" 686 ($script:y + 70) 292 292 20 "#ffffff"
Draw-Text "WeChat" $fontBodyBold $brushWhite 686 ($script:y + 388) 292 40 "Center"
$script:y += 600

$finalH = [Math]::Ceiling($script:y + 52)
$finalBitmap = New-Object System.Drawing.Bitmap($W, $finalH)
$fg = [System.Drawing.Graphics]::FromImage($finalBitmap)
$fg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$srcRect = New-Object System.Drawing.Rectangle(0, 0, $W, $finalH)
$fg.DrawImage($bitmap, 0, 0, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$fg.Dispose()

$dir = Split-Path -Parent $OutputPath
if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
$finalBitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$finalBitmap.Dispose()
$g.Dispose()
$bitmap.Dispose()

Write-Host "Generated $OutputPath ($W x $finalH)"
