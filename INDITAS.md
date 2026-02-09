# 🚀 ASCENSION - Indítási Útmutató

## 📁 Projekt Struktúra (RENDEZVE!)

```
Ascension-Backend/
├── server.js              ← Backend szerver (Node.js + Express)
├── database.sql           ← MySQL adatbázis séma
├── package.json           ← Függőségek
├── .env                   ← API kulcsok
├── uploads/               ← Feltöltött képek
└── Ascension-Frontend-main/
    ├── index.html         ← Főoldal
    ├── assets/            ← CSS, JS, képek, videók
    │   ├── css/
    │   ├── js/
    │   ├── img/
    │   ├── audio/
    │   └── video/
    └── oldalak/           ← Aloldalak
        ├── main.html
        ├── Bejelentkezes.html
        └── menupontok/
```

## ⚙️ 1. LÉPÉS: MySQL Adatbázis Beállítása

### XAMPP/WAMP indítása:
1. Indítsd el a **XAMPP Control Panel**-t
2. Indítsd el az **Apache** és **MySQL** szervereket

### Adatbázis létrehozása:
1. Nyisd meg: `http://localhost/phpmyadmin`
2. Kattints **"New"** vagy **"Új"** gombra
3. Adatbázis neve: `ascension_db`
4. Kódolás: `utf8mb4_general_ci`
5. Kattints **"Create"**

### Táblák létrehozása:
1. Válaszd ki az `ascension_db` adatbázist
2. Kattints a **"SQL"** tabra
3. Másold be a `database.sql` tartalmát
4. Kattints **"Go"** vagy **"Mehet"**

## 🖥️ 2. LÉPÉS: Backend Indítása

```bash
cd C:\Users\kismu\Ascension-Backend
npm install
npm start
```

### ✅ Sikeres indítás jele:
```
✅ MySQL kapcsolat OK - Ascension adatbázis elérhető!
✅ Users tábla megtalálva
🚀 Backend fut: http://localhost:3000
```

### ❌ Hiba esetén:
- Ellenőrizd hogy MySQL fut-e (XAMPP/WAMP)
- Lefuttattad a `database.sql`-t?
- `server.js` 18-22. sor: MySQL adatok helyesek?

## 🌐 3. LÉPÉS: Frontend Megnyitása

### Live Server (VSCode):
1. Telepítsd a **Live Server** extensiont
2. Jobb klikk az `Ascension-Frontend-main/index.html` fájlra
3. **"Open with Live Server"**

### XAMPP:
1. Másold a `Ascension-Frontend-main` mappát ide: `C:\xampp\htdocs\`
2. Nyisd meg: `http://localhost/Ascension-Frontend-main/index.html`

## 🎯 4. TESZTELÉS

1. **Főoldal**: Működik a videó? ✓
2. **Bejelentkezés gomb**: Modal megnyílik? ✓
3. **Regisztráció**: Új felhasználó létrehozása ✓
4. **Bejelentkezés**: Token mentése, átirányítás ✓
5. **Main oldal**: Napi feladatok mentése ✓

## 🔧 API Végpontok

- **POST** `/api/auth/register` - Regisztráció
- **POST** `/api/auth/login` - Bejelentkezés
- **POST** `/api/skin-analyze` - Arc elemzés (YouCam AI)
- **POST** `/api/food-analyze` - Étel elemzés (USDA)

## 📦 Függőségek

- **Backend**: Express, MySQL2, Bcrypt, JWT, Cloudinary, Multer
- **Frontend**: Vanilla JS, CSS3, HTML5

## 🎨 Funkciók

✅ Bejelentkezés/Regisztráció rendszer
✅ JWT token alapú hitelesítés
✅ Arc elemzés AI-val (YouCam)
✅ Étel kalória számítás (USDA API)
✅ Napi feladatok nyomonkövetése
✅ Responsív design

## 🐛 Gyakori Hibák

### "MySQL kapcsolat HIBA"
→ XAMPP MySQL fut? Adatbázis létrehozva?

### "users tábla nem létezik"
→ Futtasd le a `database.sql`-t!

### "Cannot find module"
→ `npm install` újra

### Frontend nem tölt be CSS/JS
→ Ellenőrizd az útvonalakat (`assets/css/style.css`)

---

**Készítette:** AI Assistant  
**Dátum:** 2026-02-09  
**Status:** ✅ MŰKÖDIK
