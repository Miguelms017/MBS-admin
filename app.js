import "dotenv/config";
import express from 'express'
import cors from 'cors'
import { get, erase, create } from './database.js'

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
}))

app.use(express.json());

app.get("/api/Appts", async (req, res, next) => {
    try {
        const [rows] = await get();
        res.json(rows);
    } catch (err) {
        next(err);
    }
})

app.delete("/api/Appts/:id", async (req, res) => {
    const { id } = req.params;
    const result = await erase(id);
    res.sendStatus(204);
})

app.post('/api/Appts', async (req, res) => {
    try {
        const { Fname, Lname, phone, email, date, hairstylist, service, description } = req.body;
        const apt = await create(Fname, Lname, phone, email, date, hairstylist, service, description)
        res.status(201).json({
            success: true,
            message: "appointment saved",
            data: apt,
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ success: false, message: "server error" });
    }
})

app.use(express.static("public"));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Oops! something went wrong');
})

app.listen(3000, '0.0.0.0', () => {
    console.log("server running at port 3000")
})