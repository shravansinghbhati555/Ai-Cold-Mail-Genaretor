const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const aiContriller = require("../controllers/aiController")


router.post("/generate-email", protect, aiContriller.generateEmail)

router.get("/history", protect, aiContriller.getHistory)

module.exports = router