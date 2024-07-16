const { v4: uuid } = require("uuid");

function getUniqueId() {
    return uuid();
}

module.exports = getUniqueId;