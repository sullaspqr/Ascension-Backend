# 🎨 PROFIL MODAL - VIZUÁLIS DESIGN SPEC

## 📐 LAYOUT STRUKTÚRA

```
┌─────────────────────────────────────────────────────────┐
│  PROFIL MODAL (700px width, sötét overlay)              │
│  ┌─────────────────────────────────────────────────┐    │
│  │  [X] Bezárás                                     │    │
│  │  ═══════════════════════════════════════════     │    │
│  │           📋 PROFILOM                            │    │
│  │  ═══════════════════════════════════════════     │    │
│  │                                                   │    │
│  │  ┌───────────────────────────────────────────┐   │    │
│  │  │ 👤 Felhasználói adatok                    │   │    │
│  │  │ ─────────────────────────────────────     │   │    │
│  │  │ Felhasználónév: testuser                  │   │    │
│  │  │ E-mail: test@example.com                  │   │    │
│  │  │ Regisztráció: 2026. február 15.           │   │    │
│  │  └───────────────────────────────────────────┘   │    │
│  │                                                   │    │
│  │  ┌───────────────────────────────────────────┐   │    │
│  │  │ 📊 Alkoholfogyasztás statisztikák         │   │    │
│  │  │ ─────────────────────────────────────     │   │    │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │   │    │
│  │  │  │🗓️ Hét   │ │📅 Hónap │ │🏆 Össz. │     │   │    │
│  │  │  │         │ │         │ │         │     │   │    │
│  │  │  │ 1500 ml │ │ 5000 ml │ │12500 ml │     │   │    │
│  │  │  │         │ │         │ │         │     │   │    │
│  │  │  │3 bejegyz│ │10 bejegy│ │25 bejegy│     │   │    │
│  │  │  │ 750 kcal│ │2500 kcal│ │6250 kcal│     │   │    │
│  │  │  │         │ │         │ │Átlag:4.8%│     │   │    │
│  │  │  └─────────┘ └─────────┘ └─────────┘     │   │    │
│  │  │         [hover: glow effekt]              │   │    │
│  │  └───────────────────────────────────────────┘   │    │
│  │                                                   │    │
│  │  ┌───────────────────────────────────────────┐   │    │
│  │  │ 🍺 Legutóbbi 5 bejegyzés                  │   │    │
│  │  │ ─────────────────────────────────────     │   │    │
│  │  │  ┌─────────────────────────────────────┐  │   │    │
│  │  │  │ 🍷 Sör              febr. 18        │  │   │    │
│  │  │  │ [500ml] [4.5%] [250kcal]            │  │   │    │
│  │  │  └─────────────────────────────────────┘  │   │    │
│  │  │  ┌─────────────────────────────────────┐  │   │    │
│  │  │  │ 🍷 Bor              febr. 17        │  │   │    │
│  │  │  │ [200ml] [12%] [160kcal]             │  │   │    │
│  │  │  └─────────────────────────────────────┘  │   │    │
│  │  │         [hover: jobbra csúszik]           │   │    │
│  │  └───────────────────────────────────────────┘   │    │
│  │                                                   │    │
│  │  ┌───────────────────────────────────────────┐   │    │
│  │  │       🚪 KIJELENTKEZÉS (piros)            │   │    │
│  │  └───────────────────────────────────────────┘   │    │
│  │         [hover: felemelés + glow]                │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 SZÍNPALETTA

### Alap Színek
```css
--charcoal: #2B2B2B        /* Sötét háttér */
--graphite: #1F2022        /* Még sötétebb háttér */
--text: #f5f5f5            /* Fehér szöveg */
--muted: #bdbdbd           /* Szürke szöveg */
```

### Accent Színek

#### index.html (Narancssárga)
```css
--accent: rgba(255,106,0,0.9)
--glow: rgba(255,106,0,0.25)
--border: rgba(255,106,0,0.3)
```

#### main.html (Arany)
```css
--accent: rgba(255,215,0,0.9)
--glow: rgba(255,215,0,0.25)
--border: rgba(255,215,0,0.3)
```

#### Logout Gomb (Piros)
```css
--danger: rgb(220,53,69)
--danger-hover: rgb(240,73,89)
--danger-glow: rgba(220,53,69,0.6)
```

---

## 📏 MÉRETEK ÉS TÁVOLSÁGOK

### Modal
```css
max-width: 700px
max-height: 85vh
padding: 40px
border-radius: 12px
```

### Sections
```css
padding: 25px
margin-bottom: 25px
border-radius: 10px
```

### Stats Grid
```css
display: grid
grid-template-columns: repeat(3, 1fr)
gap: 20px
```

### Stat Cards
```css
padding: 20px
border-radius: 12px
border: 1px solid accent
```

### Entry Items
```css
padding: 15px
margin-bottom: 12px
border-radius: 8px
```

### Logout Button
```css
width: 100%
padding: 14px 20px
margin-top: 25px
border-radius: 8px
```

---

## ✨ ANIMÁCIÓK ÉS EFFEKTEK

### Modal Megnyitás
```css
@keyframes slideUp {
  from {
    opacity: 0
    transform: translateY(30px) scale(0.95)
  }
  to {
    opacity: 1
    transform: translateY(0) scale(1)
  }
}
duration: 0.4s
easing: cubic-bezier(.22,.9,.32,1)
```

### Stat Card Hover
```css
transform: translateY(-3px)
box-shadow: 0 8px 25px rgba(accent, 0.3)
border-color: rgba(accent, 0.4)
transition: all 0.3s ease
```

### Entry Item Hover
```css
transform: translateX(5px)
background: rgba(0,0,0,0.3)
border-color: rgba(accent, 0.3)
transition: all 0.3s ease
```

### Logout Button Hover
```css
transform: translateY(-2px)
box-shadow: 0 8px 20px rgba(220,53,69,0.6)
background: linear-gradient(135deg, rgb(240,73,89), rgb(200,55,75))
transition: all 0.3s ease
```

---

## 🔤 TIPOGRÁFIA

### Címek (h2, h3)
```css
font-family: 'Cinzel', 'Copperplate Gothic', serif
letter-spacing: 0.05em
color: #f5f5f5
```

### Stat értékek
```css
font-size: 2rem
font-weight: bold
color: accent (narancssárga/arany)
font-family: 'Cinzel', serif
```

### Normál szöveg
```css
font-family: Arial, sans-serif
font-weight: bold
font-size: 15px
color: #bdbdbd
```

### Gombok
```css
font-family: 'Cinzel', serif
font-size: 16px
letter-spacing: 0.05em
```

---

## 🖼️ DEKORATÍV ELEMEK

### Stat Card Gradient
```css
background: linear-gradient(
  135deg, 
  rgba(accent, 0.1) 0%, 
  rgba(0,0,0,0.3) 100%
)
```

### Stat Card Hover Overlay
```css
.stat-card::before {
  background: linear-gradient(135deg, rgba(accent, 0.05), transparent)
  opacity: 0 → 1 on hover
}
```

### Section Border
```css
h3 {
  border-bottom: 2px solid rgba(accent, 0.3)
  padding-bottom: 10px
}
```

---

## 📱 RESZPONZÍV TÖRÉSPONTOK

### Desktop (>768px)
```css
.stats-grid {
  grid-template-columns: repeat(3, 1fr)
}
.profile-modal-content {
  max-width: 700px
  padding: 40px
}
.stat-value {
  font-size: 2rem
}
```

### Tablet (481px - 768px)
```css
.stats-grid {
  grid-template-columns: repeat(2, 1fr)
}
```

### Mobil (<480px)
```css
.stats-grid {
  grid-template-columns: 1fr
}
.profile-modal-content {
  max-width: 95%
  padding: 25px 15px
}
.stat-value {
  font-size: 1.5rem
}
.entry-details {
  flex-wrap: wrap
}
```

---

## 🎭 ÁLLAPOTOK

### Default State
- Fehér szöveg (#f5f5f5)
- Sötét háttér (rgba(0,0,0,0.3))
- Szürke border (rgba(255,255,255,0.1))

### Hover State
- Accent glow (box-shadow)
- Accent border color
- Transform effekt (translateY, translateX)

### Active State (Logout gomb)
- transform: translateY(0)
- Nincs glow

### Focus State (Inputs)
- Accent border
- Accent glow (box-shadow)
- Sötétebb háttér

---

## 🔍 RÉSZLETEK

### Scrollbar (Webkit)
```css
::-webkit-scrollbar {
  width: 8px
}
::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.2)
  border-radius: 4px
}
::-webkit-scrollbar-thumb {
  background: rgba(accent, 0.5)
  border-radius: 4px
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(accent, 0.7)
}
```

### Border Radius Hierarchy
```css
Modal: 12px
Sections: 10px
Stat Cards: 12px
Entry Items: 8px
Buttons: 8px
Tags: 4px
```

### Shadow Hierarchy
```css
Modal: 0 20px 60px rgba(0,0,0,0.8)
Stat Card Hover: 0 8px 25px rgba(accent, 0.3)
Button Hover: 0 8px 20px rgba(color, 0.6)
```

---

## 🎯 UX IRÁNYELVEK

### Interaktivitás
- ✅ **Minden kattintható elem** jelezze hover állapotban
- ✅ **Gyors feedback** (max 300ms transition)
- ✅ **Vizuális hierarchia** (méret, szín, távolság)

### Olvashatóság
- ✅ **Kontrasztarány:** Minimum 4.5:1 (WCAG AA)
- ✅ **Sortávolság:** 1.6 (kényelmes olvasás)
- ✅ **Betűméret:** Min 14px (kicsi szöveg)

### Hozzáférhetőség
- ✅ **Keyboard navigation:** Tab, ESC
- ✅ **Screen readers:** aria-label attribútumok
- ✅ **Focus states:** Jól látható outline

---

## 🎨 DESIGN SYSTEM ÖSSZEFOGLALÓ

### Stílus: **Dark Glassmorphism**
- Sötét alapszín
- Átlátszó rétegek
- Blur effektek
- Finom glow-k

### Hangulat: **Modern & Professzionális**
- Tiszta vonalak
- Elegáns animációk
- Minimalista ikonok
- Kontrasztos accent színek

### Ihletek:
- 🎮 Gaming dashboards
- 📊 Analytics platformok
- 💼 Premium fitness alkalmazások
- 🌌 Futurisztikus UI-ok

---

## 🚀 VÉGLEGES DESIGN CHECKLIST

- [x] Színpaletta konzisztens
- [x] Tipográfia hierarchia világos
- [x] Animációk smooth-ok (60fps)
- [x] Hover effektek látványosak
- [x] Reszponzív minden eszközön
- [x] Hozzáférhető (WCAG AA)
- [x] Teljesítmény optimalizált
- [x] Cross-browser kompatibilis

---

## 🎉 DESIGN KÉSZ!

A profil modal vizuálisan összhangban van a weboldal többi részével, modern és felhasználóbarát!
