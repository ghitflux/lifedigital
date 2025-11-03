/**
 * Script para criar assets básicos para o app Life Digital
 * Gera icon, splash e adaptive-icon com cores e texto do branding
 */

const fs = require("fs");
const path = require("path");

// Função para criar SVG básico com dimensões específicas
function createSVG(width, height, content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  ${content}
</svg>`;
}

// Cores do tema Life Digital (do tokens)
const COLORS = {
  background: "#0B0F1A",
  primary: "#2563EB",
  secondary: "#60A5FA",
  text: "#FFFFFF",
};

// Icon 1024x1024 - Logo quadrado
const iconSVG = createSVG(
  1024,
  1024,
  `
  <rect width="1024" height="1024" fill="${COLORS.background}"/>
  <circle cx="512" cy="512" r="400" fill="${COLORS.primary}"/>
  <circle cx="512" cy="512" r="300" fill="${COLORS.secondary}" opacity="0.3"/>
  <text x="512" y="580" font-family="Arial, sans-serif" font-size="200" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">LD</text>
  <text x="512" y="720" font-family="Arial, sans-serif" font-size="60" fill="${COLORS.text}" text-anchor="middle" opacity="0.9">Life Digital</text>
`,
);

// Splash 2048x2732 - Tela de abertura
const splashSVG = createSVG(
  2048,
  2732,
  `
  <rect width="2048" height="2732" fill="${COLORS.background}"/>
  <circle cx="1024" cy="1200" r="500" fill="${COLORS.primary}"/>
  <circle cx="1024" cy="1200" r="380" fill="${COLORS.secondary}" opacity="0.3"/>
  <text x="1024" y="1300" font-family="Arial, sans-serif" font-size="240" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">LD</text>
  <text x="1024" y="1850" font-family="Arial, sans-serif" font-size="100" fill="${COLORS.text}" text-anchor="middle" opacity="0.9">Life Digital</text>
  <text x="1024" y="1980" font-family="Arial, sans-serif" font-size="60" fill="${COLORS.text}" text-anchor="middle" opacity="0.6">Credito Consignado</text>
`,
);

// Adaptive Icon 1024x1024 - Android
const adaptiveIconSVG = createSVG(
  1024,
  1024,
  `
  <rect width="1024" height="1024" fill="transparent"/>
  <circle cx="512" cy="512" r="450" fill="${COLORS.primary}"/>
  <circle cx="512" cy="512" r="340" fill="${COLORS.secondary}" opacity="0.3"/>
  <text x="512" y="600" font-family="Arial, sans-serif" font-size="240" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">LD</text>
`,
);

// Favicon 48x48
const faviconSVG = createSVG(
  48,
  48,
  `
  <rect width="48" height="48" fill="${COLORS.background}"/>
  <circle cx="24" cy="24" r="18" fill="${COLORS.primary}"/>
  <text x="24" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">L</text>
`,
);

// Criar diretório assets se não existir
const assetsDir = path.join(__dirname, "..", "assets");
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Salvar SVGs
fs.writeFileSync(path.join(assetsDir, "icon.svg"), iconSVG);
fs.writeFileSync(path.join(assetsDir, "splash.svg"), splashSVG);
fs.writeFileSync(path.join(assetsDir, "adaptive-icon.svg"), adaptiveIconSVG);
fs.writeFileSync(path.join(assetsDir, "favicon.svg"), faviconSVG);

console.log("✅ Assets SVG criados com sucesso!");
console.log("📁 Localizacao:", assetsDir);
console.log("\nArquivos criados:");
console.log("  - icon.svg (1024x1024)");
console.log("  - splash.svg (2048x2732)");
console.log("  - adaptive-icon.svg (1024x1024)");
console.log("  - favicon.svg (48x48)");
console.log(
  "\n💡 Dica: Use esses SVGs ou converta para PNG com ferramentas online",
);
console.log("   Recomendado: https://cloudconvert.com/svg-to-png");
