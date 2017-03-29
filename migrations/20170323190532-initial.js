'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('players',
    {
      ID : { type: 'int', notNull: true, primaryKey: true },
      name : { type: 'string', length: 50 },
      sex : { type: 'char', length: 1 }
    },
    callback
  );
};

exports.down = function(db) {
  return db.dropTable('players');
};

exports._meta = {
  "version": 1
};
