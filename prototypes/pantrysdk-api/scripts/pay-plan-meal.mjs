import 'dotenv/config';
import { wrapFetchWithPaymentFromConfig, decodePaymentResponseHeader } from '@x402/fetch';
import { ExactEvmScheme } from '@x402/evm';
import { privateKeyToAccount } from 'viem/accounts';

const API_URL = process.env.PANTRY_API_URL || 'http://localhost:8795/plan-meal';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY || !PRIVATE_KEY.startsWith('0x')) {
  console.error('Missing PRIVATE_KEY in env.');
  console.error('Example: PRIVATE_KEY=0xabc... PANTRY_API_URL=https://... node scripts/pay-plan-meal.mjs');
  process.exit(1);
}

const account = privateKeyToAccount(PRIVATE_KEY);

// x402 server uses "base-sepolia" network strings in v1 responses.
const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [
    { network: 'base-sepolia', client: new ExactEvmScheme(account), x402Version: 1 },
    { network: 'eip155:*', client: new ExactEvmScheme(account) }
  ]
});

const body = {
  recipes: [{ recipeId: 'perfect-cc-cookies', servings: 16 }]
};

const res = await fetchWithPayment(API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

const text = await res.text();
let data;
try { data = JSON.parse(text); } catch { data = text; }

console.log('status:', res.status);
if (res.headers.get('payment-response')) {
  try {
    const decoded = decodePaymentResponseHeader(res.headers.get('payment-response'));
    console.log('payment-response:', decoded);
  } catch {
    console.log('payment-response: <present but decode failed>');
  }
}
console.log('body:', JSON.stringify(data, null, 2));
