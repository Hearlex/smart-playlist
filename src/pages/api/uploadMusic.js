import fs from "fs";
const formidable = require('formidable');

export const config = {
    api: {
        bodyParser: false,
    },
}

/* export const config = {
    api: {
        bodyParser: {
            sizeLimit: '100mb', // Set desired value here
        }
    }
} */

export default async function handler(req, res) {    
    const sqlite3 = require('sqlite3').verbose();

    console.log('start');

    const data = await new Promise((resolve, reject) => {
        const form = formidable();

        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve(fields, files);
            var filename = files.file.originalFilename;
            
            if (fields.artist && fields.title && fields.tags && files.file) {
                console.log('filename: ', filename);
                const music = fs.readFileSync(files.file.filepath)
                var path = `./public/music/${filename}`;
                var localPath = `music/${filename}`;
                fs.writeFileSync(path, music);

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
                
                console.log("fields: ", fields)
                db.run(`INSERT INTO music(artist, title, tags, path) VALUES (?,?,?,?)`, [fields.artist, fields.title, fields.tags, localPath], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }
                    // get the last insert id
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                });
            
                // close the database connection
                db.close((err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Close the database connection.');
                });
            
                res.status(200).json({ fields })
            }
            else {
                console.log('No path or file');
                res.status(400).json({ message: 'Error during file upload.' })
            }
        });
    });


}