$assetsDir = "C:\Users\graph\.gemini\antigravity\scratch\creative-portfolio\assets"
$outputFile = "C:\Users\graph\.gemini\antigravity\scratch\creative-portfolio\assets.js"

# Cohesive, beautiful color palettes to assign to items
$palettes = @(
    @(
        @{"name"="Electric Cyan"; "hex"="#00f2fe"},
        @{"name"="Deep Indigo"; "hex"="#0d1224"},
        @{"name"="Cool Silver"; "hex"="#94a3b8"},
        @{"name"="Slate Blue"; "hex"="#475569"}
    ),
    @(
        @{"name"="Roasted Espresso"; "hex"="#2a1a14"},
        @{"name"="Golden Amber"; "hex"="#c59b27"},
        @{"name"="Warm Cream"; "hex"="#f5ebe6"},
        @{"name"="Dark Charcoal"; "hex"="#1e2229"}
    ),
    @(
        @{"name"="Vibrant Teal"; "hex"="#0d9488"},
        @{"name"="Crisp White"; "hex"="#ffffff"},
        @{"name"="Mint Glow"; "hex"="#f0fdf4"},
        @{"name"="Dark Ash"; "hex"="#1e293b"}
    ),
    @(
        @{"name"="Emerald Green"; "hex"="#059669"},
        @{"name"="Gold Accent"; "hex"="#d97706"},
        @{"name"="Clean Ivory"; "hex"="#f8fafc"},
        @{"name"="Soft Shadow"; "hex"="#374151"}
    ),
    @(
        @{"name"="Sunset Orange"; "hex"="#ea580c"},
        @{"name"="Gold Spark"; "hex"="#f59e0b"},
        @{"name"="Charcoal dark"; "hex"="#0f172a"},
        @{"name"="Soft Clay"; "hex"="#78350f"}
    ),
    @(
        @{"name"="Sacred White"; "hex"="#f8fafc"},
        @{"name"="Royal Indigo"; "hex"="#3b82f6"},
        @{"name"="Pale Ice"; "hex"="#e0f2fe"},
        @{"name"="Deep Navy"; "hex"="#0f172a"}
    ),
    @(
        @{"name"="Electric Purple"; "hex"="#a855f7"},
        @{"name"="Neon Magenta"; "hex"="#d946ef"},
        @{"name"="Velvet Black"; "hex"="#090d16"},
        @{"name"="Rose Glow"; "hex"="#fdf2f8"}
    )
)

$critiques = @{
    "campaign" = "A high-impact promotional composition featuring bold typography, strong product positioning, and high color contrast to ensure visibility across advertising platforms.";
    "sa-campaign" = "Clean social media layouts using modern grids. Utilizes generous whitespace around the central subject to focus the viewer's attention and maintain professional readability.";
    "exhibition" = "High-energy countdown banner designed for industrial events. Employs strong diagonal lines, blueprint backgrounds, and high-visibility typography to create anticipation.";
    "mailer" = "Email newsletter graphic with a vertical structure. Features a clear hierarchy starting with an eye-catching header and transitioning to clean product specs.";
    "meta-campaign" = "B2B social campaign graphic designed for Facebook/Instagram feeds. Standard 1:1 or 4:5 crop with high saturation and a clear call-to-action area.";
    "types" = "Technical product display detailing the inner engineering of industrial heating elements. Employs clean 3D renderings on minimalist backgrounds.";
    "web-banner" = "Landscape e-commerce web banner. Leverages a left-aligned text container and a right-aligned product render, leaving plenty of negative space for clean integration.";
    "wp-campaign" = "WhatsApp marketing broadcast tile optimized for mobile displays. Uses large, legible font sizes and high-contrast badges for small screens.";
    "festive" = "A warm, brand-integrated greeting poster. Blends traditional cultural vectors and icons with modern clean layout templates and corporate logos.";
    "did-you-know" = "An educational infographic reel. Employs smooth typography animations and callout markers explaining industrial heating mechanics.";
    "motion-post" = "A dynamic product reel utilizing 3D camera orbits, fast manufacturing cuts, and energetic audio syncs to deliver a high-production corporate showcase.";
    "root" = "A creative design layout demonstrating clean color balance, symmetrical alignment, and premium branding details tailored for industrial products."
}

