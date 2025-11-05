// 🌸 Sakura Restaurant - Monitoraggio Ambiente Produzione
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const axios = require('axios');

// This script should be run from the root, e.g. `node backend/deployCheck.js`
// It expects the .env file to be in the `backend` directory.
dotenv.config({ path: path.resolve(__dirname, '.env') });

const logFile = path.resolve(__dirname, '../logs/deploy-check.log');
const timestamp = new Date().toISOString();
let report = `\n\n=== 🌸 Verifica Automatica Ambiente - ${timestamp} ===\n`;

const log = (msg) => {
  report += msg + '\n';
  console.log(msg);
};

(async () => {
  log("🚀 Avvio controllo ambiente...");

  // 1️⃣ Test connessione MongoDB
  try {
    if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('<db_password>')) {
        throw new Error('MONGO_URI non è configurato o contiene valori placeholder.');
    }
    await mongoose.connect(process.env.MONGO_URI);
    log("✅ Connessione MongoDB: OK");
  } catch (err) {
    log("❌ Connessione MongoDB fallita: " + err.message);
  }

  // 2️⃣ Verifica variabili d’ambiente principali
  const required = ["JWT_SECRET", "GOOGLE_API_KEY", "RESEND_API_KEY"];
  for (const key of required) {
    if (!process.env[key] || /<.*>/.test(process.env[key])) {
      log(`⚠️ Variabile mancante o non configurata: ${key}`);
    } else {
      log(`✅ ${key}: configurata`);
    }
  }

  // 3️⃣ Test API principali
  const baseURL = `http://localhost:${process.env.PORT || 5000}`;
  const endpoints = [
    "/api/status",
    "/api/auth/check",
    "/api/reservations",
  ];

  for (const route of endpoints) {
    try {
      const res = await axios.get(`${baseURL}${route}`);
      log(`✅ Endpoint ${route}: ${res.status} ${res.statusText}`);
    } catch (err) {
      const message = err.response ? `${err.response.status} ${err.response.statusText}` : err.message;
      log(`⚠️ Endpoint ${route}: non raggiungibile (${message})`);
    }
  }

  // 4️⃣ Test autenticazione token
  if (process.env.JWT_SECRET && !/<.*>/.test(process.env.JWT_SECRET)) {
    log("🔒 JWT attivo: OK");
  } else {
    log("⚠️ JWT mancante o non configurato");
  }

  // 5️⃣ Verifica servizi esterni (es. invio email)
  if (process.env.RESEND_API_KEY && !/<.*>/.test(process.env.RESEND_API_KEY)) {
    log("📧 Servizio Email configurato correttamente");
  } else {
    log("⚠️ Servizio Email non configurato");
  }

  // Salvataggio log
  try {
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
      log(`📁 Creata directory logs in: ${logDir}`);
    }
    fs.appendFileSync(logFile, report);
    log(`🧾 Report salvato in ${path.relative(process.cwd(), logFile)}`);
  } catch(err) {
      log(`❌ Errore durante il salvataggio del log: ${err.message}`);
  }
  

  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }

  process.exit(0);
})();
