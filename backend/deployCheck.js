// 🌸 Sakura Restaurant - Monitoraggio Ambiente Produzione
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";
import { fileURLToPath } from "url";

// Risolve __dirname in ambiente ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carica .env
dotenv.config({ path: path.resolve(__dirname, ".env") });

// File log
const logFile = path.resolve(__dirname, "../logs/deploy-check.log");
const timestamp = new Date().toISOString();
let report = `\n\n=== 🌸 Verifica Automatica Ambiente - ${timestamp} ===\n`;

const log = (msg) => {
  report += msg + "\n";
  console.log(msg);
};

(async () => {
  log("🚀 Avvio controllo ambiente...");

  // 1️⃣ Connessione MongoDB
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes("<db_password>")) {
      throw new Error("MONGO_URI non configurato o contiene placeholder");
    }
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 4000 });
    log("✅ Connessione MongoDB: OK");
  } catch (err) {
    log("❌ Connessione MongoDB fallita: " + err.message);
  }

  // 2️⃣ Variabili d’ambiente essenziali
  const required = ["JWT_SECRET", "GOOGLE_API_KEY", "RESEND_API_KEY"];
  for (const key of required) {
    if (!process.env[key] || /<.*>/.test(process.env[key])) {
      log(`⚠️ Variabile mancante o placeholder: ${key}`);
    } else {
      log(`✅ ${key}: configurata`);
    }
  }

  // 3️⃣ Test API locali
  const baseURL = `http://localhost:${process.env.PORT || 5000}`;
  const endpoints = ["/api/status", "/api/auth/check", "/api/reservations"];

  for (const route of endpoints) {
    try {
      const res = await axios.get(`${baseURL}${route}`);
      log(`✅ Endpoint ${route}: ${res.status} ${res.statusText}`);
    } catch (err) {
      const message = err.response
        ? `${err.response.status} ${err.response.statusText}`
        : err.message;
      log(`⚠️ Endpoint ${route} non raggiungibile: (${message})`);
    }
  }

  // 4️⃣ Controllo JWT
  if (process.env.JWT_SECRET && !/<.*>/.test(process.env.JWT_SECRET)) {
    log("🔒 JWT attivo: OK");
  } else {
    log("⚠️ JWT non configurato correttamente");
  }

  // 5️⃣ Controllo Email Provider
  if (process.env.RESEND_API_KEY && !/<.*>/.test(process.env.RESEND_API_KEY)) {
    log("📧 Servizio Email: configurato correttamente");
  } else {
    log("⚠️ Servizio Email non configurato");
  }

  // 6️⃣ Salvataggio log
  try {
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
      log(`📁 Directory logs creata in: ${logDir}`);
    }
    fs.appendFileSync(logFile, report);
    log(`🧾 Report salvato in: ${path.relative(process.cwd(), logFile)}`);
  } catch (err) {
    log(`❌ Errore salvataggio log: ${err.message}`);
  }

  // 7️⃣ Chiusura connessione
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    log("🔌 Connessione MongoDB chiusa correttamente");
  }

  log("✅ Controllo completato");
  process.exit(0);
})();
