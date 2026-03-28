import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { type, id } = req.body;

    console.log(`📄 Export started: ${type?.toUpperCase()} - ${id}`);

    if (!type || !id) {
      return res.status(400).json({ message: "Missing type or id" });
    }

    const browser = await puppeteer.launch({
      executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--ignore-certificate-errors", // 🔥 REQUIRED
      ],
    });

    const page = await browser.newPage();

    // 🔥 capture console logs from React (VERY USEFUL)
    page.on("console", msg => {
      console.log("🧠 PAGE LOG:", msg.text());
    });

    // 🔥 dynamic URL
    let url = "";
    const base = process.env.BASE_URL || "https://192.168.1.5:5173";
    if (type === "si") {
      url = `${base}/print/si/${id}`;
    } else if (type === "po") {
      url = `${base}/print/po/${id}`;
    } else {
      throw new Error("Invalid export type");
    }

    console.log("🌐 URL:", url);
    await page.goto(url, {
      waitUntil: "networkidle0",
    });
    // ✅ WAIT FOR ACTUAL CONTENT (not timeout)
    await page.waitForSelector("#print-content");

    await page.waitForFunction(() => {
      const el = document.querySelector("#print-content");
      return el && el.innerText.trim().length > 0;
    });

    // 📸 debug screenshot
    await page.screenshot({ path: "debug.png", fullPage: true });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    console.log(`✅ Export SUCCESS: ${type.toUpperCase()} - ${id}`);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${id}.pdf`,
    });

    res.send(pdf);

  } catch (err) {
    console.error("❌ Export FAILED:", err);

    res.status(500).json({
      message: "PDF export failed",
      error: err.message,
    });
  }
});

export default router;