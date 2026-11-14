import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const source = new URL('../public/logo-ensf.jpg', import.meta.url);
const appDirectory = new URL('../src/app/', import.meta.url);
const sizes = [16, 32, 48, 64];
const images = await Promise.all(sizes.map(size => sharp(fileURLToPath(source))
  .resize(size, size, { fit: 'contain', background: '#ffffff' }).ensureAlpha().png().toBuffer()));

// ICO directory entries point to PNG images, preserving the original school crest.
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
images.forEach((image, index) => {
  const entry = 6 + index * 16;
  directory[entry] = sizes[index];
  directory[entry + 1] = sizes[index];
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(image.length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await fs.writeFile(new URL('favicon.ico', appDirectory), Buffer.concat([directory, ...images]));
await sharp(fileURLToPath(source))
  .resize(192, 192, { fit: 'contain', background: '#ffffff' })
  .png().toFile(fileURLToPath(new URL('icon.png', appDirectory)));
