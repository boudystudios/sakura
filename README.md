
# 🔐 Configurazioni Sensibili e Dove Modificarle

Questa guida fornisce una panoramica completa per la gestione, modifica e manutenzione delle chiavi, credenziali e variabili di ambiente del progetto Sakura Restaurant System.

## 1. File di Configurazione

Tutte le chiavi e le credenziali devono essere salvate in un file `.env` nella directory root del backend.
**Importante:** Il file `.env` non deve mai essere incluso nel repository Git. Assicurati che `.env` sia presente nel tuo file `.gitignore`.

---

## 2. Variabili Principali

Ogni voce indica il nome della variabile, la sua descrizione, dove trovarla/modificarla e il ruolo responsabile.

### 🗄️ Database
- **`MONGO_URI`**
  - **Descrizione:** Stringa di connessione completa (URI) per il database MongoDB Atlas, incluse le credenziali di accesso.
  - **Modifica:** Dashboard di MongoDB Atlas.
  - **Ruolo:** DevOps.

### 🔐 Autenticazione
- **`JWT_SECRET`**
  - **Descrizione:** Chiave segreta crittograficamente robusta per firmare i token JWT. Deve essere generata una sola volta e mantenuta segreta.
  - **Modifica:** Generare con `openssl rand -base64 32` o un tool simile.
  - **Ruolo:** FullStack / Admin.
- **`JWT_EXPIRES_IN`**
  - **Descrizione:** Durata di validità di un token JWT (es. `1d`, `7d`, `30m`).
  - **Modifica:** File `.env`.
  - **Ruolo:** Admin.

### 👨‍💼 Account Seed (Amministratori e Staff)
- **`ADMIN_SEED_EMAIL`** & **`ADMIN_SEED_PASSWORD`**
  - **Descrizione:** Credenziali utilizzate da uno script di seeding (`seedAdmin.js`) per creare il primo utente amministratore nel sistema.
  - **Posizione:** `/backend/scripts/seedAdmin.js` (logica), `.env` (valori).
  - **Nota:** Si raccomanda di eliminare o commentare queste variabili dopo aver eseguito lo script di seed per la prima volta.
  - **Ruolo:** DevOps / Owner.

### 📧 Sistema Email (Nodemailer)
- **`MAIL_HOST`**, **`MAIL_PORT`**, **`MAIL_SECURE`**
- **`MAIL_USER`**, **`MAIL_PASS`**, **`MAIL_FROM`**
  - **Descrizione:** Dati di configurazione del server SMTP per l'invio di email transazionali (es. conferme di prenotazione, reset password).
  - **Modifica:** File `.env`, in base al provider SMTP utilizzato (es. SendGrid, Mailgun, Gmail).
  - **Ruolo:** DevOps.

### 💳 Pagamenti Online
- **`STRIPE_SECRET_KEY`** & **`STRIPE_WEBHOOK_SECRET`**
  - **Descrizione:** Chiavi API per l'integrazione con Stripe per la gestione dei pagamenti online.
  - **Fonte:** Dashboard di Stripe.
  - **Ruolo:** DevOps / Finance.

### 📱 Notifiche (Twilio / SMS)
- **`TWILIO_ACCOUNT_SID`**, **`TWILIO_AUTH_TOKEN`**, **`TWILIO_PHONE_NUMBER`**
  - **Descrizione:** Credenziali per l'invio di notifiche SMS tramite l'API di Twilio (es. conferme di prenotazione immediate).
  - **Fonte:** Dashboard di Twilio.
  - **Ruolo:** DevOps.

### 🗺️ API Esterne
- **`GOOGLE_MAPS_API_KEY`**
  - **Descrizione:** Chiave API per l'integrazione di Google Maps nella pagina contatti.
  - **Fonte:** Google Cloud Console.
  - **Ruolo:** FullStack / DevOps.
- **`RECAPTCHA_SITE_KEY`** & **`RECAPTCHA_SECRET_KEY`**
  - **Descrizione:** Chiavi per implementare Google reCAPTCHA e proteggere i form da spam e bot.
  - **Fonte:** Google reCAPTCHA Dashboard.
  - **Ruolo:** FullStack / DevOps.

### 🎧 Audio e Multimediale
- **`ENABLE_AUDIO`**
  - **Descrizione:** Flag (`true`/`false`) per abilitare o disabilitare la musica di sottofondo e gli effetti sonori.
  - **Posizione:** `/frontend/config/ui.js` o simile.
  - **Ruolo:** Frontend Dev.
- **`AUDIO_BASE_URL`**
  - **Descrizione:** URL di base da cui caricare i file audio.
  - **Posizione:** `/frontend/config/ui.js` o simile.
  - **Ruolo:** Frontend Dev.

### 📊 Monitoraggio e Analisi
- **`SENTRY_DSN`**
  - **Descrizione:** DSN per l'integrazione con Sentry per il monitoraggio degli errori in tempo reale.
  - **Fonte:** Dashboard di Sentry.
  - **Ruolo:** DevOps / QA.
- **`CLOUDINARY_URL`**
  - **Descrizione:** URL per l'upload e la gestione delle immagini (menu, galleria) su Cloudinary.
  - **Fonte:** Dashboard di Cloudinary.
  - **Ruolo:** DevOps.

---

## 3. Matrice delle Responsabilità

| Categoria         | File Principali                            | Responsabile         | Frequenza Aggiornamento |
|-------------------|--------------------------------------------|----------------------|-------------------------|
| Database          | `/backend/config/db.js`, `.env`            | DevOps               | Rara                    |
| Email             | `/backend/config/mail.js`, `.env`          | DevOps               | Al cambio provider      |
| JWT / Auth        | `.env`                                     | Admin / FullStack    | Iniziale / Periodica    |
| API Keys Esterne  | `.env`                                     | DevOps               | Quando rigenerate       |
| Pagamenti         | `.env`                                     | Finance / DevOps     | Rara / Mensile          |
| Audio / UI        | `/frontend/config/ui.js`                   | Frontend Dev         | Libera                  |

---

## 4. Sicurezza

- **MAI** fare il commit del file `.env` nel repository.
- **Rigenerare periodicamente** le chiavi JWT e le chiavi API.
- **Usare l'autenticazione a due fattori (2FA)** per tutti gli account dei provider di servizi (Google, Stripe, MongoDB Atlas, etc.).
- **Configurare regole di accesso IP (IP Whitelisting)** per il database MongoDB Atlas per limitare le connessioni.
- **Utilizzare un gestore di segreti centralizzato** in ambienti di produzione (es. AWS Secrets Manager, HashiCorp Vault, Vercel Environment Variables).

---

## 5. Backup e Ripristino

- **Backup Database:** Configurare backup automatici e giornalieri da MongoDB Atlas.
- **Salvataggio Segreti:** Conservare una copia sicura del file `.env` e di altre chiavi in un vault crittografato (es. 1Password, Bitwarden).
- **Annotazioni:**
  - **Ultimo backup DB:** _(da compilare)_
  - **Ultimo aggiornamento chiavi API:** _(da compilare)_
  - **Responsabile manutenzione sicurezza:** _(da compilare)_

---

⚙️ **Appendice**

🧩 Tutte le credenziali, chiavi e accessi per staff, admin e servizi esterni sono elencati in questa sezione. Qualsiasi modifica ai dati sensibili va effettuata solo da personale autorizzato, seguendo la tabella delle responsabilità.
