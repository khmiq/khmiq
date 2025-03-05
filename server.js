const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());


app.use(cors({
  origin: "https://invitation-elks.onrender.com",  
  methods: "GET,POST,PUT,PATCH,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;


app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(200);
});
app.post("/webhook", async (req, res) => {
    const { name, surname, attending, food, drink, child } = req.body;

    // Agar foydalanuvchi hech narsa tanlamagan bo‘lsa, "Не указан" qilib qo‘yamiz
    const attendingText = attending ? attending : "Не указан";
    const childText = child ? child : "Не указан";

    console.log("Kelgan ma'lumot:", req.body); // 🔍 Backendda tekshirish

    const message = `
📩 *Новый RSVP Ответ:*
👤 *Имя:* ${name} ${surname}
📌 *Придет?* ${attendingText}
🍽 *Блюдо:* ${food || "Не указан"}
🍷 *Напиток:* ${drink || "Не указан"}
👶 *С ребенком?* ${childText}
`;

    try {
        await axios.post(TELEGRAM_API_URL, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
        });
        res.send({ success: true, message: "RSVP отправлен!" });
    } catch (error) {
        console.error("Ошибка отправки:", error);
        res.status(500).send({ success: false, error: error.message });

    }


});

const PORT = process.env.PORT || 3000;

 app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
