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
  db.createTable('teams',
    {
      ID : { type: 'int', notNull: true, primaryKey: true },
      name : { type: 'string', length: 50 }
    },
    function() {
      db.createTable('teamplayers',
        {
          ID : { type: 'int', notNull: true, primaryKey: true },
          teamID : { type: 'int', notNull: true },
          playerID : { type: 'int', notNull: true }
        },
        callback
      );
    }
  );
};

exports.down = function(db, callback) {
  db.dropTable('teams', function() { db.dropTable('teamplayers', callback); })
};

exports._meta = {
  "version": 1
};
