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
  // Create a solid square background
  const background = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: hexColor,
    },
  })
    .png()
    .toBuffer();

  // Load the logo, trim transparent padding, and scale it to fill most of the square
  const resizedLogoBuffer = await sharp(inputPath)
    .trim()
    .resize(Math.round(size * 0.86), Math.round(size * 0.86), {
      fit: "contain",
    })
    .png()
    .toBuffer();

  // Slightly crop top and bottom to remove any stray lines while keeping the logo size
  let logoSharp = sharp(resizedLogoBuffer);
  const meta = await logoSharp.metadata();

  if (meta.width && meta.height && meta.height > 4) {
    const cropPixels = Math.round(meta.height * 0.04); // crop ~4% from top and bottom
    const cropHeight = Math.max(meta.height - cropPixels * 2, 1);

    logoSharp = logoSharp.extract({
      left: 0,
      top: cropPixels,
      width: meta.width,
      height: cropHeight,
    });
  }

  const logo = await logoSharp.png().toBuffer();

  // Composite the processed logo on top, centered
  await sharp(background)
    .composite([{ input: logo, gravity: "center" }])
    .toFile(outputPath);

  console.log(`Created: ${outputPath}`);
})();
