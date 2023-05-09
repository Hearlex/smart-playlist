

export default async function handler(req, res) {
    var body = req.body;
    
    // This is a workaround for the fact that the body is not parsed as JSON when the request is sent from the python tests for the limitations of requests lib.
    try {
        body = JSON.parse(req.body);
    } catch (error) {
        if (error instanceof SyntaxError) {
            body = req.body;
        } else {
            console.log(error);
            return res.status(500).json({ message: 'Error' })
        }
    }
    console.log('body: ', body);

    const sqlite3 = require('sqlite3').verbose();

    try {

        body.forEach(data => {
            if (!data.id || !data.order) {
                throw new Error('Invalid data');
            }
        });

        // open database
        let db = new sqlite3.Database('./db/test.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the file SQlite database.');
        });

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
    
        console.log("body: ", body)
        db.serialize(() => {
            db.run("DELETE FROM playlist WHERE 1=1");
    
            let stmt = db.prepare("INSERT INTO playlist VALUES (?, ?)");
            body.forEach(data => {
                stmt.run(data.id, data.order);
            });
    
            stmt.finalize();
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
        console.log('Error');
        return res.status(500).json({ message: 'Error' })
    }

    console.log('Success')
    return res.status(200).json({ message: 'Success' })
}