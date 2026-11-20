import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const publicDir = new URL('../public/', import.meta.url);
const source = await readFile(new URL('belaroprecision-logo-favicon.webp', publicDir));
const sizes = [16, 32, 48];
const images = [];
for (const size of sizes) {
  images.push(await sharp(source).resize(size, size, { fit: 'contain' }).png().toBuffer());
}

// ICO 目录记录各尺寸 PNG 的长度与偏移量。
const directory = Buffer.alloc(6 + sizes.length * 16);
directory.writeUInt16LE(1, 2);
directory.writeUInt16LE(sizes.length, 4);
let offset = directory.length;
for (const [index, size] of sizes.entries()) {
  const entry = 6 + index * 16;
  directory[entry] = size;
  directory[entry + 1] = size;
  directory.writeUInt16LE(1, entry + 4);
  directory.writeUInt16LE(32, entry + 6);
  directory.writeUInt32LE(images[index].length, entry + 8);
  directory.writeUInt32LE(offset, entry + 12);
  offset += images[index].length;
}
await writeFile(new URL('belaroprecision-favicon.ico', publicDir), Buffer.concat([directory, ...images]));
await writeFile(new URL('belaroprecision-apple-touch-icon.png', publicDir),
  await sharp(source).resize(180, 180, { fit: 'contain' }).flatten({ background: '#fff' }).png().toBuffer());
console.log('已生成品牌 ICO 和 Apple 触屏图标。');
