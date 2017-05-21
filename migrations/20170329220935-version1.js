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
  players();
  function players() {
    db.createTable('players',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        name : { type: 'string', length: 50 },
        sex : { type: 'char', length: 1 }
      },
      matches
    );
  }
  function matches() {
    db.createTable('matches',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        type : { type: 'string', length: 30 },
        datetime : { type: 'datetime' },
        rubberID : { type: 'int' }
      },
      opponents
    );
  }
  function opponents() {
    db.createTable('opponents',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        matchID : { type: 'int', notNull: true },
        setsWon : { type: 'int' }
      },
      matchplayers
    );
  }
  function matchplayers() {
    db.createTable('matchplayers',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        opponentID : { type: 'int', notNull: true },
        playerID : { type: 'int', notNull: true }
      },
      rubbers
    );
  }
  function rubbers() {
    db.createTable('rubbers',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        competitionID : { type: 'int', notNull: true }
      },
      competitions
    );
  }
  function competitions() {
    db.createTable('competitions',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        name : { type: 'string', length: 50 }
      },
      teams
    );
  }
  function teams() {
    db.createTable('teams',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        name : { type: 'string', length: 50 }
      },
      teamplayers
    );
  }
  function teamplayers() {
    db.createTable('teamplayers',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        teamID : { type: 'int', notNull: true },
        playerID : { type: 'int', notNull: true }
      },
      teamplays
    );
  }
  function teamplays() {
    db.createTable('teamplays',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        teamID : { type: 'int', notNull: true },
        opponentID : { type: 'int', notNull: true }
      },
      users
    );
  }
  function users() {
    db.createTable('users',
      {
        ID : { type: 'int', notNull: true, primaryKey: true },
        name : { type: 'string', notNull: true },
        passwordHash : { type: 'string', notNull: true },
        passwordSalt : { type: 'string', notNull: true }
      },
      callback
    );
  }
};

exports.down = function(db, callback) {
  players();
  function players() { db.dropTable('players', matches); }
  function matches() { db.dropTable('matches', opponents); }
  function opponents() { db.dropTable('opponents', matchplayers); }
  function matchplayers() { db.dropTable('matchplayers', rubbers); }
  function rubbers() { db.dropTable('rubbers', competitions); }
  function competitions() { db.dropTable('competitions', teams); }
  function teams() { db.dropTable('teams', teamplayers); }
  function teamplayers() { db.dropTable('teamplayers', teamplays); }
  function teamplays() { db.dropTable('teamplays', users); }
  function users() { db.dropTable('users', callback); }
};

exports._meta = {
  "version": 1
};
