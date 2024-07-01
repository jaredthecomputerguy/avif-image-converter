import express from "express";
import multer from "multer";
import * as sharp from "sharp";
import path from "path";
import fs from "fs";
import cors from "cors";
import convert from "heic-convert";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.static("public"));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFolder = path.join(__dirname, "..", "public", "uploads");

// Ensure the upload folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

app.get("/health", (_req, res) => {
  return res.json({ status: "healthy" });
});

app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    const originalName = req.file?.originalname.split(".")[0];
    if (!req.file) {
      return res.status(400).json({ error: "No file was provided." });
    }

    if (req.file.mimetype !== "application/octet-stream") {
      const avifContent = req.file?.buffer;

      // Use sharp to convert avif to png
      const pngBuffer = await sharp.default(avifContent).png().toBuffer();

      // Generate a unique filename (you may use a better strategy)
      const fileName = `${originalName}.png`;
      const filePath = path.join(uploadFolder, fileName);

      // Save the converted image to the local folder
      fs.writeFileSync(filePath, pngBuffer);

      // Return the URL for the stored image
      const imageUrl = `/uploads/${fileName}`;
      res.json({ imageUrl, fileName });
    } else {
      const heicContent = req.file?.buffer;

      const pngBuffer = await convert({
        buffer: heicContent,
        format: "PNG",
        quality: 1,
      });

      const fileName = `${originalName}.png`;
      const filePath = path.join(uploadFolder, fileName);

      // Save the converted image to the local folder
      fs.writeFileSync(filePath, Buffer.from(pngBuffer));

      // Return the URL for the stored image
      const imageUrl = `/uploads/${fileName}`;
      res.json({ imageUrl, fileName });
    }
  } catch (error) {
    console.error("Error during conversion:", error);
    res.status(500).json({ error: "Error during conversion." });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
