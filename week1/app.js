var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const amqp = require('amqplib');
const promBundle = require("express-prom-bundle");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usersWithPhotosRouter = require('./routes/users-with-photos');
const { ObjectId } = require('mongodb');

const { db } = require("./services/database");
var app = express();

const metricsMiddleware = promBundle({
	includePath: true,
	includeStatusCode: true,
	normalizePath: true,
	promClient: {
		collectDefaultMetrics: {}
	}
});


const QUEUE_NAME = process.env.MQ_QUE;

async function consumeMessages() {
    try {
        const connection = await amqp.connect(process.env.MQ);
        const channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: false });

        console.log(`[*] Waiting for messages in ${QUEUE_NAME}. To exit press CTRL+C`);
        channel.consume(QUEUE_NAME, async function(msg) {
            const userId = msg.content.toString();
            console.log(`[x] Received userId: ${userId}`);
            const userExists = await checkUserExists(userId);

            if (userExists) {
                await db.collection('users_with_photos').insertOne({ userId });
                console.log(`[+] Inserted data for userId: ${userId}`);
            }

            channel.ack(msg);
        }, { noAck: false });
    } catch (error) {
        console.error('Error:', error); 
    }
}


async function checkUserExists(userId) {
    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        return !!user;
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false; 
    }
}

consumeMessages();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(metricsMiddleware);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users-with-photos', usersWithPhotosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
