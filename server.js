import express from "express";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ dest: "uploads/" });

/* ====== MYSQL KAPCSOLAT - Állítsd be a saját adataidat! ====== */
const dbConfig = {
  host: 'localhost',        // MySQL szerver címe
  user: 'root',             // MySQL felhasználónév
  password: '',             // MySQL jelszó (XAMPP-ban alapból üres)
  database: 'ascension_db'  // Az adatbázis neve amit létrehoztál
};

// MySQL kapcsolat létrehozása és ellenőrzése
let db;
async function connectDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ MySQL kapcsolat OK - Ascension adatbázis elérhető!');
    
    // Táblák ellenőrzése
    const [tables] = await db.execute("SHOW TABLES LIKE 'users'");
    if (tables.length === 0) {
      console.log('⚠️  FIGYELEM: A users tábla még nem létezik!');
      console.log('💡 Futtasd le a database.sql-t phpMyAdmin-ban!');
    } else {
      console.log('✅ Users tábla megtalálva');
    }
  } catch (error) {
    console.error('❌ MySQL kapcsolat HIBA:', error.message);
    console.log('\n💡 HIBAELHÁRÍTÁS:');
    console.log('1. XAMPP/WAMP elindítva? MySQL fut?');
    console.log('2. phpMyAdmin-ban lefuttattad a database.sql-t?');
    console.log('3. Adatbázis neve: ascension_db');
    console.log('4. server.js 18-22. sor: Jók az adatok?\n');
  }
}

await connectDatabase();

const JWT_SECRET = 'ascension_secret_2026';

/* ====== CLOUDINARY ====== */
cloudinary.config({
  cloud_name: "dpgrckgpd",
  api_key: "971153315419944",
  api_secret: "8Il9Me1gW-ZOK-hkwjazlT_rMYM",
});

/* ====== YOUCAM ====== */
const YOUCAM_URL =
  "https://yce-api-01.makeupar.com/s2s/v2.0/task/skin-analysis";

const YOUCAM_TOKEN =
  "sk-k-JqVOqEWFz8RxwRkOjAC05xLtfkfCQ5Vf8dEJ0vDykLXPpWhk2dGtWc9CNcZeX7";

/* ====== USDA FoodData Central ====== */
const FDC_API_KEY =
  process.env.FDC_API_KEY || "dVZB801iAYTee9gse3M24mw2rYVtxkjpd2kW3jT3";

