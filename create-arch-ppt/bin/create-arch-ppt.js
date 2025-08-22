#!/usr/bin/env node
import { mkdirSync, writeFileSync, cpSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const VERSION = '0.1.0';

const help = `\ncreate-arch-ppt v${VERSION}\n\nUsage:\n  create-arch-ppt <target-dir> [--with-tailwind] [--package-manager npm|pnpm|yarn] [--no-git]\n\nOptions:\n  --with-tailwind      Include Tailwind minimal config (disabled by default)\n  --package-manager    Add packageManager field in package.json\n  --no-git             Do not init git repo\n  -h, --help           Show help\n`;

function parseArgs(argv) {
  const args = { target: '', withTailwind: false, pkgManager: '', git: true };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!args.target && !a.startsWith('-')) { args.target = a; continue; }
    if (a === '--with-tailwind') args.withTailwind = true;
    else if (a === '--no-git') args.git = false;
    else if (a === '--package-manager') { args.pkgManager = argv[++i] || ''; }
    else if (a === '-h' || a === '--help') { console.log(help); process.exit(0); }
    else { console.warn(`Unknown option: ${a}`); }
  }
  if (!args.target) { console.log(help); process.exit(1); }
  return args;
}

function writeJSON(filePath, data) {
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function main() {
  const args = parseArgs(process.argv);
  const cwd = process.cwd();
  const targetDir = resolve(cwd, args.target);
  if (existsSync(targetDir)) {
    console.error(`Target directory already exists: ${targetDir}`);
    process.exit(1);
  }
  mkdirSync(targetDir, { recursive: true });

  // copy template
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  const tplRoot = resolve(__dirname, '../templates/base');
  cpSync(tplRoot, targetDir, { recursive: true });

  // add packageManager
  if (args.pkgManager) {
    const pkgPath = join(targetDir, 'package.json');
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    pkg.packageManager = args.pkgManager;
    writeJSON(pkgPath, pkg);
  }

  // tailwind minimal configs (files already present but optional)
  if (!args.withTailwind) {
    // keep files but not imported; user can enable later
  }

  // optional git init (avoid top-level await for Node compat)
  if (args.git) {
    try {
      const { execSync } = require('node:child_process');
      execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    } catch {}
  }

  console.log(`\nScaffold created at: ${args.target}`);
  console.log('Next steps:');
  console.log(`  cd ${args.target}`);
  console.log('  npm install');
  console.log('  npm run dev');
}

main();


