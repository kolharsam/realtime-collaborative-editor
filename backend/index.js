const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Redis = require('./redis').Redis;
const env = require('dotenv').config()

const port = 1498;
const ws = require('./socket/socket');

const users = new Set();
const userIds = new Set();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'This is home!' });
});

app.get('/users', (req, res) => {
    // send all the users
    res.status(200).json({ success: true, data: [...users] });
});

app.post('/users', (req, res) => {
    let body = req.body;
    let userID = body.id;
    users.add(req.body);
    userIds.add(userID.toString());
    res.status(200).json({ sucess: true });
});

app.get('/init', async (req, res) => { // use for refresh option as well
    let data = await Redis.Get().then(d => d);
    res.status(200).send(data);
});

app.delete('/users', (req, res) => {
    // req.body will have the user object --- > remove this.
});


ws.StartSocket(); // starts the web-socket

app.listen(port, process.env.MY_IP, () => {
    console.log("The API is up on", port, "🚀");
});
