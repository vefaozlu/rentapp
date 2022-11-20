const Pool = require('pg').Pool;
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
        res.status(400).json('Error' + err);
    }
});

router.route('/:id').get(async (req, res) => {
    try {
        const { id } = req.params;
        const results = await pool.query(
            "SELECT renter.name AS renter_name, renter.email AS renter_email, renter.bank_info AS renter_bank_info, property.name AS property_name, property.address AS property_address, property.rent_amount AS property_rent_amount, property.pay_period AS property_pay_period, property.deposit AS property_daposit, landlord.name AS landlord_name, landlord.email AS landlord_email FROM renter INNER JOIN property ON renter.id = property.id INNER JOIN landlord ON property.id = landlord.id WHERE renter.id = $1",
            [id]
        );

        console.log(results.rows[0].toMap((element) => element.renter_name));

        res.status(200).json(results.rows);
    } catch (err) {
        res.status(400).json('Error' + err)
    }
});


module.exports = router;