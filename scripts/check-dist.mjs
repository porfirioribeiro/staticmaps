import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const packages = ['core', 'react', 'vue'];

for (const name of packages) {
  const file = resolve('packages', name, 'dist/index.js');
  if (!existsSync(file)) {
    throw new Error(`packages/${name}/dist/index.js is missing; run \`pnpm build\` first`);
  }
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

execFileSync(process.execPath, ['--check', resolve('packages/svelte/dist/index.js')], { stdio: 'inherit' });

const expectedExports = {
  core: ['createStaticMap'],
  react: ['StaticMap'],
  vue: ['StaticMap'],
};

for (const name of packages) {
  const file = resolve('packages', name, 'dist/index.js');
  const mod = await import(pathToFileURL(file).href);
  const missing = expectedExports[name].filter(key => !(key in mod));
  if (missing.length > 0) {
    throw new Error(`packages/${name}/dist/index.js is missing exports: ${missing.join(', ')}`);
  }
  console.log(`${name}: dist imports and exports ok`);
}
