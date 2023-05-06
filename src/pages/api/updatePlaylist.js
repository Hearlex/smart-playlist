

export default async function handler(req, res) {
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
    }

    return res.status(200).json({ message: 'Success' })
}