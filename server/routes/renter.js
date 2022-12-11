const Pool = require('pg').Pool
const router = require('express').Router();

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'db',
    password: 'wasd',
    port: 5432,
});

router.route('/').get(async (req, res) => {
    try {
        const results = await pool.query(
            "SELECT * FROM renter"
        );
        res.status(200).json(results.rows);
    } catch (err) {
        res.status(400).send('Error' + err);
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        const { id } = req.params;
        const results = await pool.query(
            "SELECT renter.name AS renter_name, renter.email AS renter_email, renter.bank_info AS renter_bank_info, property.name AS property_name, property.address AS property_address, property.rent_amount AS property_rent_amount, property.pay_period AS property_pay_period, property.deposit AS property_daposit, landlord.name AS landlord_name, landlord.email AS landlord_email FROM renter INNER JOIN property ON renter.id = property.id INNER JOIN landlord ON property.id = landlord.id WHERE renter.id = $1",
            [id]
        );

        res.status(200).json(results.rows);
    } catch (err) {
        res.status(400).send('Error' + err)
    }
});

router.route('post').post(async (req, res) => {
    try {
        const { name, email, bank_info } = req.params;
        const result = await pool.query(
            "INSERT INTO renter (name, email, bank_info) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bank_info]
        );
        res.status(200).send('User created');
    } catch (err) {
        res.status(400).send('User create failed ' + err);
    }
});

router.route('/update/:id').put(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, bank_info } = req.body;
        const result = await pool.query(
            "UPDATE renter SET name = $1, email = $2, bank_info = $3 WHERE id = $4 RETURNING *",
            [name, email, bank_info, id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(400).send('Update failed ' + err);
    }
});

router.route('/delete/:id').delete(async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM renter WHERE id = $1",
            [id]
        );
        res.status(200).send('User deleted');
    } catch (err) {
        res.status(400).send('Delete failed ' + err);
    }
});

module.exports = router;