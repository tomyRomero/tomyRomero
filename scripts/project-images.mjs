// Builds constants/projectImages.json from public/projects/<name>/.
// Files show in name order (number them); the first is the card image.
// Names starting with _ are skipped. Runs before dev and build.
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('..', import.meta.url));
const dir  = `${root}public/projects`;
const out  = `${root}constants/projectImages.json`;
const IMG  = /\.(png|jpe?g|webp|avif)$/i;
const visible = (name) => !name.startsWith('_') && !name.startsWith('.');

// Device-framed exports have transparent corners
async function isFramed(file, m) {
  if (!m.hasAlpha) return false;
  const { data } = await sharp(file).ensureAlpha()
    .extract({ left: 2, top: 2, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  return data[3] === 0;
}

// Colorfulness (Hasler and Süsstrunk). The Photos widget uses the colorful shots.
const VIVID = 25;
async function colorfulness(file) {
  const { data, info } = await sharp(file).flatten({ background: '#ffffff' })
    .resize(96, 96, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true });
  let n = 0, rg = 0, yb = 0, rg2 = 0, yb2 = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const a = data[i] - data[i + 1], b = (data[i] + data[i + 1]) / 2 - data[i + 2];
    rg += a; yb += b; rg2 += a * a; yb2 += b * b; n++;
  }
  const mrg = rg / n, myb = yb / n;
  return Math.sqrt(rg2 / n - mrg * mrg + yb2 / n - myb * myb) + 0.3 * Math.hypot(mrg, myb);
}

const manifest = {};
const slugs = readdirSync(dir, { withFileTypes: true })
  .filter(d => d.isDirectory() && visible(d.name))
  .map(d => d.name)
  .sort();

for (const slug of slugs) {
  const files = readdirSync(`${dir}/${slug}`)
    .filter(f => IMG.test(f) && visible(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  manifest[slug] = await Promise.all(files.map(async f => {
    const file = `${dir}/${slug}/${f}`;
    const m = await sharp(file).metadata();
    // Phone photos can be stored sideways with an EXIF rotation flag
    const turned = (m.orientation ?? 1) >= 5;
    return {
      src: `/projects/${slug}/${f}`,
      w: turned ? m.height : m.width,
      h: turned ? m.width : m.height,
      ...(await isFramed(file, m) ? { framed: true } : {}),
      ...(await colorfulness(file) >= VIVID ? { vivid: true } : {}),
    };
  }));
}

writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`project images: ${slugs.map(s => `${s} (${manifest[s].length})`).join(', ')}`);
