require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Database Connection (Change these details)
const db = mysql.createConnection({
    host: process.env.DB_HOST,      // Use environment variables
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});

// Create Order API
app.post("/create-order", (req, res) => {
    const { customer_name, amount } = req.body;
    const upi_id = "6382318369@ptsbi"; // Your UPI ID

    const query = "INSERT INTO orders (customer_name, amount, upi_id) VALUES (?, ?, ?)";
    db.query(query, [customer_name, amount, upi_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        const orderId = result.insertId;
        const upiLink = `upi://pay?pa=${upi_id}&pn=${customer_name}&am=${amount}&cu=INR`;
        res.json({ orderId, upiLink });
    });
});

// Fetch Orders API
app.get("/orders", (req, res) => {
    db.query("SELECT * FROM orders", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
