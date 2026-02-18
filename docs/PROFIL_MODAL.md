# 📊 PROFIL MODAL - Dokumentáció

## ✅ IMPLEMENTÁLT FUNKCIÓ

Amikor a bejelentkezett felhasználó a nevére kattint (jobb felső sarok), megnyílik egy **profil modal**, amely megjeleníti:
- Felhasználói alapadatokat
- Alkoholfogyasztás statisztikákat
- Legutóbbi 5 bejegyzést
- Kijelentkezés gombot

---

## 🎯 FUNKCIÓK

### 1. **Felhasználói Adatok**
- **Username** - Felhasználónév
- **Email** - Email cím
- **Regisztráció dátuma** - Mikor csatlakozott

### 2. **Alkohol Statisztikák** (3 kártya grid-ben)

#### 🗓️ Ez a hét
- Teljes mennyiség (ml)
- Bejegyzések száma
- Összes kalória

#### 📅 Ez a hónap
- Teljes mennyiség (ml)
- Bejegyzések száma
- Összes kalória

#### 🏆 Összesen
- Teljes mennyiség (ml)
- Bejegyzések száma
- Összes kalória
- Átlagos alkohol százalék

### 3. **Legutóbbi 5 Bejegyzés**
Minden bejegyzésnél megjelenik:
- Ital típusa (pl. "Sör", "Bor")
- Mennyiség (ml)
- Alkohol százalék
- Kalóriák
- Dátum

### 4. **Kijelentkezés Gomb**
- Piros színű, alul elhelyezve
- Megerősítést kér kijelentkezés előtt

---

## 🔧 BACKEND IMPLEMENTÁCIÓ

### Új Endpoint: `GET /api/profile`

**URL:** `http://localhost:3000/api/profile`

**Authentikáció:** Bearer Token (JWT)

**Válasz JSON struktúra:**
```json
{
  "success": true,
  "profile": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2026-02-15T10:30:00.000Z"
    },
    "stats": {
      "week": {
        "entries": 3,
        "totalMl": 1500,
        "totalCalories": 750
      },
      "month": {
        "entries": 10,
        "totalMl": 5000,
        "totalCalories": 2500
      },
      "total": {
        "entries": 25,
        "totalMl": 12500,
        "totalCalories": 6250,
        "avgAlcoholPercentage": "4.8"
      }
    },
    "recentEntries": [
      {
        "id": 15,
        "drinkType": "Sör",
        "amountMl": 500,
        "alcoholPercentage": 4.5,
        "calories": 250,
        "date": "2026-02-18",
        "createdAt": "2026-02-18T18:30:00.000Z"
      }
      // ... további 4 bejegyzés
    ]
  }
}
```

### SQL Lekérdezések

#### Heti statisztika
```sql
SELECT 
  COUNT(*) as entries,
  COALESCE(SUM(amount_ml), 0) as total_ml,
  COALESCE(SUM(calories), 0) as total_calories
FROM alcohol_entries 
WHERE user_id = ? 
AND YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)
```

#### Havi statisztika
```sql
SELECT 
  COUNT(*) as entries,
  COALESCE(SUM(amount_ml), 0) as total_ml,
  COALESCE(SUM(calories), 0) as total_calories
FROM alcohol_entries 
WHERE user_id = ? 
AND YEAR(date) = YEAR(CURDATE())
AND MONTH(date) = MONTH(CURDATE())
```

#### Összes statisztika
```sql
SELECT 
  COUNT(*) as entries,
  COALESCE(SUM(amount_ml), 0) as total_ml,
  COALESCE(SUM(calories), 0) as total_calories,
  COALESCE(AVG(alcohol_percentage), 0) as avg_alcohol_percentage
FROM alcohol_entries 
WHERE user_id = ?
```

#### Legutóbbi 5 bejegyzés
```sql
SELECT 
  id, drink_type, amount_ml, 
  alcohol_percentage, calories, 
  date, created_at
FROM alcohol_entries 
WHERE user_id = ?
ORDER BY date DESC, created_at DESC
LIMIT 5
```

---

## 💻 FRONTEND IMPLEMENTÁCIÓ

### JavaScript Funkciók (auth.js)

#### `openProfileModal()`
- Megnyitja a profil modal-t
- Meghívja a `fetchProfileData()` függvényt

#### `fetchProfileData()`
- Lekéri a profil adatokat a backend-től
- Bearer token-nel authentikál
- Meghívja a `displayProfileData()` függvényt

#### `displayProfileData(profile)`
- Dinamikusan generálja a HTML-t
- Felhasználói adatok section
- 3 statisztika kártya (grid layout)
- Legutóbbi bejegyzések lista

### HTML Struktúra

