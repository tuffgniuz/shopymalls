# Shopymalls — Stap 14.12 Login & Accounts

Toegevoegd:
- Supabase email/password login
- Account registreren
- Rolkeuze: Shopper / Retailer / Mall
- Session herstel bij app-start
- Uitloggen
- Basis voorbereiding voor Google login

Vereist:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY

Start:
npm install
npx expo start

Let op: social/Apple login en server-side rolbeveiliging worden verder aangescherpt in volgende stappen.

Klaar. 🚀 Stap 14.12 — Login & Accounts is nu toegevoegd.

De app heeft nu een echte accountlaag voorbereid met:

🔐 Inloggen
E-mail
Wachtwoord
Supabase Authentication
Sessie blijft behouden bij opnieuw openen
👤 Account aanmaken

De gebruiker kiest:

Shopper
Retailer
Mall

En vult naam, e-mail en wachtwoord in.

🔄 Accountflow

Open Shopymalls
→ Login / Account maken
→ Supabase-authenticatie
→ Persoonlijke appomgeving

Daarnaast is uitloggen toegevoegd en is de basis voorbereid voor Google-login.