/* ====== SEGÉD ====== */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ====== YOUCAM START ====== */
async function startTask(imageUrl) {
  const res = await fetch(YOUCAM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${YOUCAM_TOKEN}`,
    },
    body: JSON.stringify({
      src_file_url: imageUrl,
      dst_actions: ["acne", "oiliness"],
      format: "json",
    }),
  });

  const payload = await res.json();
  console.log("YouCam START válasz:", JSON.stringify(payload, null, 2));
  return payload?.data?.task_id;
}

/* ====== YOUCAM POLL ====== */
async function pollTask(taskId) {
  for (let i = 0; i < 60; i++) {
    const res = await fetch(`${YOUCAM_URL}/${encodeURIComponent(taskId)}`, {
      headers: {
        Authorization: `Bearer ${YOUCAM_TOKEN}`,
      },
    });

    const payload = await res.json();
    const status = payload?.data?.task_status;

    console.log("YouCam poll státusz:", status);
    console.log("YouCam poll payload:", JSON.stringify(payload, null, 2));

    if (status === "success") {
      return payload.data.results;
    }

    if (status === "error") {
      throw new Error(
        "YouCam task error: " + JSON.stringify(payload?.data?.error || payload)
      );
    }

    await sleep(2000);
  }

  throw new Error("YouCam timeout");
}

/* ====== EGYSZERŰ TANÁCS ====== */
function generateAdvice(rawResults) {
  const advice = [];

  if (!rawResults?.output) {
    return ["Nem sikerült elemezni az arcot."];
  }

  const oiliness = rawResults.output.find((o) => o.type === "oiliness");
  const acne = rawResults.output.find((o) => o.type === "acne");

  if (oiliness && oiliness.ui_score > 60) {
    advice.push("Zsíros bőr: könnyű, gél állagú hidratálót használj.");
  }

  if (acne && acne.ui_score > 30) {
    advice.push("Pattanások: BHA / szalicilsav segíthet.");
  }

  if (advice.length === 0) {
    advice.push("A bőröd jó állapotban van, tartsd a rutinod.");
  }

  return advice;
}

/* ====== API ====== */
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    // 1. feltöltés Cloudinary-be
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      transformation: [{ quality: "auto:best" }, { fetch_format: "jpg" }],
    });

    const imageUrl = uploadRes.secure_url;

    // 2. YouCam indítás
    const taskId = await startTask(imageUrl);
    if (!taskId) throw new Error("No task id from YouCam");

    // 3. YouCam poll
    const rawResults = await pollTask(taskId);

    // 4. tanács
    const advice = generateAdvice(rawResults);

    // 5. letisztult eredmény JSON-hoz
    const cleanedResults = {};

    rawResults.output.forEach((item) => {
      if (item.type === "oiliness") cleanedResults.oiliness = item.ui_score;
      if (item.type === "acne") cleanedResults.acne = item.ui_score;
      if (item.type === "all") cleanedResults.overall = item.score;
    });

    // ✅ SIKERES VÁLASZ A FRONTENDNEK
    res.json({
      success: true,
      results: cleanedResults,
      advice: advice,
    });
  } catch (err) {
    console.error("BACKEND ERROR:", err);
    res.status(500).json({ error: "Elemzés sikertelen" });
  }
});

/* ====== NUTRITION SEARCH (USDA FDC) ====== */
app.get("/nutrition/search", async (req, res) => {
  try {
    const query = (req.query.query || "").trim();
    if (!query) {
      return res
        .status(400)
        .json({ error: "Hiányzó keresési kifejezés (query)" });
    }

    if (!FDC_API_KEY || FDC_API_KEY === "YOUR_FDC_API_KEY") {
      return res
        .status(500)
        .json({ error: "Hiányzó FDC API kulcs (FDC_API_KEY)" });
    }

    const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
    url.searchParams.set("query", query);
    url.searchParams.append("dataType", "Foundation");
    url.searchParams.append("dataType", "SR Legacy");
    url.searchParams.set("pageSize", "10");
    url.searchParams.set("api_key", FDC_API_KEY);

    const resp = await fetch(url.toString());
    const data = await resp.json();

    const items = (data.foods || [])
      .map((food) => {
        const nutrients = {};
        (food.foodNutrients || []).forEach((n) => {
          // Map USDA nutrient IDs to fields
          // 1008 Energy (kcal), 1003 Protein (g), 1005 Carbohydrate (g)
          if (n.nutrientId === 1008) nutrients.energyKcal = n.value;
          if (n.nutrientId === 1003) nutrients.proteinG = n.value;
          if (n.nutrientId === 1005) nutrients.carbG = n.value;
        });

        return {
          fdcId: food.fdcId,
          description: food.description,
          dataType: food.dataType,
          brandOwner: food.brandOwner || null,
          nutrients,
        };
      })
      .filter(
        (item) => item.nutrients && item.nutrients.energyKcal !== undefined
      );

    res.json({ items });
  } catch (err) {
    console.error("/nutrition/search error:", err);
    res.status(500).json({ error: "Keresés sikertelen" });
  }
});

/* ====== JWT MIDDLEWARE ====== */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ success: false, error: "Token hiányzik" });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: "Érvénytelen token" });
    }
    req.user = user;
    next();
  });
}

/* ====== AUTH ENDPOINTS ====== */

// Regisztráció
app.post("/api/auth/register", async (req, res) => {
  try {
    // Ellenőrizzük hogy van-e DB kapcsolat
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: "Adatbázis kapcsolat nincs! Ellenőrizd a backend-et!" 
      });
    }
    
    const { username, email, password } = req.body;
    
    console.log('📝 Regisztráció kísérlet:', { username, email });
    
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, error: "Minden mező kitöltése kötelező" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: "A jelszónak legalább 6 karakter hosszúnak kell lennie" });
    }
    
    // Email ellenőrzés
    const [existing] = await db.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: "Ez az email vagy felhasználónév már foglalt" });
    }
    
    // Jelszó hash
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Beszúrás
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    
    console.log('✅ Regisztráció sikeres! User ID:', result.insertId);
    
    // Token
    const token = jwt.sign(
      { userId: result.insertId, username, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: "Sikeres regisztráció",
      token,
      user: { id: result.insertId, username, email }
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ success: false, error: "Szerver hiba: " + error.message });
  }
});

// Bejelentkezés
app.post("/api/auth/login", async (req, res) => {
  try {
    // Ellenőrizzük hogy van-e DB kapcsolat
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: "Adatbázis kapcsolat nincs! Ellenőrizd a backend-et!" 
      });
    }
    
    const { emailOrUsername, password } = req.body;
    
    console.log('🔐 Login kísérlet:', emailOrUsername);
    
    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, error: "Email/felhasználónév és jelszó megadása kötelező" });
    }
    
    // Felhasználó keresése
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [emailOrUsername, emailOrUsername]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, error: "Helytelen email/felhasználónév vagy jelszó" });
    }
    
    const user = users[0];
    
    // Jelszó ellenőrzés
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: "Helytelen email/felhasználónév vagy jelszó" });
    }
    
    console.log('✅ Login sikeres!', user.username);
    
    // Token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: "Sikeres bejelentkezés",
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, error: "Szerver hiba: " + error.message });
  }
});

/* ====== PROFILE ENDPOINT ====== */

// Profil adatok lekérése (felhasználó + alkohol statisztikák)
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: "Adatbázis kapcsolat nincs!" 
      });
    }
    
    const userId = req.user.userId;
    console.log('👤 Profil lekérés:', userId);
    
    // 1. Felhasználó alapadatok lekérése
    const [users] = await db.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Felhasználó nem található" 
      });
    }
    
    const user = users[0];
    
    // 2. Heti statisztikák (ez a hét)
    const [weekStats] = await db.execute(`
      SELECT 
        COUNT(*) as entries,
        COALESCE(SUM(amount_ml), 0) as total_ml,
        COALESCE(SUM(calories), 0) as total_calories
      FROM alcohol_entries 
      WHERE user_id = ? 
      AND YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)
    `, [userId]);
    
    // 3. Havi statisztikák (ez a hónap)
    const [monthStats] = await db.execute(`
      SELECT 
        COUNT(*) as entries,
        COALESCE(SUM(amount_ml), 0) as total_ml,
        COALESCE(SUM(calories), 0) as total_calories
      FROM alcohol_entries 
      WHERE user_id = ? 
      AND YEAR(date) = YEAR(CURDATE())
      AND MONTH(date) = MONTH(CURDATE())
    `, [userId]);
    
    // 4. Összes statisztika
    const [totalStats] = await db.execute(`
      SELECT 
        COUNT(*) as entries,
        COALESCE(SUM(amount_ml), 0) as total_ml,
        COALESCE(SUM(calories), 0) as total_calories,
        COALESCE(AVG(alcohol_percentage), 0) as avg_alcohol_percentage
      FROM alcohol_entries 
      WHERE user_id = ?
    `, [userId]);
    
    // 5. Legutóbbi 5 bejegyzés
    const [recentEntries] = await db.execute(`
      SELECT 
        id,
        drink_type,
        amount_ml,
        alcohol_percentage,
        calories,
        date,
        created_at
      FROM alcohol_entries 
      WHERE user_id = ?
      ORDER BY date DESC, created_at DESC
      LIMIT 5
    `, [userId]);
    
    console.log('✅ Profil adatok összegyűjtve!');
    
    // 6. Válasz összeállítása
    res.json({
      success: true,
      profile: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at
        },
        stats: {
          week: {
            entries: weekStats[0].entries,
            totalMl: weekStats[0].total_ml,
            totalCalories: weekStats[0].total_calories
          },
          month: {
            entries: monthStats[0].entries,
            totalMl: monthStats[0].total_ml,
            totalCalories: monthStats[0].total_calories
          },
          total: {
            entries: totalStats[0].entries,
            totalMl: totalStats[0].total_ml,
            totalCalories: totalStats[0].total_calories,
            avgAlcoholPercentage: parseFloat(totalStats[0].avg_alcohol_percentage).toFixed(1)
          }
        },
        recentEntries: recentEntries.map(entry => ({
          id: entry.id,
          drinkType: entry.drink_type,
          amountMl: entry.amount_ml,
          alcoholPercentage: entry.alcohol_percentage,
          calories: entry.calories,
          date: entry.date,
          createdAt: entry.created_at
        }))
      }
    });
  } catch (error) {
    console.error("❌ Profile error:", error);
    res.status(500).json({ success: false, error: "Szerver hiba: " + error.message });
  }
});

/* ====== ALCOHOL TRACKING ENDPOINTS ====== */

// Alkohol bejegyzés hozzáadása
app.post("/api/alcohol/add", authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: "Adatbázis kapcsolat nincs!" 
      });
    }
    
    const { drinkType, amountMl, alcoholPercentage, calories, date } = req.body;
    const userId = req.user.userId;
    
    console.log('🍺 Alkohol hozzáadás:', { userId, drinkType, amountMl });
    
    if (!drinkType || !amountMl || alcoholPercentage === undefined || !calories || !date) {
      return res.status(400).json({ 
        success: false, 
        error: "Minden mező kitöltése kötelező" 
      });
    }
    
    const [result] = await db.execute(
      'INSERT INTO alcohol_entries (user_id, drink_type, amount_ml, alcohol_percentage, calories, date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, drinkType, amountMl, alcoholPercentage, calories, date]
    );
    
    console.log('✅ Alkohol bejegyzés mentve! ID:', result.insertId);
    
    res.json({
      success: true,
      message: "Alkohol bejegyzés sikeresen hozzáadva",
      entryId: result.insertId
    });
  } catch (error) {
    console.error("❌ Alcohol add error:", error);
    res.status(500).json({ success: false, error: "Szerver hiba: " + error.message });
  }
});

// Alkohol bejegyzések lekérése (adott dátum vagy időszak)
app.get("/api/alcohol/entries", authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: "Adatbázis kapcsolat nincs!" 
      });
    }
    
    const userId = req.user.userId;
    const { date, startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM alcohol_entries WHERE user_id = ?';
    let params = [userId];
    
    if (date) {
      query += ' AND date = ?';
      params.push(date);
    } else if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY date DESC, created_at DESC';
    
    const [entries] = await db.execute(query, params);
    
    res.json({
      success: true,
      entries
    });
  } catch (error) {
    console.error("❌ Alcohol entries error:", error);
    res.status(500).json({ success: false, error: "Szerver hiba: " + error.message });
  }
});

// Alkohol bejegyzés törlése
app.delete("/api/alcohol/:id", authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: "Adatbázis kapcsolat nincs!" 
      });
    }
    
    const userId = req.user.userId;
    const entryId = req.params.id;
    
    // Először ellenőrizzük, hogy a bejegyzés a felhasználóé-e
    const [entries] = await db.execute(
      'SELECT id FROM alcohol_entries WHERE id = ? AND user_id = ?',
      [entryId, userId]
    );
    
    if (entries.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: "Bejegyzés nem található vagy nincs jogosultságod hozzá" 
      });
    }
    
    await db.execute('DELETE FROM alcohol_entries WHERE id = ?', [entryId]);
    
    console.log('✅ Alkohol bejegyzés törölve! ID:', entryId);
    
    res.json({
      success: true,
      message: "Bejegyzés sikeresen törölve"
    });
  } catch (error) {
    console.error("❌ Alcohol delete error:", error);
    res.status(500).json({ success: false, error: "Szerver hiba: " + error.message });
  }
});

// Alkohol statisztikák (összes kalória, ml stb. adott időszakra)
app.get("/api/alcohol/stats", authenticateToken, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ 
        success: false, 
        error: "Adatbázis kapcsolat nincs!" 
      });
    }
    
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT 
        COUNT(*) as total_entries,
        SUM(amount_ml) as total_ml,
        SUM(calories) as total_calories,
        AVG(alcohol_percentage) as avg_alcohol_percentage
      FROM alcohol_entries 
      WHERE user_id = ?
    `;
    let params = [userId];
    
    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    const [stats] = await db.execute(query, params);
    
    res.json({
      success: true,
      stats: stats[0]
    });
  } catch (error) {
    console.error("❌ Alcohol stats error:", error);
    res.status(500).json({ success: false, error: "Szerver hiba: " + error.message });
  }
});

/* ====== START ====== */
app.listen(3000, () => {
  console.log("Backend fut: http://localhost:3000");
});
