const Pool = require("pg").Pool;
const router = require("express").Router();

const pool = new Pool({
  user: "me",
  host: "localhost",
  database: "db",
  password: "wasd",
  port: 5432,
});

router.route("/").get(async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM property");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

router.route("/:id").get(async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT name, address, rent_amount, pay_period, deposit FROM property WHERE id = $1",
      [id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

router.route("/post").post(async (req, res) => {
  try {
    const {
      name,
      address,
      rent_amount,
      pay_period,
      deposit,
      landlord_id,
      renter_id,
    } = req.body;

    const result = await pool.query(
      "INSERT INTO property (name, address, rent_amount, pay_period, deposit, landlord_id, renter_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, address, rent_amount, pay_period, deposit, landlord_id, renter_id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

router.route("/update/:id").put(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      rent_amount,
      pay_period,
      deposit,
      landlord_id,
      renter_id,
    } = req.body;

    const result = await pool.query(
      "UPDATE property SET name = $1, address = $2, rent_amount = $3, pay_period = $4, deposit = $5, landlord_id = $6, renter_id = $7 WHERE id = $8",
      [
        name,
        address,
        rent_amount,
        pay_period,
        deposit,
        landlord_id,
        renter_id,
        id,
      ]
    );

    res.status(200).send("Property updated");
  } catch (err) {
    res.status(400).send("Error" + err);
  }
});

router.route("/delete/:id").delete(async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM property WHERE id = $1", [id]);

    res.status(200), send("Property deleted");
  } catch (err) {
    res.status(400).send("Delete failed" + err);
  }
});

module.exports = router;
