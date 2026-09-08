# Shopymalls — Stap 14.11 Supabase

De app is voorbereid op een echte Supabase-backend.

## 1. Supabase-project maken
Maak een Supabase-project aan en kopieer:
- Project URL
- anon public key

## 2. Database
Open in Supabase:
SQL Editor → New query

Voer `supabase/001_initial_schema.sql` volledig uit.

## 3. Environment
Kopieer `.env.example` naar `.env` en vul de twee Supabase-waarden in.

## 4. Installeren
npm install
npx expo start

## Wat is nu voorbereid?
- profiles
- malls
- stores
- store_staff
- products
- deals
- deal_products
- events
- favorites
- campaigns
- advertisements
- notifications
- subscriptions
- payments
- analytics_events

De app gebruikt in deze stap nog voorbeelddata. De volgende stap is 14.12: login & accounts en daarna vervangen we de voorbeelddata scherm voor scherm door Supabase-data.

Klaar. 🚀 We zijn nu bij Stap 14.11 — Supabase Database.

Ik heb de app voorbereid op een echte backend.

🗄️ Database-structuur

De Supabase-database bevat nu de basis voor:

Users / Profiles
Malls
Stores
Store Staff
Products
Deals
Deal Products
Events
Favorites
Campaigns
Advertisements
Notifications
Subscriptions
Payments
Analytics Events

Ook zijn de eerste Row Level Security-regels toegevoegd, zodat gebruikers niet zomaar elkaars persoonlijke gegevens kunnen beheren.

Belangrijk

De app werkt op dit moment nog met de voorbeelddata die we eerder hebben gebouwd. In deze stap heb ik de backendstructuur klaargezet, zodat we deze daarna scherm voor scherm kunnen aansluiten.

In het pakket zit:

supabase/001_initial_schema.sql

Daarmee kun je de volledige database in Supabase aanmaken.

Ook zit er een .env.example in voor de Supabase URL en anon key.


