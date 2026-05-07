/**
 * Gera ícones a partir de public/assets/nexar-logo.png:
 * - Remove fundo preto (melhor leitura em abas claras/escuras).
 * - app/icon.png: símbolo com transparência e área segura (favicon / PWA).
 * - app/apple-icon.png: mesma marca sobre fundo escuro da marca (contraste no springboard iOS).
 * - app/favicon.ico: tamanhos clássicos 16/32/48.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const input = path.join(root, 'public', 'assets', 'nexar-logo.png');

/**
 * Esconde apenas o fundo preto/quase‑cinza: baixa luminância e baixa saturação
 * (não remove violetas escuros saturados da marca).
 */
function removeFlatDarkBackground(data, width, height, channels) {
  const out = Buffer.from(data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = out[i];
      const g = out[i + 1];
      const b = out[i + 2];
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      const chroma = mx - mn;
      const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const isBackdrop = chroma < 42 && L < 46;
      if (isBackdrop) {
        out[i + 3] = 0;
      }
    }
  }
  return out;
}

async function rasterWithAlpha() {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = removeFlatDarkBackground(data, info.width, info.height, info.channels);
  return sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

async function main() {
  const base = await rasterWithAlpha();

  const trimmed = sharp(await base.clone().toBuffer()).trim({ threshold: 5 });

  /** Área transparente (~14%) preserva espaço livre nos cantos ao reduzir a 16px (legibilidade). */
  const icon512 = await trimmed
    .clone()
    .resize(512, 512, {
      fit: 'contain',
      position: 'center',
      kernel: sharp.kernel.lanczos3,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  fs.mkdirSync(path.join(root, 'app'), { recursive: true });
  await sharp(icon512).toFile(path.join(root, 'app', 'icon.png'));

  // Apple Touch Icon: fundo escuro da marca (Nexar) para contraste no iOS.
  const dark = { r: 18, g: 22, b: 38, alpha: 1 };
  const appleSize = 180;
  const inner = 140;
  const symbolBuf = await trimmed
    .clone()
    .resize({
      width: inner,
      height: inner,
      fit: 'inside',
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: appleSize,
      height: appleSize,
      channels: 4,
      background: dark,
    },
  })
    .composite([{ input: symbolBuf, gravity: 'center' }])
    .png()
    .toFile(path.join(root, 'app', 'apple-icon.png'));

  const sizes = [16, 32, 48];
  const icoBuffers = await Promise.all(
    sizes.map((s) =>
      sharp(icon512)
        .resize(s, s, { fit: 'contain', kernel: sharp.kernel.lanczos3 })
        .png()
        .toBuffer(),
    ),
  );
  const ico = await pngToIco(icoBuffers);
  fs.writeFileSync(path.join(root, 'app', 'favicon.ico'), ico);

  console.log('app/icon.png, app/apple-icon.png e app/favicon.ico gerados.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
