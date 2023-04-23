const fs = require('fs');

export default function handler(req, res) {
    const body = req.body;

    const sqlite3 = require('sqlite3').verbose();

    // open database
    let db = new sqlite3.Database('./db/test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the file SQlite database.');
    });

    db.get(`SELECT * FROM music WHERE id = (?)`, [body.id], function(err, row) {
        if (err) {
            return console.log(err.message);
        }
        
        // remove file from disk
        console.log(row)
        fs.unlink("public/"+row.path, (err) => {
            if (err) {
                console.error(err)
                return
            }
            //file removed
        });
    });

    db.run(`DELETE FROM music WHERE id = (?)`, [body.id], function(err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been removed with rowid ${this.lastID}`);
    });

    // close the database connection
    db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
    });

    console.log('name: ', body.name);
    if (body.name) {
        res.status(200).json({ name: body.name })
    } else {
        res.status(400).json({ message: 'Missing name' })
    }
}