import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { parseHTML } from 'linkedom';
import sharp from 'sharp';

const dist = new URL('../dist/', import.meta.url);

async function* htmlFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) yield* htmlFiles(url);
    else if (entry.name.endsWith('.html')) yield url;
  }
}

test('全站页面统一引用 favicon 和 Apple 触屏图标', async () => {
  let pages = 0;
  for await (const file of htmlFiles(dist)) {
    const { document } = parseHTML(await readFile(file, 'utf8'));
    const icons = [...document.querySelectorAll('head link[rel="icon"]')];
    assert.deepEqual(icons.map(icon => icon.getAttribute('href')), ['/favicon.ico', '/favicon.svg'], file.pathname);
    assert.equal(icons[1].getAttribute('type'), 'image/svg+xml');
    const apple = document.querySelector('head link[rel="apple-touch-icon"]');
    assert.equal(apple?.getAttribute('href'), '/apple-touch-icon.png');
    assert.equal(apple?.getAttribute('sizes'), '180x180');
    pages++;
  }
  assert.ok(pages > 0, '必须检查实际构建页面');
});

test('图标完整复制到构建目录，ICO 包含三种尺寸', async () => {
  for (const name of ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png']) {
    assert.deepEqual(await readFile(new URL(name, dist)), await readFile(new URL(`../public/${name}`, import.meta.url)));
  }
  const svg = await sharp(await readFile(new URL('favicon.svg', dist))).metadata();
  assert.equal(svg.width, 64);
  assert.equal(svg.height, 64);
  const apple = await sharp(await readFile(new URL('apple-touch-icon.png', dist))).metadata();
  assert.equal(apple.format, 'png');
  assert.equal(apple.width, 180);
  assert.equal(apple.height, 180);
  const ico = await readFile(new URL('favicon.ico', dist));
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 3);
  for (const [index, size] of [16, 32, 48].entries()) {
    const entry = 6 + index * 16;
    assert.equal(ico[entry], size);
    assert.equal(ico[entry + 1], size);
    const length = ico.readUInt32LE(entry + 8);
    const offset = ico.readUInt32LE(entry + 12);
    assert.ok(offset >= 54 && offset + length <= ico.length);
    const image = await sharp(ico.subarray(offset, offset + length)).metadata();
    assert.equal(image.format, 'png');
    assert.equal(image.width, size);
    assert.equal(image.height, size);
  }
});