$id = 1
$assetsList = @()

# Helper to get files
function Scan-Subdir {
    param(
        [string]$subpath,
        [string]$category
    )
    $fullPath = Join-Path $assetsDir $subpath
    if (Test-Path $fullPath) {
        Get-ChildItem -Path $fullPath -File | ForEach-Object {
            $ext = $_.Extension.ToLower()
            if ($ext -in @(".jpg", ".jpeg", ".png", ".webp", ".mp4")) {
                $type = "image"
                if ($ext -eq ".mp4") { $type = "video" }
                
                # Get name without extension
                $name = $_.BaseName
                
                # Assign palette and critique
                $paletteIdx = $id % $palettes.Count
                $assignedPalette = $palettes[$paletteIdx]
                
                $critiqueKey = "root"
                if ($category -eq "campaigns") { $critiqueKey = "campaign" }
                elseif ($category -eq "sa-campaigns") { $critiqueKey = "sa-campaign" }
                elseif ($category -eq "exhibitions") { $critiqueKey = "exhibition" }
                elseif ($category -eq "mailers") { $critiqueKey = "mailer" }
                elseif ($category -eq "meta-campaigns") { $critiqueKey = "meta-campaign" }
                elseif ($category -eq "products") { $critiqueKey = "types" }
                elseif ($category -eq "web-banners") { $critiqueKey = "web-banner" }
                elseif ($category -eq "wp-campaigns") { $critiqueKey = "wp-campaign" }
                elseif ($category -eq "festive-motion") {
                    if ($subpath -like "*video*") {
                        if ($subpath -like "*did-you-know*") { $critiqueKey = "did-you-know" }
                        elseif ($subpath -like "*motion-post*") { $critiqueKey = "motion-post" }
                        else { $critiqueKey = "motion-post" }
                    } else {
                        $critiqueKey = "festive"
                    }
                }
                
                $critique = $critiques[$critiqueKey]
                if ($null -eq $critique) { $critique = $critiques["root"] }
                
                # Relative path for the webpage
                $relPath = "assets/$subpath/$($_.Name)"
                $relPath = $relPath.Replace("\", "/")
                
                $item = @{
                    "id" = "$id"
                    "name" = $name
                    "type" = $type
                    "path" = $relPath
                    "category" = $category
                    "colors" = $assignedPalette
                    "critique" = "$($name) - $($critique)"
                }
                
                $script:assetsList += $item
                $script:id++
            }
        }
    }
}

# Scan folders mapping to categories
Scan-Subdir "images/root" "campaigns"
Scan-Subdir "images/campaign" "campaigns"
Scan-Subdir "images/sa-campaign" "sa-campaigns"
Scan-Subdir "images/exhibition" "exhibitions"
Scan-Subdir "images/mailer" "mailers"
Scan-Subdir "images/meta-campaign" "meta-campaigns"
Scan-Subdir "images/types" "products"
Scan-Subdir "images/web-banner" "web-banners"
Scan-Subdir "images/wp-campaign" "wp-campaigns"

# Festive & Motion includes images/festive, videos/festive, videos/did-you-know, videos/motion-post
Scan-Subdir "images/festive" "festive-motion"
Scan-Subdir "videos/festive" "festive-motion"
Scan-Subdir "videos/did-you-know" "festive-motion"
Scan-Subdir "videos/motion-post" "festive-motion"

# Convert to JSON
$json = $assetsList | ConvertTo-Json -Depth 5

# Write JS file
$jsContent = "window.portfolioAssets = `r`n" + $json + ";"
[System.IO.File]::WriteAllText($outputFile, $jsContent)

Write-Host "assets.js regenerated successfully with $id items!"
