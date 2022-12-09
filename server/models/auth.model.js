const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: {type: Number, required: false},
    renterId: {type: Number, required: true},
    balanceId: {type: String, required: true}
}, {
    timestamps: false
});

const Auth = mongoose.model('Auth', authSchema);

module.exports = Auth;