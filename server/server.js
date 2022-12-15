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

const authRouter = require('./routes/auth');
const balanceRouter = require('./routes/balance');
const propertyRouter = require('./routes/property');
const renterRouter = require('./routes/renter');

app.use('/auth', authRouter);
app.use('/balance', balanceRouter);
app.use('/property', propertyRouter);
app.use('/renter', renterRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});