**index.html és main.html:**
```html
<div id="profile-modal" class="auth-modal">
  <div class="auth-modal-content profile-modal-content">
    <button class="auth-close profile-close">×</button>
    <h2>Profilom</h2>
    <div id="profile-content">
      <!-- Dinamikus tartalom -->
    </div>
    <button id="logout-btn" class="logout-btn">Kijelentkezés</button>
  </div>
</div>
```

### CSS Osztályok

- `.profile-modal-content` - Nagyobb width (700px), scrollozható
- `.profile-section` - Section konténer
- `.stats-grid` - 3 oszlopos grid (CSS Grid)
- `.stat-card` - Statisztika kártya hover effekttel
- `.entries-list` - Bejegyzések lista
- `.entry-item` - Egyedi bejegyzés
- `.logout-btn` - Piros kijelentkezés gomb

---

## 🎨 DIZÁJN JELLEMZŐK

### Színpaletta
- **Háttér:** Sötét (charcoal #2B2B2B, graphite #1F2022)
- **Szöveg:** Fehér (#f5f5f5), szürke (#bdbdbd)
- **Accent:** Narancssárga (index.html) / Arany (main.html)
- **Logout:** Piros (rgb(220,53,69))

### Animációk
- **Modal megnyitás:** slideUp animáció
- **Stat card hover:** translateY(-3px) + glow effekt
- **Entry hover:** translateX(5px)

### Reszponzív
- **Desktop:** 3 oszlopos stats grid
- **Mobil (<768px):** 1 oszlopos stats grid

---

## 🚀 HASZNÁLAT

### 1. Bejelentkezés után
```
1. Kattints a nevedre (jobb felső sarok)
2. Profil modal megnyílik
3. Statisztikák betöltése (~1s)
```

### 2. Modal bezárása
```
- X gomb (jobb felső sarok)
- Háttérre kattintás
- ESC billentyű
```

### 3. Kijelentkezés
```
1. Kattints a "Kijelentkezés" gombra
2. Megerősítés: "Biztosan ki szeretnél jelentkezni?"
3. localStorage törlése
4. Oldal újratöltése
```

---

## 🔒 BIZTONSÁG

- **JWT Token:** Minden API hívás Bearer token-nel authentikál
- **User ID:** A backend a token-ből azonosítja a felhasználót
- **SQL Injection védelem:** Prepared statements használata
- **Hibakezelés:** Hibaüzenetek megjelenítése

---

## 📝 PÉLDA HASZNÁLAT

### Tesztelés lépései:

1. **Backend indítása:**
   ```bash
   cd Ascension-Backend
   npm start
   ```

2. **Frontend megnyitása:**
   - Nyisd meg: `index.html` vagy `main.html`

3. **Bejelentkezés:**
   - Kattints a "Bejelentkezés" gombra
   - Add meg az email/username és jelszót
   - Sikeres bejelentkezés után a neved jelenik meg

4. **Profil megnyitása:**
   - Kattints a nevedre (jobb felső sarok)
   - Profil modal megnyílik

5. **Alkohol bejegyzés hozzáadása (Test.html):**
   - Menj a Test oldalra
   - Add hozzá alkohol bejegyzést
   - Térj vissza és nyisd meg a profilt újra
   - Az új statisztikák láthatóak

---

## 🐛 HIBAKEZELÉS

### Ha nincs adat:
```
"Még nincsenek bejegyzések."
```

### Ha a backend nem elérhető:
```
"❌ Nem lehet kapcsolódni a szerverhez!
Ellenőrizd, hogy a backend fut-e."
```

### Ha nincs token:
```
"❌ Nincs bejelentkezve!"
```

---

## 📊 ADATBÁZIS KÖVETELMÉNYEK

A funkcióhoz szükséges táblák:

### `users`
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `alcohol_entries`
```sql
CREATE TABLE alcohol_entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  drink_type VARCHAR(255) NOT NULL,
  amount_ml INT NOT NULL,
  alcohol_percentage DECIMAL(5,2) NOT NULL,
  calories INT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## ✅ ELLENŐRZŐ LISTA

- [x] Backend endpoint létrehozva (`/api/profile`)
- [x] JWT authentikáció implementálva
- [x] SQL lekérdezések optimalizálva
- [x] Frontend HTML struktúra (index.html, main.html)
- [x] JavaScript funkciók (auth.js)
- [x] CSS stílusok (style.css, main_style.css)
- [x] Profil modal megnyitás/bezárás
- [x] Adatok dinamikus megjelenítése
- [x] Kijelentkezés funkció
- [x] Hibakezelés
- [x] Reszponzív design
- [x] Animációk és hover effektek

---

## 🎉 KÉSZ!

A profil megtekintési funkció teljes mértékben implementálva és működőképes!

**Készítette:** GitHub Copilot  
**Dátum:** 2026-02-18
