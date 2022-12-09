const router = require('express').Router();

let Auth = require('../models/auth.model');

router.route('/register').post(async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const phoneNumber = req.body.phone_number;
    const renterId = req.body.renter_id;
    const balanceId = req.body.balance_id;

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

    auth.save()
        .then(() => res.status(200).json('User registered'))
        .catch(err => res.status(400).json('Error' + err));
});

router.route('/login').post(async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if(!(username || email)) {
        return res.status(401).json('Enter a username or email');
    }

    const user = email != null ? await Auth.findOne({ email: email}) : await Auth.findOne({ username: username});

    if (!user) {
        return res.status(404).json('User not found');
    }

    if (password != user.password) {
        return res.status(401).json('Uncorrect credentials');
    }

    return res.status(200).json(user);
});

module.exports = router;