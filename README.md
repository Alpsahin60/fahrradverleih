# 🚴 Fahrradverleih Verwaltungssystem

Ein modernes Verwaltungssystem für Fahrradverleih-Unternehmen, entwickelt als Abschlussprojekt.

## 📋 Funktionen

### 🚲 Fahrraderverwaltung
- Fahrräder hinzufügen, bearbeiten und löschen
- Übersicht aller Fahrräder mit Status (verfügbar/verliehen)
- Detaillierte Informationen: Name, Hersteller, Zustand

### 🎯 Ausleihverwaltung
- Neue Ausleihen erstellen
- Kundendaten erfassen (Name, Adresse, Kontaktdaten)
- Fahrräder zurücknehmen
- Übersicht aller aktiven und vergangenen Ausleihen

### 📊 Status & Übersicht
- Dashboard mit Gesamtübersicht
- Filter für aktive/zurückgegebene Ausleihen
- Echtzeit-Status aller Fahrräder

## 🛠 Technologie-Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Datenbank**: MySQL
- **ORM**: Prisma
- **Entwicklung**: VS Code, DBeaver

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js (LTS Version)
- MySQL Server
- Git

### Installation

1. Repository klonen:
```bash
git clone [repository-url]
cd fahrradverleih
```

2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen konfigurieren:
```bash
# .env Datei erstellen und MySQL-Verbindung eintragen
DATABASE_URL="mysql://root:password@localhost:3306/fahrradverleih"
```

4. Datenbank einrichten:
```bash
# Datenbank erstellen
CREATE DATABASE fahrradverleih CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Prisma Schema anwenden
npx prisma db push
npx prisma generate
```

5. Entwicklungsserver starten:
```bash
npm run dev
```

Die Anwendung ist unter `http://localhost:3000` verfügbar.

## 📊 Datenmodell

### Fahrrad
- ID (eindeutig)
- Name/Modell
- Hersteller
- Status (FREI/BELEGT)
- Zustand
- Timestamps

### Ausleihe
- ID (eindeutig)
- Fahrrad-Referenz
- Kunde (Name, Adresse, PLZ, Ort)
- Kontaktdaten (Telefon, E-Mail)
- Ausweis-/Reisepassnummer
- Status (AKTIV/ZURUECKGEGEBEN)
- Timestamps

## 🎨 Features

- ✅ Responsive Design (Desktop & Mobile)
- ✅ Intuitive Benutzeroberfläche
- ✅ Echtzeit-Datenaktualisierung
- ✅ Vollständige CRUD-Operationen
- ✅ Eingabevalidierung
- ✅ Statusverfolgung
- ✅ Suchfilter

## 📝 Projektstruktur

```
src/
├── app/
│   ├── api/           # API Routes
│   ├── layout.tsx     # Layout-Komponente
│   └── page.tsx       # Hauptseite
├── components/        # React-Komponenten
│   ├── FahrradListe.tsx
│   ├── FahrradForm.tsx
│   ├── AusleiheListe.tsx
│   └── AusleiheForm.tsx
├── lib/
│   └── prisma.ts      # Datenbankverbindung
└── prisma/
    └── schema.prisma  # Datenbankschema
```

## 🔧 API Endpoints

- `GET /api/fahrraeder` - Alle Fahrräder abrufen
- `POST /api/fahrraeder` - Neues Fahrrad erstellen
- `PUT /api/fahrraeder/[id]` - Fahrrad aktualisieren
- `DELETE /api/fahrraeder/[id]` - Fahrrad löschen
- `GET /api/ausleihen` - Alle Ausleihen abrufen
- `POST /api/ausleihen` - Neue Ausleihe erstellen
- `PUT /api/ausleihen/[id]/zurueckgeben` - Fahrrad zurückgeben

## 🎓 Abschlussprojekt

Dieses Projekt wurde als Abschlussprojekt entwickelt und demonstriert:

- Moderne Webentwicklung mit React/Next.js
- Datenbankdesign und -integration
- RESTful API-Entwicklung
- Responsive UI/UX Design
- Vollständiger CRUD-Workflow
- Professionelle Projektstruktur

## 📄 Lizenz

Entwickelt als Bildungsprojekt.

---

**Entwickelt von**: [Ihr Name]  
**Datum**: Juli 2025
