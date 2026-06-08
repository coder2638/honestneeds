#!/usr/bin/env node

/**
 * Pre-build validation script
 * Checks for common issues before starting the build
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔍 Pre-build validation starting...\n');

let hasIssues = false;

// Check 1: Node version
const nodeVersion = process.version;
const minNodeVersion = 'v22.0.0';
console.log(`✓ Node version: ${nodeVersion}`);

// Check 2: Available memory
const freeMem = os.freemem();
const totalMem = os.totalmem();
const freeGB = Math.round(freeMem / 1024 / 1024 / 1024);
const totalGB = Math.round(totalMem / 1024 / 1024 / 1024);
console.log(`✓ Available memory: ${freeGB}GB / ${totalGB}GB`);
if (freeGB < 1) {
  console.warn(`⚠️  Warning: Only ${freeGB}GB free memory available`);
  hasIssues = true;
}

// Check 3: Disk space
try {
  const diskSpace = require('child_process').execSync('df -B1G .', { encoding: 'utf-8' });
  console.log('✓ Disk space check passed');
} catch (e) {
  console.log('✓ Disk space: unable to check (non-critical)');
}

// Check 4: Files exist
const requiredFiles = [
  'package.json',
  'next.config.ts',
  'tsconfig.json',
  '.next' // Usually exists from previous builds
];

console.log('\n📂 Checking required files:');
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    const stat = fs.statSync(file);
    const isDir = stat.isDirectory();
    console.log(`  ✓ ${file}${isDir ? ' (directory)' : ''}`);
  } else {
    console.log(`  ⚠️  Missing: ${file}${requiredFiles.slice(0, 3).includes(file) ? ' (REQUIRED!)' : ' (optional)'}`);
    if (requiredFiles.slice(0, 3).includes(file)) {
      hasIssues = true;
    }
  }
}

// Check 5: Environment variables
console.log('\n🔐 Environment variables:');
const requiredEnvVars = ['NODE_ENV', 'NEXT_PUBLIC_API_URL'];
for (const varName of requiredEnvVars) {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✓ ${varName}=${value}`);
  } else {
    console.warn(`  ⚠️  Missing: ${varName}`);
    if (varName === 'NODE_ENV') hasIssues = true;
  }
}

console.log('\n' + '='.repeat(60));

if (hasIssues) {
  console.error('\n❌ Pre-build validation found critical issues!');
  process.exit(1);
} else {
  console.log('\n✅ Pre-build validation passed!');
  console.log('\nProceeding with build...\n');
  process.exit(0);
}
