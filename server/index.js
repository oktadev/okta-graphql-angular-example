const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bearerToken = require('express-bearer-token');
const oktaAuth = require('./auth')

const app = express()
  .use(cors())
  .use(bodyParser.json())
  .use(bearerToken())
  .use(oktaAuth);

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('tennis.db');

const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');

const schema = buildSchema(`
  type Query {
    players(offset:Int = 0, limit:Int = 10): [Player]
    player(id:ID!): Player
    rankings(rank:Int!): [Ranking]
  }

  type Player {
    id: ID
    first_name: String
    last_name: String
    hand: String
    birthday: Int
    country: String
  }

  type Ranking {
    date: Int
    rank: Int
    player: Player
    points: Int
  }
`);

function query(sql, single) {
  return new Promise((resolve, reject) => {
    var callback = (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    };

    if (single) db.get(sql, callback);
    else db.all(sql, callback);
  });
}

const root = {
  players: (args) => {
    return query(`SELECT * FROM players LIMIT ${args.offset}, ${args.limit}`, false);
  },
  player: (args) => {
    return query(`SELECT * FROM players WHERE id='${args.id}'`, true);
  },
  rankings: (args) => {
    return query(
      `SELECT r.date, r.rank, r.points,
              p.id, p.first_name, p.last_name, p.hand, p.birthday, p.country
       FROM players AS p
       LEFT JOIN rankings AS r
       ON p.id=r.player
       WHERE r.rank=${args.rank}`, false)
    .then((rows) => rows.map(result => {
        return {
          date: result.date,
          points: result.points,
          rank: result.rank,
          player: {
            id: result.id,
            first_name: result.first_name,
            last_name: result.last_name,
            hand: result.hand,
            birthday: result.birthday,
            country: result.country
          }
        };
    }));
  },
};

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4201, (err) => {
  if (err) {
    return console.log(err);
  }
  return console.log('My Angular App listening on port 4201');
});
