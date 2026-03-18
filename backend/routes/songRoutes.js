const express = require("express");
const router = express.Router();
const Song = require("../models/Song");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { title, artist, audioUrl, imageUrl } = req.body;

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl
    });

    await song.save();

    res.status(201).json({ message: "Song Added Successfully 🎵" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🎵 GET ALL SONGS (Public)
router.get("/", async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🎵 GET SINGLE SONG
router.get("/:id", async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;