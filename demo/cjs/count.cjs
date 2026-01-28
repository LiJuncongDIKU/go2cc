let count = 0;
module.exports = { 
  raise() { count++ }, 
  count,
  getCount() { return count }
};