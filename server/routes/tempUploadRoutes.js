// server/routes/tempUploadRoutes.js
import express from "express";
import uploadTemp from "../middleware/uploadTemp.js";

const router = express.Router();

// Handle temporary uploads
router.post("/", uploadTemp.array("files", 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const filePaths = req.files.map((f) => ({
    filename: f.filename,
    temp_path: f.path.replace(/\\/g, "/"), // normalize path
  }));

  res.json({ message: "Files uploaded temporarily", files: filePaths });
});

export default router;
