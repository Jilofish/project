import "./config/env.js"; 
import express from "express";
import cors from "cors";
import purchasingRouter from "./routes/purchasing.js";


const app = express();
const PORT = process.env.nodejs_port || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ERP Backend is running");
});

app.use("/api/purchasing", purchasingRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
