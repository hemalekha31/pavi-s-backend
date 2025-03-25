const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ UPDATE this part with your MySQL credentials
const db = mysql.createConnection({
    host: "localhost", // Use Render's MySQL host if using Render DB
    user: "root", // Use your MySQL username
    password: "hema29", // Use your MySQL password
    database: "pavis_lab",
    port: 3306, // Default MySQL port
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

// ✅ Create Order API
app.post("/create-order", (req, res) => {
    const { customer_name, amount } = req.body;
    const upi_id = "6382318369@ptsbi"; // Your UPI ID
    
    const query = "INSERT INTO orders (customer_name, amount, upi_id) VALUES (?, ?, ?)";
    db.query(query, [customer_name, amount, upi_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const orderId = result.insertId;
        const upiLink = `upi://pay?pa=${upi_id}&pn=${customer_name}&am=${amount}&cu=INR`;
        res.json({ orderId, upiLink });
    });
});

// ✅ Fetch Orders API
app.get("/orders", (req, res) => {
    db.query("SELECT * FROM orders", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// ✅ Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
