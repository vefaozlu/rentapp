const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

const renterRouter = require('./routes/renter');
const balanceRouter = require('./routes/balance');
const authRouter = require('./routes/auth');

app.use('/renter', renterRouter);
app.use('/balance', balanceRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});