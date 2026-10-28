# MİHRA Android ikonlarını ve açılış ekranını üretir (hilal, koyu yeşil zemin).
# Kullanım: powershell -ExecutionPolicy Bypass -File scripts\android-icons.ps1
Add-Type -AssemblyName System.Drawing
$res = Join-Path $PSScriptRoot '..\android\app\src\main\res'
$BGCOLOR = [System.Drawing.ColorTranslator]::FromHtml('#102D27')
$GOLD = [System.Drawing.ColorTranslator]::FromHtml('#E7C98B')

function Draw([int]$w, [int]$h, $file, $scale, $mode) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.Clear([System.Drawing.Color]::Transparent)
  $b = New-Object System.Drawing.SolidBrush $BGCOLOR
  switch ($mode) {
    'full'   { $g.FillRectangle($b, 0, 0, $w, $h) }
    'circle' { $g.FillEllipse($b, 0, 0, $w - 1, $h - 1) }
    'round'  { $r = $w * 0.22; $p = New-Object System.Drawing.Drawing2D.GraphicsPath
               $p.AddArc(0,0,2*$r,2*$r,180,90); $p.AddArc($w-2*$r,0,2*$r,2*$r,270,90)
               $p.AddArc($w-2*$r,$h-2*$r,2*$r,2*$r,0,90); $p.AddArc(0,$h-2*$r,2*$r,2*$r,90,90); $p.CloseFigure(); $g.FillPath($b, $p) }
  }
  # hilal: altın daire eksi kaydırılmış daire
  $m = [Math]::Min($w, $h); $d = $m * $scale
  $x = ($w - $d) / 2 + $m * 0.07 * ($scale / 0.56); $y = ($h - $d) / 2
  $moon = New-Object System.Drawing.Drawing2D.GraphicsPath; $moon.AddEllipse([single]$x, [single]$y, [single]$d, [single]$d)
  $cut = New-Object System.Drawing.Drawing2D.GraphicsPath; $cd = $d * 0.86
  $cut.AddEllipse([single]($x + $d * 0.30), [single]($y + $d * 0.02), [single]$cd, [single]$cd)
  $reg = New-Object System.Drawing.Region $moon; $reg.Exclude($cut)
  $g.FillRegion((New-Object System.Drawing.SolidBrush $GOLD), $reg)
  $bmp.Save((Join-Path $res $file), [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
}

$dens = @{ mdpi = 1; hdpi = 1.5; xhdpi = 2; xxhdpi = 3; xxxhdpi = 4 }
foreach ($k in $dens.Keys) {
  $s = $dens[$k]
  Draw (48 * $s) (48 * $s) "mipmap-$k\ic_launcher.png" 0.56 'round'
  Draw (48 * $s) (48 * $s) "mipmap-$k\ic_launcher_round.png" 0.52 'circle'
  Draw (108 * $s) (108 * $s) "mipmap-$k\ic_launcher_foreground.png" 0.40 'none'
}
# Açılış ekranları: mevcut splash.png boyutları korunur
Get-ChildItem $res -Recurse -Filter splash.png | ForEach-Object {
  $i = [System.Drawing.Image]::FromFile($_.FullName); $w = $i.Width; $h = $i.Height; $i.Dispose()
  Draw $w $h ($_.FullName.Substring((Resolve-Path $res).Path.Length + 1)) 0.28 'full'
}
# Uyarlanabilir ikon arka planı (BOM'suz UTF-8)
[IO.File]::WriteAllText((Join-Path $res 'values\ic_launcher_background.xml'), @'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#102D27</color>
</resources>
'@)
Write-Output 'Android ikonlari ve acilis ekrani uretildi.'
