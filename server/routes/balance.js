const router = require("express").Router();

let Balance = require("../models/balance.model");

router.route("/:id").get((req, res) => {
  Balance.findById(req.params.id)
    .then((balance) => {
      if (Date.now() > balance.currentPeriodEndDate) {
        let newDate = new Date(balance.currentPeriodEndDate);
        let newBalance = balance.balance;

        do {
          newBalance += Number(balance.rentAmount);
          newDate.setDate(newDate.getDate() + balance.payPeriod);
        } while (Date.now() > newDate)

        balance.balance = Number(newBalance);
        balance.currentPeriodEndDate = Date.parse(newDate);

        balance.save().catch(err => res.status(400).json("Couldn't update balance " + err));
      }
      res.status(200).json(balance);
    })
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/post").post((req, res) => {
  const balance = Number(req.body.balance);
  const payPeriod = Number(req.body.payPeriod);
  const currentPeriodEndDate = Date.parse(req.body.currentPeriodEndDate);
  const rentAmount = Number(req.body.rentAmount);

  const newBalance = new Balance({
    balance,
    payPeriod,
    currentPeriodEndDate,
    rentAmount,
  });

  newBalance.save()
    .then(() => res.status(200).json("Balance created"))
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/update/:id").put((req, res) => {
  Balance.findByIdAndUpdate(req.params.id)
    .then((balance) => {
      balance.balance = Number(req.body.balance);
      balance.payPeriod = Number(req.body.payPeriod);
      balance.currentPeriodEndDate = Date.parse(req.body.currentPeriodEndDate);
      balance.rentAmount = Number(req.body.rentAmount);

      balance
        .save()
        .then(() => res.status(200).json("Balance updated"))
        .catch((err) => res.status(400).json("Error" + err));
    })
    .catch((err) => res.status(400).json("Error" + err));
});

router.route("/delete/:id").delete((req, res) => {
  Balance.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json("Balance deleted"))
    .catch((err) => res.status(400).json("Error" + err));
});

module.exports = router;
