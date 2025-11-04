import multer from "multer";
import fs from "fs";
import path from "path";

// Build Y/M/D folder path
const buildTempPath = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");

  const folderName = `${y}-${m}-${d}`;

  return path.join("uploads", "temp", folderName);
};

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = buildTempPath();
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const uploadTemp = multer({ storage });

export default uploadTemp;
