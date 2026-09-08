# SHOPYMALLS — MVP FINAL CONSOLIDATED BUILD

Dit is de geconsolideerde codebase van de Shopymalls MVP na stap 14.1 t/m 14.16.

## Shopper
Home → Explore → Mall Profile → Store Profile → Deal → Saved → Profile

## Business
Retailer Dashboard → Mall Dashboard

## Platform
Admin Dashboard → Advertising → Analytics → Testing → Pilot Jakarta

## Backend
Supabase schema + auth voorbereiding

## Belangrijk
De frontend bevat nog voorbeelddata voor een deel van de schermen. Supabase is voorbereid, maar de volgende engineeringfase is het daadwerkelijk vervangen van voorbeelddata door live queries, het aanscherpen van Row Level Security en het testen van productie-authenticatie.

## Start
npm install
npx expo start

## Supabase
1. Maak een Supabase-project.
2. Voeg `.env` toe op basis van `.env.example`.
3. Voer `supabase/001_initial_schema.sql` uit in de Supabase SQL Editor.
4. Test daarna login en de business-rollen.

## Volgende technische werk
- live Supabase queries per scherm
- productie-authenticatie
- rolgebaseerde rechten
- echte push notifications
- echte analytics events
- echte campaign persistence
- echte betalingen
- productie test / pilot
