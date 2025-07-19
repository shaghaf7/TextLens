const express = require("express");
const multer = require("multer");
const path = require("path");
const tesseract = require("tesseract.js");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.static(path.join(__dirname + "/uploads")));
const allowedOrigins = [
  "http://localhost:5173",
  "https://text-lens.vercel.app",
  "https://text-lens-zeta.vercel.app", // ← add your deployed frontend domain here
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST"],
  credentials: true,
}));


cloudinary.config({
  cloud_name: "dat6x9jpn",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage: storage });

app.post(
  "/api/extractTextFromImage",
  upload.single("file"),
  async (req, res) => {
    console.log(req.file.path);
    try {
      const {
        data: { text },
      } = await tesseract.recognize(req.file.path, "eng");
      res.json({ text });
    } catch (error) {
      console.log("error in post", error);
    }
  }
);

app.listen(PORT, () => {
  console.log("server started");
});

