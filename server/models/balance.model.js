const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const balanceSchema = new Schema({
    balance: { type: Number, required: true },
    payPeriod: { type: Number, required: true },
    currentPeriodEndDate: { type: Date, required: true },
    rentAmount: { type: Number, required: true }
}, {
    timestamps: false
});

const Balance = mongoose.model('Balance', balanceSchema);

module.exports = Balance;