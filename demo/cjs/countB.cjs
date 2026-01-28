
const countModule = require('./count.cjs');
module.exports = {
    raise: countModule.raise,
    getCount: countModule.getCount,
    count: countModule.count,
};