import assert from 'node:assert/strict';
import {
  buildContentPalette,
  contrastRatio,
  hexToRgb,
  minimumSurfaceContrast,
  summarizeImagePixels,
} from '../palette-engine.js';

function hueDistance(first, second) {
  return Math.abs(((first - second + 540) % 360) - 180);
}

const blueImage = [{ hue: 212, saturation: 62, lightness: 48, weight: 1 }];
const ocean = buildContentPalette({
  title: '海边旅行日记',
  description: '蓝天、海浪与远方的风，记录一场自由旅行。',
  imageColors: blueImage,
});
const technology = buildContentPalette({
  title: '人工智能实验',
  description: '调试代码，探索 AI 产品与未来科技。',
  imageColors: blueImage,
});
const food = buildContentPalette({
  title: '温暖南瓜料理',
  description: '秋日阳光里的美食、咖啡和刚出炉的蛋糕。',
  imageColors: blueImage,
});

assert.ok(hueDistance(ocean.primaryHue, food.primaryHue) > 80, 'same image should still respond strongly to different content semantics');
assert.ok(hueDistance(technology.primaryHue, food.primaryHue) > 80, 'technology and food semantics should not collapse to the image hue');
assert.ok(hueDistance(ocean.primaryHue, technology.primaryHue) > 8, 'related blue families should remain distinguishable');
assert.match(food.reason, /烟火橙.*1 张图片/, 'reason should explain both semantic and image signals');

const sameText = { title: '城市设计手记', description: '观察建筑、街道与公共空间里的秩序。' };
const red = buildContentPalette({ ...sameText, imageColors: [{ hue: 4, saturation: 64, lightness: 50, weight: 1 }] });
const blue = buildContentPalette({ ...sameText, imageColors: blueImage });
assert.ok(hueDistance(red.accentHue, blue.accentHue) > 140, 'image changes should produce a different accent color');

const gallery = buildContentPalette({
  ...sameText,
  imageColors: [
    { hue: 4, saturation: 64, lightness: 50, weight: 1 },
    { hue: 42, saturation: 72, lightness: 58, weight: 1 },
    { hue: 212, saturation: 62, lightness: 48, weight: 1 },
  ],
});
assert.equal(gallery.imageCount, 3, 'all gallery images should contribute to the palette');
assert.match(gallery.reason, /3 张图片/, 'gallery palette should report the sampled image count');

for (const palette of [ocean, technology, food, red, blue, gallery]) {
  assert.equal(palette.stops.length, 3);
  assert.ok(palette.stops.every(stop => /^#[0-9a-f]{6}$/i.test(stop)));
  assert.ok(palette.minimumContrast >= 7, `palette text contrast should be AAA-like, got ${palette.minimumContrast}`);
}

const pixels = new Uint8ClampedArray(120 * 4);
for (let index = 0; index < 120; index += 1) {
  const offset = index * 4;
  const isBlue = index >= 100;
  pixels[offset] = isBlue ? 32 : 220;
  pixels[offset + 1] = isBlue ? 90 : 54;
  pixels[offset + 2] = isBlue ? 220 : 42;
  pixels[offset + 3] = 255;
}
const dominant = summarizeImagePixels(pixels);
assert.ok(dominant && (dominant.hue < 20 || dominant.hue > 340), `dominant image color should favor the red majority, got ${dominant?.hue}`);
assert.ok(dominant.saturation > 50);

const black = hexToRgb('#111418');
const white = hexToRgb('#ffffff');
assert.ok(contrastRatio(black, white) > 15);
assert.ok(minimumSurfaceContrast(['#f0c0b8'], { color: white, alpha: .88 }, '#111418') >= 7);

console.log('Palette engine tests passed.');
