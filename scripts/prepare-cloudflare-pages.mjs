import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(projectRoot, 'dist');
const blockedAssetsRoot = path.join(outputRoot, 'assets', 'node_modules');
const publicAssetsRoot = path.join(outputRoot, 'assets', 'vendor');
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.map', '.webmanifest']);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(entryPath)));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

async function directoryExists(directory) {
  try {
    await readdir(directory);
    return true;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}

if (!(await directoryExists(blockedAssetsRoot))) {
  console.log('No Cloudflare-incompatible node_modules assets were generated.');
  process.exit(0);
}

await rm(publicAssetsRoot, { force: true, recursive: true });
await mkdir(publicAssetsRoot, { recursive: true });

const assetFiles = await listFiles(blockedAssetsRoot);
const replacements = new Map();

for (const assetFile of assetFiles) {
  const originalPath = `/${path.relative(outputRoot, assetFile).split(path.sep).join('/')}`;
  const pathHash = createHash('sha256').update(originalPath).digest('hex').slice(0, 12);
  const publicFileName = `${pathHash}-${path.basename(assetFile)}`;
  const publicFile = path.join(publicAssetsRoot, publicFileName);
  const publicPath = `/assets/vendor/${publicFileName}`;

  await cp(assetFile, publicFile);
  replacements.set(originalPath, publicPath);
}

const outputFiles = await listFiles(outputRoot);

for (const outputFile of outputFiles) {
  if (!textExtensions.has(path.extname(outputFile))) {
    continue;
  }

  const originalContent = await readFile(outputFile, 'utf8');
  let updatedContent = originalContent;

  for (const [originalPath, publicPath] of replacements) {
    updatedContent = updatedContent.split(originalPath).join(publicPath);
  }

  if (updatedContent !== originalContent) {
    await writeFile(outputFile, updatedContent);
  }
}

await rm(blockedAssetsRoot, { force: true, recursive: true });

console.log(`Relocated ${assetFiles.length} generated assets for Cloudflare Pages.`);
