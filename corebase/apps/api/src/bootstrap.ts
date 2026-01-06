import { config } from 'dotenv';
import path from 'path';

// Load .env from project root (go up 3 dirs from src/bootstrap.ts -> packages/api/src -> packages/api -> packages -> corebase)
// Actually loading from src/bootstrap.ts: ../../../.env
// __dirname is packages/api/src
const envPath = path.resolve(__dirname, '../../.env');
// Wait, locally server.ts used ../../../.env
// server.ts is in src.
// __dirname in server.ts is src.
// ../../../.env -> packages/.env ? No.
// Structure:
// corebase/
//   .env
//   packages/
//     api/
//       src/
//         server.ts

// From src/server.ts:
// .. -> api
//  .. -> packages
//   .. -> corebase
// So ../../../.env is correct.

const rootEnvPath = path.resolve(__dirname, '../../../.env');
console.log('Loading .env from bootstrap:', rootEnvPath);
const result = config({ path: rootEnvPath });

if (result.error) {
    console.warn('Warning: .env file not found at', rootEnvPath);
} else {
    console.log('.env loaded successfully via bootstrap');
}
