const { Router } = require('express');
const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from container ;)")
})

module.exports = router