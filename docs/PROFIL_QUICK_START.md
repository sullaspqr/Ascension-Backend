# 🚀 PROFIL FUNKCIÓ - GYORS ÚTMUTATÓ

## ⚡ GYORS START

### 1️⃣ Backend Indítása
```bash
cd Ascension-Backend
npm start
```
**Várj az üzenetre:** `✅ MySQL kapcsolat OK - Ascension adatbázis elérhető!`

---

### 2️⃣ Frontend Megnyitása
Nyisd meg böngészőben:
- **Főoldal:** `Ascension-Frontend-main/index.html`
- **Main oldal:** `Ascension-Frontend-main/oldalak/main.html`

---

### 3️⃣ Bejelentkezés
1. Kattints a **"Bejelentkezés"** gombra (jobb felső sarok)
2. Ha nincs fiókod, váltsd át **"Regisztráció"** tab-ra
3. Add meg az adatokat és kattints **"Regisztráció"**
4. Sikeres bejelentkezés után a **neved jelenik meg** a gomb helyén

---

### 4️⃣ Profil Megnyitása
1. Kattints a **nevedre** (jobb felső sarok)
2. A profil modal **automatikusan megnyílik**
3. Pár másodperc múlva megjelennek az adatok:
   - 👤 Felhasználói adatok
   - 📊 Statisztikák (heti, havi, összes)
   - 🍺 Legutóbbi bejegyzések

---

### 5️⃣ Kijelentkezés
1. Görgess le a profil modal alján található **"Kijelentkezés"** gombhoz
2. Kattints rá
3. Erősítsd meg: **"Biztosan ki szeretnél jelentkezni?"**
4. Sikeres kijelentkezés!

---

## 🎯 FUNKCIÓ KIPRÓBÁLÁSA

### Alkohol Bejegyzés Hozzáadása
1. Menj a **Test.html** oldalra (menü: Test)
2. Görgess le az **"Alkohol Tracking"** szekcióhoz
3. Töltsd ki az űrlapot:
   - **Ital típusa:** pl. "Sör"
   - **Mennyiség (ml):** pl. 500
   - **Alkohol %:** pl. 4.5
   - **Dátum:** válassz egy dátumot
4. Kattints **"Bejegyzés hozzáadása"**
5. Sikeres mentés után:
   - Térj vissza a főoldalra
   - Nyisd meg a **profilt újra**
   - Az új statisztikák **frissültek**! ✨

---

## 📊 MIT LÁTSZ A PROFILBAN?

### 1. Felhasználói Adatok
```
👤 Felhasználói adatok
Felhasználónév: testuser
E-mail: test@example.com
Regisztráció dátuma: 2026. február 15.
```

### 2. Statisztikák (3 kártya)

#### 🗓️ Ez a hét
```
1500 ml
3 bejegyzés
750 kalória
```

#### 📅 Ez a hónap
```
5000 ml
10 bejegyzés
2500 kalória
```

#### 🏆 Összesen
```
12500 ml
25 bejegyzés
6250 kalória
Átlag: 4.8% alkohol
```

### 3. Legutóbbi 5 Bejegyzés
```
🍷 Sör                           febr. 18
500 ml    4.5%    250 kcal

🍷 Bor                           febr. 17
200 ml    12%     160 kcal

... (max 5 bejegyzés)
```

---

## 🎨 VIZUÁLIS ELEMEK

### Hover Effektek
- **Stat kártyák:** Felemeléd, narancssárga/arany glow
- **Bejegyzések:** Jobbra csúszás, narancssárga/arany border
- **Logout gomb:** Felemelés, erősebb piros glow

### Színek
- **index.html:** Narancssárga accent 🟠
- **main.html:** Arany accent 🟡
- **Logout gomb:** Piros 🔴

---

## 🐛 HIBAELHÁRÍTÁS

### "Profil betöltése..." üzenet marad
**Probléma:** Backend nem elérhető
**Megoldás:**
1. Ellenőrizd: Backend fut? (`npm start`)
2. Ellenőrizd: Port 3000 szabad?
3. Nézd meg a konzolt (F12) hibaüzenetekért

---

### "❌ Nem lehet kapcsolódni a szerverhez!"
**Probléma:** Hálózati hiba vagy backend nem fut
**Megoldás:**
1. Indítsd újra a backend-et
2. Ellenőrizd: `http://localhost:3000` elérhető?
3. Töröld a cache-t és próbáld újra

---

### "Még nincsenek bejegyzések."
**Probléma:** Nincs alkohol bejegyzés az adatbázisban
**Megoldás:**
1. Menj a **Test.html** oldalra
2. Adj hozzá alkohol bejegyzést
3. Nyisd meg a profilt újra

---

## 🔒 BIZTONSÁG

### Token Kezelés
- A JWT token a **localStorage**-ban tárolódik
- Kulcs: `authToken`
- Minden API hívás **Bearer token**-nel történik

### Automatikus Kijelentkezés
Ha a token érvénytelen:
- Backend **403 Forbidden** válasz
- Frontend átirányít bejelentkezéshez

---

## 📱 RESZPONZÍV DESIGN

### Desktop (>768px)
- **Statisztikák:** 3 oszlopos grid
- **Modal:** 700px széles
- **Padding:** Nagyobb

### Mobil (<768px)
- **Statisztikák:** 1 oszlopos grid
- **Modal:** 95% széles
- **Padding:** Kisebb
- **Font méretek:** Csökkentett

---

## 💡 TIPPEK

### Gyors Navigáció
- **ESC billentyű:** Modal bezárása
- **Háttérre kattintás:** Modal bezárása
- **X gomb:** Modal bezárása

### Adatok Frissítése
- **Új bejegyzés után:** Nyisd meg a profilt újra
- **Automatikus frissítés:** Nincs, manuálisan újra kell nyitni

### Debug Mód
- **Böngésző konzol (F12):** Console.log üzenetek
- **Backend konzol:** SQL lekérdezések és hibák
- **Network tab:** API hívások és válaszok

---

## ✅ GYORS ELLENŐRZŐ LISTA

Minden működik?
- [ ] Backend fut és elérhető
- [ ] MySQL adatbázis elérhető
- [ ] Bejelentkezés sikeres
- [ ] Username megjelenik (jobb felső sarok)
- [ ] Profil modal megnyílik névkattintásra
- [ ] Felhasználói adatok láthatóak
- [ ] Statisztikák megjelennek
- [ ] Bejegyzések láthatóak (ha vannak)
- [ ] Logout gomb működik
- [ ] Modal bezárható

---

## 🎉 ÉLVEZD A FUNKCIÓT!

Most már nyomon követheted az alkoholfogyasztásodat és könnyedén kezelheted a profilodat!

**Kellemes tracking-elést!** 🍺📊
