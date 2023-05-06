export default function handler(req, res) {
    const body = req.body;

    const sqlite3 = require('sqlite3').verbose();

    try {
        // open database
        let db = new sqlite3.Database('./db/test.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the file SQlite database.');
        });
    
        db.run(`UPDATE music SET artist = (?), title = (?), tags = (?) WHERE id = (?)`, [body.artist, body.title, body.tags, body.id], function(err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been modified with rowid ${this.lastID}`);
        });
    
        // close the database connection
        db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
        });
    } catch (error) {
        console.log(error);
    }
    
    if (body.artist && body.title && body.tags && body.id) {
        res.status(200).json({ artist: body.artist, title: body.title, tags: body.tags, id: body.id })
    } else {
        res.status(400).json({ message: 'Missing parameters' })
    }
}