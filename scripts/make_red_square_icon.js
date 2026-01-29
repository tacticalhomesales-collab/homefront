import sharp from "sharp";
import path from "path";
import fs from "fs";

// This script creates a red-square outlined version of an icon PNG, preserving the logo position.
// Usage: node make_red_square_icon.js <input> <output> <size> <hexColor>

const [,, inputPath, outputPath, sizeStr, hexColor] = process.argv;

if (!inputPath || !outputPath || !sizeStr || !hexColor) {
  console.error("Usage: node make_red_square_icon.js <input> <output> <size> <hexColor>");
  process.exit(1);
}

const size = parseInt(sizeStr, 10);

(async () => {
  // Create a red square background
  const background = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: hexColor
    }
  })
    .png()
    .toBuffer();

  // Composite the logo on top, centered
  await sharp(background)
    .composite([
      { input: inputPath, gravity: "center" }
    ])
    .toFile(outputPath);

  console.log(`Created: ${outputPath}`);
})();
