var express = require('express');
const amqp = require('amqplib');
var router = express.Router();

const { db } = require("../services/database");

router.get('/', async function(req, res) {
  let photos = await db.collection('photos').find().toArray();
  res.json(photos);
});

router.post('/', async function(req, res) {
    try {
        const { image, userId } = req.body;

        if (!image || !userId) {
            return res.status(400).json({ error: 'Both image and userId are required' });
        }

        const insertedPhoto = await db.collection('photos').insertOne({ image, userId });

	await sendMessage(userId);

        res.status(201).json({ id: insertedPhoto.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async function(req, res) {
    try {
        const photos = await db.collection('photos').find().toArray();
        res.status(200).json(photos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

async function sendMessage(userId) {
    try {
	const connection = await amqp.connect(process.env.MQ);
	const channel = await connection.createChannel();

	const queueName = process.env.MQ_QUE;
	await channel.assertQueue(queueName, { durable: false });
	channel.sendToQueue(queueName, Buffer.from(userId.toString()));

	console.log(`[x] Sent userId: ${userId}`);

	// Close connection
	setTimeout(() => {
    connection.close();
        }, 500);
    } catch (error) {
        console.error('Error:', error);
    }
}


module.exports = router;
