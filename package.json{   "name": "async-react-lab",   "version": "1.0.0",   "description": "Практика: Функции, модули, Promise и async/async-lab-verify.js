// async-lab-verify.js
import { mockFetchUser, fetchDataWithCancel } from './api.js';
import { isPasswordSecure, isAgeValid } from './mathUtils.js';

const PASS = '\u2705';
const FAIL = '\u274C';

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    console.log(`${PASS}  ${label}:  OK`);
    passed++;
  } else {
    console.log(`${FAIL}  ${label}:  FAILED`);
    failed++;
  }
}

// --- 1. ESM Module Loader ---
assert(typeof mockFetchUser === 'function', 'ESM Module Loader (Named Export)');
assert(typeof isPasswordSecure === 'function', 'ESM Module Loader (Default/Custom Exports)');

// --- 2. Promise Parallel Pipeline ---
const ids = ['u1', 'u2_failed', 'u3'];
const requests = ids.map((id) =>
  mockFetchUser(id, { shouldFail: id.includes('failed'), delayMs: 50 })
);
const results = await Promise.allSettled(requests);
const fulfilled = results.filter((r) => r.status === 'fulfilled').length;
const rejected = results.filter((r) => r.status === 'rejected').length;

assert(fulfilled === 2 && rejected === 1, 'Promise Parallel Pipeline (allSettled Matrix)');

// --- 3. AbortController Signal Dispatch ---
const controller = new AbortController();
setTimeout(() => controller.abort(), 100);

let aborted = false;
try {
  await fetchDataWithCancel('/api/test', { signal: controller.signal });
} catch (err) {
  aborted = err.name === 'AbortError';
}

assert(aborted, 'AbortController Signal Dispatch (Clean Abort on User Action)');

// --- Итог ---
console.log(`\nИтого: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
