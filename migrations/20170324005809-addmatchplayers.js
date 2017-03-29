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
  db.createTable('matchplayers',
    {
      ID : { type: 'int', notNull: true, primaryKey: true },
      matchID : { type: 'int', notNull: true },
      playerID : { type: 'int', notNull: true },
      setsWon : { type: 'int' }
    },
    callback
  );
};

exports.down = function(db) {
  return db.dropTable('matchplayers');
};

exports._meta = {
  "version": 1
};
