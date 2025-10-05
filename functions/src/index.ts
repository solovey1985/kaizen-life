import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({origin: true}));

// Example: get balance
app.get("/balance/:userId", async (req, res) => {
  const {userId} = req.params;
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) return res.status(404).send("User not found");
  return res.json(userDoc.data());
});

// Example: add action
app.post("/actions/add", async (req, res) => {
  const {userId, actionTypeId, amount} = req.body;
  const actionTypeDoc = await db
    .collection("actionTypes")
    .doc(actionTypeId)
    .get();
  if (!actionTypeDoc.exists) {
    return res.status(404).send("ActionType not found");
  }

  const actionType = actionTypeDoc.data();
  if (!actionType) {
    return res.status(500).send("ActionType data unavailable");
  }
  const credits = amount * actionType.creditValue;

  // Create userAction log
  const userAction = {
    userId,
    actionTypeId,
    amount,
    calculatedCredits: credits,
    date: new Date().toISOString(),
  };
  await db.collection("userActions").add(userAction);

  // Update balance transaction
  const userRef = db.collection("users").doc(userId);
  await db.runTransaction(async (t) => {
    const userDoc = await t.get(userRef);
    if (!userDoc.exists) throw new Error("User not found");

    const balance = userDoc.data() || {balanceKP: 0, balanceKZ: 0};
    if (actionType.type === "KP") {
      balance.balanceKP += credits;
    } else {
      balance.balanceKZ += credits;
    }

    t.update(userRef, balance);
  });

  return res.json({success: true, credits});
});

// Export API
exports.api = functions.https.onRequest(app);
