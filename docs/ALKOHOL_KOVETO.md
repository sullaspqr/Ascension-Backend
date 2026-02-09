# Alkohol Követő - Telepítési és Használati Útmutató

## 🍺 Mi változott?

Az Ascension alkalmazáshoz hozzáadtunk egy **Alkohol Követő** funkciót, amely lehetővé teszi:
- Alkoholos italok rögzítését
- Kalória és alkohol % követését
- Napi statisztikák megtekintését
- Előre definiált ital típusok vagy egyéni bejegyzések használatát

---

## 📦 Telepítési lépések

### 1. Adatbázis frissítése

Nyisd meg a **phpMyAdmin**-t (http://localhost/phpmyadmin) és:

1. Válaszd ki az `ascension_db` adatbázist
2. Kattints az **SQL** fülre
3. Másold be és futtasd le a következő parancsot:

```sql
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

4. Kattints a **Végrehajtás** gombra

✅ Az adatbázis most már tartalmazza az `alcohol_entries` táblát!

### 2. Backend újraindítása

A backend automatikusan tartalmazza az új végpontokat. Csak újra kell indítani:

1. Nyomj `Ctrl+C`-t a backend terminálban (ha fut)
2. Indítsd újra: `npm start` vagy `node server.js`

### 3. Frontend ellenőrzése

Az új funkció automatikusan megjelenik a **Test** oldalon. Nem kell újraindítani semmit!

---

## 🎯 Használat

### Alkohol bejegyzés hozzáadása

1. **Jelentkezz be** az alkalmazásba
2. Menj a **Test** oldalra
3. Görgess le az **Alkohol Követő 🍺** szekcióhoz
4. Válassz egy ital típust a legördülő menüből:
   - Sör (0.5L) - 5%
   - Bor (1dl) - 12%
   - Vodka (4cl) - 40%
   - ...és még sok más!
5. Vagy válaszd az **Egyéni...** opciót saját ital hozzáadásához
6. Válaszd ki a dátumot
7. Kattints a **Hozzáadás** gombra

### Egyéni ital hozzáadása

Ha az **Egyéni...** opciót választod:
1. Add meg az ital nevét (pl. "Mojito")
2. Add meg a mennyiséget ml-ben (pl. 250)
3. Add meg az alkohol százalékot (pl. 12.5)
4. A kalóriát automatikusan kiszámítja a rendszer!

### Statisztikák megtekintése

A napi összesítés automatikusan frissül:
- **Mennyiség**: Összesen elfogyasztott ml
- **Kalória**: Összesen felvett kalória az alkoholból
- **Italok száma**: Hány italt rögzítettél ma

### Bejegyzés törlése

Minden bejegyzés mellett van egy **🗑️** gomb, amivel törölheted azt.

---

## 🔧 Backend API végpontok

Az új végpontok (authentikációval védve):

### 1. Alkohol bejegyzés hozzáadása
```
POST /api/alcohol/add
Authorization: Bearer <token>
Body: {
  "drinkType": "Sör (0.5L)",
  "amountMl": 500,
  "alcoholPercentage": 5,
  "calories": 215,
  "date": "2026-02-09"
}
```

### 2. Bejegyzések lekérése
```
GET /api/alcohol/entries?date=2026-02-09
Authorization: Bearer <token>
```

### 3. Bejegyzés törlése
```
DELETE /api/alcohol/:id
Authorization: Bearer <token>
```

### 4. Statisztikák
```
GET /api/alcohol/stats?startDate=2026-02-01&endDate=2026-02-09
Authorization: Bearer <token>
```

---

## 🍻 Előre beállított italok

| Ital | Mennyiség | Alkohol % | Kalória |
|------|-----------|-----------|---------|
| Sör | 500 ml | 5% | 215 kcal |
| Bor | 100 ml | 12% | 85 kcal |
| Pezsgő | 100 ml | 12% | 90 kcal |
| Vodka | 40 ml | 40% | 90 kcal |
| Whisky | 40 ml | 40% | 90 kcal |
| Rum | 40 ml | 40% | 90 kcal |
| Gin | 40 ml | 40% | 90 kcal |
| Pálinka | 50 ml | 40% | 112 kcal |

---

## ⚠️ Fontos tudnivalók

1. **Be kell jelentkezned** az alkohol követés használatához!
2. Az adatok **felhasználónként** elkülönülnek
3. A kalória számítás az alkohol energiatartalmán alapul (7 kcal/g)
4. Az egyéni italok kalóriája automatikusan kiszámolódik

---

## 🐛 Hibaelhárítás

### "Token hiányzik" hiba
➡️ Jelentkezz be újra az alkalmazásba

### "Adatbázis kapcsolat nincs"
➡️ Ellenőrizd, hogy:
- XAMPP/WAMP fut-e
- MySQL szolgáltatás aktív-e
- Az `alcohol_entries` tábla létrejött-e

### Nem jelenik meg az alkohol szekció
➡️ Frissítsd az oldalt (F5) vagy töröld a böngésző cache-t

---

## 🎉 Készen vagy!

Most már követheted az alkohol fogyasztásodat és pontosan láthatod, mennyi kalóriát veszel fel belőle! 🍺

**Felelős fogyasztás!** 😊
