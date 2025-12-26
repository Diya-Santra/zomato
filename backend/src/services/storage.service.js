import ImageKit from "imagekit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createRequire } from "module";

// Ensure env vars are available. If they are missing, try to load a .env file
// from common locations so that importing this module works even when the
// app is started from a different entrypoint.
const required = [
  "IMAGEKIT_PUBLIC_KEY",
  "IMAGEKIT_PRIVATE_KEY",
  "IMAGEKIT_URL_ENDPOINT",
];

function haveRequiredEnv() {
  return required.every((k) => !!process.env[k]);
}

if (!haveRequiredEnv()) {
  // Try to load dotenv dynamically (supports ESM)
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const require = createRequire(import.meta.url);
    const dotenv = require("dotenv");

    const candidates = [
      path.resolve(__dirname, "../.env"), // backend/.env when this file is in src/
      path.resolve(__dirname, "../../.env"), // parent projects
      path.resolve(process.cwd(), ".env"), // current working dir
      path.resolve(__dirname, ".env"),
    ];

    let loaded = false;
    for (const p of candidates) {
      if (fs.existsSync(p)) {
        dotenv.config({ path: p });
        loaded = true;
        break;
      }
    }

    // If none of the candidates exist, do a plain dotenv.config() as a last resort
    if (!loaded) {
      dotenv.config();
    }
  } catch (err) {
    // If dynamic load fails, proceed — we'll show a clear error below
    // but don't crash here to allow the app to control startup behavior.
    // console.warn("Could not load dotenv dynamically:", err.message);
  }
}

if (!haveRequiredEnv()) {
  const missing = required.filter((k) => !process.env[k]);
  throw new Error(
    `Missing required ImageKit env vars: ${missing.join(", ")}. ` +
      `Ensure a .env file exists with these keys or set them in the environment.`
  );
}

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadFile = async (file, fileName) => {
  const result = await imageKit.upload({
    file: file,
    fileName: fileName,
  });

  return result;
};