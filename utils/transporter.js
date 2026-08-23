const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
        user: '666majharulislam@gmail.com',
        pass: 'rhvmfvcnqeegqyxv',
    },
});

module.exports = transporter