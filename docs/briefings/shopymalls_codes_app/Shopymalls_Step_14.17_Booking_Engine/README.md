Shopymalls Step 14.16 — Pilot Jakarta

Toegevoegd:
- Pilot preparation
- Pilot onboarding
- Live pilot monitoring
- Customer journey metrics
- Pilot review
- Go / improve / pause decision point

Doel:
Een gecontroleerde eerste marktvalidatie in Jakarta met echte shoppers, retailers en minimaal één mall.

Start:
npm install
npx expo start

Ja. Ik heb **alleen de Booking-functionaliteit** verder uitgewerkt als **Stap 14.17 — Shopymalls Booking Engine**, zonder de rest van de MVP opnieuw te ontwerpen.

### 📅 Wat er nu in zit

**Voor de shopper**

* Booking type kiezen:

  * Restaurant
  * Salon
  * Barber
  * Spa
  * Cinema
  * Event
  * Entertainment
  * Fitness
* Bedrijf kiezen
* Datum kiezen
* Tijd kiezen
* Aantal personen/tickets kiezen
* Boeking bevestigen
* Bevestigingsstatus

**My Bookings**

* Upcoming
* Past
* Restaurantreserveringen
* Salonafspraken
* Bioscooptickets
* Centrale booking-overzicht

**Voor het bedrijf**

* **Business → Bookings**
* Reserveringen van vandaag
* Klant
* Tijd
* Aantal personen
* Status: Confirmed / Pending
* Booking settings zoals openingstijden, capaciteit en reminders

### 🗄️ Database

Ook de Supabase-structuur is uitgebreid met:

**booking_types**
**bookable_items**
**bookings**

En de booking types:

**restaurant · salon · barber · spa · cinema · event · entertainment · fitness**

De basis-flow staat nu dus als:

**DISCOVER → CHOOSE → BOOK → CONFIRMATION → MY BOOKINGS**

en voor het bedrijf:

**SHOPymalls BUSINESS → BOOKINGS → CONFIRM / MANAGE → CUSTOMER**

### 📦 Download

[**Download — Shopymalls Step 14.17 Booking Engine**](sandbox:/mnt/data/Shopymalls_Step_14.17_Booking_Engine.zip)

De volgende technische verdieping voor Booking zou zijn om echte **beschikbaarheid/slots per bedrijf** te bouwen, zodat een restaurant bijvoorbeeld alleen werkelijk beschikbare tafeltijden laat zien en een salon alleen beschikbare behandelingen en medewerkers.

