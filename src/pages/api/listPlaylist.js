export default async function handler(req, res) {
    const body = req.body;

    const sqlite3 = require('sqlite3').verbose();

    // open database
    let db = new sqlite3.Database('./db/test.db', sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the file SQlite database.');
    });

    //gather music from database
    
    let sql = `SELECT * FROM playlist INNER JOIN music ON playlist.id = music.id ORDER BY playlist.listOrder ASC`;
    let playListPromise = new Promise((resolve, reject) => {
        var playList = [];
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                return reject(err);
            }
            rows.forEach((row) => {
                playList.push({
                    id: row.id,
                    order: row.listOrder,
                    title: row.title,
                    artist: row.artist,
                    tags: row.tags,
                    path: row.path,
                });
                //console.log(row.name);
            });
            return resolve(playList);
        });
    });
    
    let playList = await playListPromise;
    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    console.log(playList);

    if (playList) {
        res.status(200).json({ playList: playList })
    } else {
        res.status(400).json({ message: 'Missing PlayList' })
    }
}