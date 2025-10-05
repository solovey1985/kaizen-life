import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

// Simple initialization without complex environment loading
admin.initializeApp();
const db = admin.firestore();

const app = express();

// Simple CORS setup for development
const isDev = process.env.NODE_ENV === "development" || process.env.FUNCTIONS_EMULATOR === "true";
const corsOrigin = isDev ? "http://localhost:5000" : false;

app.use(cors({ 
  origin: corsOrigin,
  credentials: true
}));

console.log("🚀 Firebase Functions starting up");
console.log(`🌐 CORS configured for: ${corsOrigin}`);

// Simple logger
const logger = {
  info: (message: string, data?: any) => console.log(`ℹ️  ${message}`, data || ""),
  debug: (message: string, data?: any) => {
    if (isDev) console.log(`🐛 ${message}`, data || "");
  },
  warn: (message: string, data?: any) => console.warn(`⚠️  ${message}`, data || ""),
  error: (message: string, error?: any) => console.error(`❌ ${message}`, error || "")
};

// Example: get balance
app.get("/balance/:userId", async (req, res) => {
  const { userId } = req.params;
  logger.info("🔍 GET /balance/:userId called", { userId });
  
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      logger.warn("❌ User not found", { userId });
      return res.status(404).send("User not found");
    }
    
    const userData = userDoc.data();
    logger.info("✅ Balance retrieved successfully", { userId, balance: userData });
    return res.json(userData);
  } catch (error) {
    logger.error("❌ Error retrieving balance", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/category", async (req, res) => {
  const { name, userId } = req.body;
  logger.info("📝 POST /category called", { name, userId });
  
  try {
    const category = { userId, name, createdAt: new Date().toISOString() };
    const docRef = await db.collection("categories").add(category);
    
    logger.info("✅ Category created successfully", { categoryId: docRef.id, category });
    return res.json({ success: true, categoryId: docRef.id });
  } catch (error) {
    logger.error("❌ Error creating category", error);
    return res.status(500).json({ error: "Failed to create category" });
  }
});

app.post("/actions/add", async (req, res) => {
  logger.info("🚀 POST /actions/add called", { body: req.body });
  
  const { userId, actionTypeId, amount } = req.body;
  logger.debug("📝 Extracted params", { userId, actionTypeId, amount });
  
  try {
    const actionTypeDoc = await db
      .collection("actionTypes")
      .doc(actionTypeId)
      .get();
      
    if (!actionTypeDoc.exists) {
      logger.warn("❌ ActionType not found", { actionTypeId });
      return res.status(404).send("ActionType not found");
    }

    const actionType = actionTypeDoc.data();
    logger.debug("✅ Found actionType", actionType);
    
    if (!actionType) {
      logger.error("❌ ActionType data unavailable");
      return res.status(500).send("ActionType data unavailable");
    }
    
    const credits = amount * actionType.creditValue;
    logger.info("💰 Calculated credits", { amount, creditValue: actionType.creditValue, credits });

    // Create userAction log
    const userAction = {
      userId,
      actionTypeId,
      amount,
      calculatedCredits: credits,
      date: new Date().toISOString(),
    };
    
    logger.debug("📋 Creating userAction", userAction);
    await db.collection("userActions").add(userAction);

    // Update balance transaction
    logger.info("🔄 Starting balance update transaction", { userId });
    const userRef = db.collection("users").doc(userId);
    
    await db.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) throw new Error("User not found");

      const balance = userDoc.data() || { balanceKP: 0, balanceKZ: 0 };
      logger.debug("💼 Current balance", balance);
      
      if (actionType.type === "KP") {
        balance.balanceKP += credits;
      } else {
        balance.balanceKZ += credits;
      }

      logger.debug("💼 New balance", balance);
      t.update(userRef, balance);
    });
    
    logger.info("✅ Transaction completed successfully", { userId, credits });
    return res.json({ success: true, credits });
    
  } catch (error) {
    logger.error("❌ Transaction failed", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({ error: "Transaction failed", details: errorMessage });
  }
});

// Export API
exports.api = functions.https.onRequest(app);