<#
.SYNOPSIS
Turns an opaque logo image into a transparent alpha mask.

.DESCRIPTION
Organisation logos in public/logos are drawn as a CSS mask over bg-primary, so
only their *alpha* channel matters - colour is supplied by the theme token. A
JPEG has no alpha, so a logo saved as one renders as a solid rectangle.

This converts ink coverage into alpha: the flat background becomes transparent,
the artwork becomes opaque black, and the result is saved as a PNG the mask
pipeline can use. Anti-aliased edges survive as partial alpha, so the mark stays
smooth rather than jagged.

Uses .NET System.Drawing, which ships with Windows - nothing to install, but it
is Windows-only. That is fine because the *outputs are committed*: this is an
asset-prep tool, not part of the build, and nobody else needs to run it.

.PARAMETER Source
Image to convert. JPEG, PNG or BMP.

.PARAMETER Destination
PNG to write.

.PARAMETER Crop
Optional "x,y,w,h" in fractions of the image (0-1), applied before trimming.
Use it to keep only the emblem of a lockup that is unreadable at plate size,
e.g. -Crop "0,0,1,0.62".

.PARAMETER Floor
Alpha at or below this (0-255) is treated as background. Raise it if JPEG
compression leaves a haze around the artwork. Default 14.

.PARAMETER NoTrim
Keep the original margins instead of cropping to the artwork's bounding box.

.EXAMPLE
./scripts/logo-to-mask.ps1 -Source assets/logo-sources/grenoblepartners.jpg `
                           -Destination public/logos/grenoble-partners.png
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$Destination,
  [string]$Crop,
  [int]$Floor = 14,
  [switch]$NoTrim
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$sourcePath = (Resolve-Path -LiteralPath $Source).Path
$destinationPath = [System.IO.Path]::GetFullPath(
  [System.IO.Path]::Combine((Get-Location).Path, $Destination))

$loaded = [System.Drawing.Image]::FromFile($sourcePath)
try {
  # Normalise to a known layout so the byte offsets below are always BGRA.
  $bitmap = New-Object System.Drawing.Bitmap($loaded.Width, $loaded.Height,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.DrawImage($loaded, 0, 0, $loaded.Width, $loaded.Height)
  $graphics.Dispose()
} finally {
  $loaded.Dispose()
}

$width = $bitmap.Width
$height = $bitmap.Height

$rect = New-Object System.Drawing.Rectangle(0, 0, $width, $height)
$data = $bitmap.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly,
  [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $data.Stride
$pixels = New-Object byte[] ($stride * $height)
[System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $pixels, 0, $pixels.Length)
$bitmap.UnlockBits($data)
$bitmap.Dispose()

# Luma is Rec. 601, integer maths - plenty for deciding ink from background. It
# is written out at each site rather than factored into a function: PowerShell
# parses `Get-Luma $pixels[$offset + 1]` in argument mode and splits on the
# spaces inside the index, and a call per pixel is slow besides.

# Which way round is this logo? Sample the corners: a light average means dark
# artwork on a light background, so ink is the inverse of luma.
$cornerTotal = 0
$cornerX = @(0, ($width - 1), 0, ($width - 1))
$cornerY = @(0, 0, ($height - 1), ($height - 1))
for ($i = 0; $i -lt 4; $i++) {
  $offset = ($cornerY[$i] * $stride) + ($cornerX[$i] * 4)
  $cb = $pixels[$offset]
  $cg = $pixels[$offset + 1]
  $cr = $pixels[$offset + 2]
  $cornerTotal += [int](($cr * 299 + $cg * 587 + $cb * 114) / 1000)
}
$lightBackground = ($cornerTotal / 4) -gt 128

# Region of interest, before trimming.
$x0 = 0; $y0 = 0; $x1 = $width - 1; $y1 = $height - 1
if ($Crop) {
  $parts = $Crop -split ','
  if ($parts.Count -ne 4) { throw "-Crop expects 'x,y,w,h' as fractions, got '$Crop'" }
  $x0 = [int][math]::Floor([double]$parts[0] * $width)
  $y0 = [int][math]::Floor([double]$parts[1] * $height)
  $x1 = [math]::Min($width - 1, $x0 + [int][math]::Ceiling([double]$parts[2] * $width) - 1)
  $y1 = [math]::Min($height - 1, $y0 + [int][math]::Ceiling([double]$parts[3] * $height) - 1)
}

# Pass one: ink coverage per pixel, and the artwork's bounding box.
$alpha = New-Object 'int[]' ($width * $height)
$peak = 0
$minX = $width; $minY = $height; $maxX = -1; $maxY = -1

for ($y = $y0; $y -le $y1; $y++) {
  $row = $y * $stride
  for ($x = $x0; $x -le $x1; $x++) {
    $offset = $row + ($x * 4)
    $b = $pixels[$offset]
    $g = $pixels[$offset + 1]
    $r = $pixels[$offset + 2]
    $luma = [int](($r * 299 + $g * 587 + $b * 114) / 1000)
    if ($lightBackground) { $value = 255 - $luma } else { $value = $luma }
    if ($value -le $Floor) { $value = 0 }
    if ($value -gt 0) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
      if ($y -lt $minY) { $minY = $y }
      if ($y -gt $maxY) { $maxY = $y }
      if ($value -gt $peak) { $peak = $value }
    }
    $alpha[($y * $width) + $x] = $value
  }
}

if ($maxX -lt 0) { throw "No artwork found in '$Source' - every pixel read as background. Try a lower -Floor." }
if ($NoTrim) { $minX = $x0; $minY = $y0; $maxX = $x1; $maxY = $y1 }

$outWidth = $maxX - $minX + 1
$outHeight = $maxY - $minY + 1

# Pass two: stretch so the densest ink is fully opaque, then write BGRA. Colour
# is irrelevant under a mask, so the RGB channels are left black.
$output = New-Object System.Drawing.Bitmap($outWidth, $outHeight,
  [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outRect = New-Object System.Drawing.Rectangle(0, 0, $outWidth, $outHeight)
$outData = $output.LockBits($outRect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly,
  [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$outPixels = New-Object byte[] ($outData.Stride * $outHeight)

for ($y = 0; $y -lt $outHeight; $y++) {
  for ($x = 0; $x -lt $outWidth; $x++) {
    $value = $alpha[(($y + $minY) * $width) + ($x + $minX)]
    if ($peak -gt 0) { $value = [int](($value * 255) / $peak) }
    if ($value -gt 255) { $value = 255 }
    $outPixels[($y * $outData.Stride) + ($x * 4) + 3] = [byte]$value
  }
}

[System.Runtime.InteropServices.Marshal]::Copy($outPixels, 0, $outData.Scan0, $outPixels.Length)
$output.UnlockBits($outData)

$outputDir = [System.IO.Path]::GetDirectoryName($destinationPath)
if (-not (Test-Path -LiteralPath $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}
$output.Save($destinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
$output.Dispose()

$background = 'dark artwork on light'
if (-not $lightBackground) { $background = 'light artwork on dark' }
Write-Output "$([System.IO.Path]::GetFileName($sourcePath)) -> $Destination"
Write-Output "  read as $background; $($width)x$($height) trimmed to $($outWidth)x$($outHeight)"
