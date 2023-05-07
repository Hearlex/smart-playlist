const sqlite3 = require('sqlite3').verbose();

// open database
let db = new sqlite3.Database('./db/test.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX, (err) => {
if (err) {
    return console.error(err.message);
}
console.log('Connected to the file SQlite database.');
});

/* 
db.serialize(() => {
    db.each(`SELECT * FROM music`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      else {
        console.log(row)
        console.log(row.id + "\t" + row.name);
      }
    });
}); */

/* db.run(`INSERT INTO music(name) VALUES (?)`, ['Coldplay: Scientist'], function(err) {
    if (err) {
        return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
}); */

/* db.run('DROP TABLE IF EXISTS music'); */

db.run(`
CREATE TABLE IF NOT EXISTS music (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  artist TEXT NOT NULL,
  title TEXT NOT NULL,
  tags TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE
)`);
  
db.run(`
CREATE TABLE IF NOT EXISTS playlist (
    id INTEGER PRIMARY KEY,
    listOrder INTEGER
)`);

/* db.run(`UPDATE music SET path = ? WHERE id = ?`, ['Coldplay', 1], function(err) { */

// close the database connection
db.close((err) => {
if (err) {
    return console.error(err.message);
}
console.log('Close the database connection.');
});