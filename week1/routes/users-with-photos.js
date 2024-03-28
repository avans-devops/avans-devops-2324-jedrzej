var express = require('express');
var router = express.Router();

const { db } = require("../services/database");

router.get('/', async function(req, res) {
  let users = await db.collection('users_with_photos').find().toArray();
  res.json(users);
});

module.exports = router;
