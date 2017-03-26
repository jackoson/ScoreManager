var sqlite3 = require("sqlite3");
var path = require("path");

module.exports.openDatabase = openDatabase = function() {
  return new sqlite3.Database(path.resolve(__dirname, '../../../tennis.db'));
}