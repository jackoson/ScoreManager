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
  db.createTable('matches',
    {
      ID : { type: 'int', notNull: true, primaryKey: true },
      type : { type: 'string', length: 30 },
      datetime : { type: 'datetime' }
    },
    callback
  );
};

exports.down = function(db) {
  return db.dropTable('matches');
};

exports._meta = {
  "version": 1
};
