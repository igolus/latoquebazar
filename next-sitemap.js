const config = require("./src/conf/config.json");

module.exports = {
    siteUrl: config.siteBaseUrl,
    generateRobotsTxt: true, // (optional)
    exclude: [
        "/address/*",
        "/address",
        "/cart",
        "/confirmed/*",
    ]
}