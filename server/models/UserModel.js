const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },

    username: {
        type: String,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false,
        select: false
    },

    otp: {
        type: String,
        select: false
    },

    otpExpiry: {
        type: Date,
        select: false
    }
});


// Password hash before saving
userSchema.pre("save", async function () {

    if (!this.isModified("password")) {
        return;
    }

    this.password = await bcrypt.hash(this.password, 12);
});


// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


// Create model
const User = mongoose.model("User", userSchema);

module.exports = User;