# 🚀 Ascension Auth - EGYSZERŰ Telepítés

## 📋 Előfeltételek

Mielőtt elkezded, ezekre lesz szükséged:
- **Node.js** (v16 vagy újabb) - [Letöltés](https://nodejs.org/)
- **XAMPP** vagy **WAMP** (MySQL szerverhez) - [XAMPP letöltés](https://www.apachefriends.org/)
- **Git** (ha GitHub-ról töltöd le) - [Letöltés](https://git-scm.com/)

## 🎯 GYORS START (3 lépés)

### 1️⃣ MySQL adatbázis létrehozása és beállítása

#### A) XAMPP telepítése és indítása

**Ha még nincs XAMPP telepítve:**
1. Töltsd le: https://www.apachefriends.org/
2. Telepítsd (csak MySQL kell, de Apache is hasznos)
3. Indítsd el az XAMPP Control Panel-t

**XAMPP indítása:**
- Indítsd el az XAMPP Control Panel-t
- Kattints a MySQL mellett lévó **Start** gombra
- Ha elindult, zöld háttér lesz
- ⚠️ Ha nem indul: Lehet hogy a 3306-os port foglalt (Skype, Discord bezárása segíthet)

#### B) Adatbázis létrehozása phpMyAdmin-ban

**phpMyAdmin megnyitása:**
- Nyisd meg: http://localhost/phpmyadmin
- Kattints az **SQL** fülre (felül, középen)
- Másold be a `database.sql` fájl **TELJES** tartalmát:

```sql
CREATE DATABASE IF NOT EXISTS ascension_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ascension_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Alkohol követési tábla
CREATE TABLE IF NOT EXISTS alcohol_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    drink_type VARCHAR(100) NOT NULL,
    amount_ml INT NOT NULL,
    alcohol_percentage DECIMAL(4,2) NOT NULL,
    calories INT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

- Kattints a **Végrehajtás** gombra (jobb alsó sarok, vagy "Go")
- ✅ Ha "Query OK" vagy zöld pipa jelenik meg → Sikeres!

#### C) Adatbázis ellenőrzése

**Ellenőrizd, hogy minden rendben van:**
1. phpMyAdmin bal oldali menüjében látszódjon: **ascension_db**
2. Kattints rá → Táblák listája:
   - ✅ `users` tábla (felhasználók)
   - ✅ `alcohol_entries` tábla (alkohol követés)

**Mit csinálnak ezek a táblák?**
- **`users`**: Tárolja a felhasználói fiókokat (username, email, jelszó hash)
- **`alcohol_entries`**: Menti az alkoholfogyasztás adatait (ital típusa, mennyiség, dátum)

#### D) Adatbázis kapcsolat beállítása

**Nyisd meg a `server.js` fájlt**, találd meg a 16-22. sort:

```javascript
const dbConfig = {
  host: 'localhost',        // MySQL szerver címe
  user: 'root',             // MySQL felhasználónév
  password: '',             // MySQL jelszó (XAMPP-ban alapból üres)
  database: 'ascension_db'  // Az adatbázis neve amit létrehoztál
};
```

**⚠️ FONTOS - Csapattársak számára:**
- **XAMPP használata esetén:** Ne változtass semmit! Az alapértelmezett beállítások jók.
- **Ha jelszót állítottál be a MySQL-hez:** Írd be a `password` mezőbe
- **Ha más felhasználónevet használsz:** Változtasd meg a `user` mezőt
- **Különböző adatbázis név:** Változtasd meg a `database` mezőt

**🔐 Biztonsági tipp production-höz:**
- Éles szerveren MINDIG legyen jelszó!
- Használj `.env` fájlt az érzékeny adatokhoz (ne commitold GitHubra!)

### 2️⃣ Backend indítása

**A) Projekt letöltése (ha még nem tetted):**

```bash
# GitHub-ról
git clone <repository-url>
cd Ascension-Backend

# Vagy ha ZIP-ből töltötted le
# Csomagold ki és lépj be a mappába
cd Ascension-Backend
```

**B) Node.js csomagok telepítése (első alkalommal):**

```bash
npm install
```

Ez telepíti a szükséges csomagokat:
- `express` - Web szerver
- `mysql2` - MySQL adatbázis kapcsolat
- `bcrypt` - Jelszó titkosítás
- `jsonwebtoken` - Bejelentkezési tokenek
- `cors` - Frontend-backend kommunikáció
- `multer` + `cloudinary` - Fájl feltöltés

**C) Backend indítása:**

```bash
npm start
```

**✅ Sikeres indítás így néz ki:**
```
✅ MySQL kapcsolat OK - Ascension adatbázis elérhető!
✅ Users tábla megtalálva
Backend fut: http://localhost:3000
```

**❌ Ha hiba van:**
- Ellenőrizd az XAMPP-ban MySQL elindult-e (zöld háttér)
- phpMyAdmin-ban létrehoztad az `ascension_db` adatbázist?
- A `users` és `alcohol_entries` táblák léteznek?
- Nem más program használja a 3000-es portot? (pl. másik Node szerver)
- A `server.js` fájlban jók az adatbázis beállítások? (16-22. sor)

**D) Adatbázis kapcsolat tesztelése:**

Ha a backend elindul, teszteld az adatbázis kapcsolatot:
1. Terminálban látod: "✅ MySQL kapcsolat OK"
2. Látod: "✅ Users tábla megtalálva"
3. Nem látod: "⚠️ A users tábla még nem létezik!" hibaüzenetet

### 3️⃣ Frontend használata

**A) Frontend indítása:**

Két lehetőség:
1. **Egyszerű módszer:** Dupla kattintás az `index.html` fájlra a `Ascension-Frontend-main/Ascension-Frontend-main/` mappában
2. **VS Code Live Server:** Jobb klikk az `index.html`-re → "Open with Live Server"

**B) Regisztráció és bejelentkezés tesztelése:**

1. Nyisd meg a weboldalt
2. Kattints a **Bejelentkezés** linkre (felül vagy jobb felső sarokban)
3. Válts a **Regisztráció** fülre
4. Hozz létre egy fiókot:
   - **Név:** Teszt User
   - **Email:** teszt@example.com
   - **Jelszó:** teszt123 (min. 6 karakter)
5. Kattints **Regisztráció** gombra
6. Ha sikeres: "Sikeres regisztráció!" üzenet jelenik meg
7. Próbálj bejelentkezni az új fiókkal

**C) Adatbázisban ellenőrzés:**

Menj vissza phpMyAdmin-ba:
1. Nyisd meg: http://localhost/phpmyadmin
2. Kattints az `ascension_db` adatbázisra
3. Kattints a `users` táblára
4. Látod a létrehozott felhasználót?
   - ✅ Igen → Minden működik!
   - ❌ Nem → Backend nem fut, vagy nincs kapcsolat az adatbázissal

**ENNYI! 🎉**

---

## 📊 Adatbázis struktúra részletesen

### `users` tábla
Tárolja a regisztrált felhasználókat.

| Mező | Típus | Leírás |
|------|-------|--------|
| `id` | INT (AUTO_INCREMENT) | Egyedi felhasználó azonosító |
| `username` | VARCHAR(50) UNIQUE | Felhasználónév (egyedi!) |
| `email` | VARCHAR(100) UNIQUE | Email cím (egyedi!) |
| `password_hash` | VARCHAR(255) | Titkosított jelszó (bcrypt) |
| `created_at` | TIMESTAMP | Regisztráció ideje |

**Fontos:**
- A jelszavak SOHA nem tárolódnak nyílt szövegben!
- A `bcrypt` hash algoritmus védi őket
- Az `email` és `username` mezők egyediek (nem lehet duplikáció)

### `alcohol_entries` tábla
Alkohol fogyasztás követéséhez.

| Mező | Típus | Leírás |
|------|-------|--------|
| `id` | INT (AUTO_INCREMENT) | Egyedi bejegyzés azonosító |
| `user_id` | INT | Melyik userhez tartozik (kapcsolat a `users` táblával) |
| `drink_type` | VARCHAR(100) | Ital típusa (pl. "Sör", "Bor") |
| `amount_ml` | INT | Mennyiség milliliterben |
| `alcohol_percentage` | DECIMAL(4,2) | Alkohol % (pl. 5.00) |
| `calories` | INT | Kalória tartalom |
| `date` | DATE | Fogyasztás dátuma |
| `created_at` | TIMESTAMP | Bejegyzés létrehozása |

**FOREIGN KEY kapcsolat:**
- `user_id` → `users.id`: Ha törlödsz egy felhasználót, az összes alkohol bejegyzése is törlődik (`ON DELETE CASCADE`)

---

## 🔧 Hibaelhárítás

### "MySQL kapcsolat HIBA"
✅ **Megoldás:**
1. XAMPP-ban indítsd el a MySQL-t (zöld háttér)
2. phpMyAdmin-ban futtasd le a `database.sql`-t
3. Ellenőrizd a `server.js` 18-22. sorában az adatokat

### "Nem lehet kapcsolódni a backend-hez"
✅ **Megoldás:**
1. Backend fut? Terminálban látod: "Backend fut: http://localhost:3000"
2. Újraindítás: `npm start`

### "Ez az email már foglalt"
✅ **Ez normális!** Használj másik emailt vagy felhasználónevet

### Port 3000 foglalt
✅ **Megoldás:** Változtasd meg a portot a `server.js` legaljában:
```javascript
app.listen(4000, () => {  // 3000 helyett 4000
```
És az `auth.js` 3. sorában:
```javascript
const API_URL = 'http://localhost:4000/api/auth';  // 3000 helyett 4000
```
