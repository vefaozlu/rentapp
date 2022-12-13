const router = require('express').Router();
const jwt = require('jsonwebtoken');

require('dotenv').config();

let Auth = require('../models/auth.model');

router.route('/register').post(async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phone_number;
    const renterId = req.body.renter_id;
    const balanceId = req.body.balance_id;

    const key = process.env.TOKEN_SECRET;

    if (!(username && email && password)) {
        return res.status(400).json('All Fields Must Be Filled.');
    }

    const userExist = await Auth.findOne({ username: username, email: email });
    if (userExist) {
        return res.status(409).json('User already exist');
    }

    const auth = new Auth({
        username,
        email,
        password,
        phoneNumber,
        renterId,
        balanceId,
    });

    const data = {
        'email': email,
        'username': username,
    }

    const token = jwt.sign({ data: data, exp: Math.floor(Date.now() / 1000) + 86400 }, key);

    auth.save()
        .then(() => res.status(200).json(token))
        .catch(err => res.status(400).json('Error' + err));
});

router.route('/login').post(async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const key = process.env.TOKEN_SECRET;

    if (!(username || email)) { 
        return res.status(401).json('Enter a username or email');
    }

    const user = email != null
        ? await Auth.findOne({ email: email })
        : await Auth.findOne({ username: username });

    if (!user) {
        return res.status(404).json('User not found');
    }

    if (password != user.password) {
        return res.status(401).json('Uncorrect credentials');
    }

    const data = {
        'email': email,
        'username': username,
    }

    const token = jwt.sign({ data: data, exp: Math.floor(Date.now() / 1000) + 86400 }, key);

    return res.status(200).json({"user": user, "token": token});
});

router.route('/verify').post((req, res) => {
    const key = process.env.TOKEN_SECRET;
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;

    try {
        const token = req.header(tokenHeaderKey);

        const verified = jwt.verify(token, key);

        if (verified) {
            return res.status(200).json('Verified');
        } else {
            return res.status(401).json('Token expired')
        }
    } catch (err) {
        return res.status(401).json(err);
    }
});

module.exports = router;