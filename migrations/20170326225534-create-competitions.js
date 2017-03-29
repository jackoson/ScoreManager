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
  return db.createTable('competitions',
    {
      ID : { type: 'int', notNull: true, primaryKey: true },
      name : { type: 'string', length: 50 },
      type : { type: 'string', length: 30 }
    },
    function() {
      db.addColumn('matches', 'competitionID', { type: 'int' }, callback);
    }
    );
};

exports.down = function(db, callback) {
  return db.dropTable('competitions', callback);
};

exports._meta = {
  "version": 1
};
