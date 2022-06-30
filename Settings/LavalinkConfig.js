require("dotenv").config();

module.exports = {
    nodes: [{
        url: process.env.NODE_URL,
        name: process.env.NODE_NAME,
        auth: process.env.NODE_AUTH,
        secure: process.env.NODE_SECURE
    }]
}