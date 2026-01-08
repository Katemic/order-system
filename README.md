# Digitalt Bestillings- og Produktionssystem

Dette projekt er udviklet som en del af hovedopgaven på Datamatikeruddannelsen.  
Formålet med systemet er at erstatte et papirbaseret bestillingsflow med et digitalt system, der giver bedre overblik, færre fejl og mere effektiv håndtering af bestillinger i en travl hverdag.

Systemet er målrettet en produktionsvirksomhed (fx bager/konditor) og understøtter både bestilling, produkttilpasninger og produktionsoverblik.

---

## Formål og problemstilling

Virksomheden håndterede tidligere bestillinger manuelt via papir, hvilket medførte:
- Manglende overblik over dagens produktion
- Risiko for fejl og misforståelser

Dette projekt adresserer disse udfordringer ved at:
- Digitalisere bestillingsprocessen
- Skabe et samlet overblik over produktion og leverancer
- Understøtte produktspecifikke tilpasninger (customizations)

---

## Teknologier

Projektet er bygget med følgende teknologier:

- **Next.js (App Router)** – frontend og server-side rendering
- **React** – komponentbaseret UI
- **Server Components & Server Actions**
- **PostgreSQL** 
- **Tailwind CSS** – styling
- **TypeScript**

---

## Centrale funktioner

- Oprettelse og visning af bestillinger
- Filtrering af bestillinger (dato, type, produktion)
- Produktspecifikke tilpasninger (customizations)
- Produktionsoverblik opdelt i kategorier (fx bager/konditor)
- Print af bestillinger
- Brugervenligt interface til daglig drift

---

## Brugerroller

Systemet er primært målrettet:
- Medarbejdere i produktionen
- Frontpersonale der opretter bestillinger
- Ansvarlige der har behov for overblik og planlægning

---

## Installation og kørsel lokalt

```bash
# Installer afhængigheder
npm install

# Kør projektet i udvikling
npm run dev

# Kør projektet i test mode
npm run dev:test


## English Summary

This project was developed as a final exam project.
It demonstrates the use of Next.js App Router, server-side rendering and modern
web architecture in a real-world business case.