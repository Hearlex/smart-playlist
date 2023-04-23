import IconButton from '@mui/joy/IconButton';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Link from 'next/link';
import { Card } from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import Home from '@mui/icons-material/Home';
import { Typography } from '@mui/joy';
import Chip from '@mui/joy/Chip';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import MusicUpload from '../components/musicUpload';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import MusicListItem from '@/components/musicListItem';

const imagesrc = "https://i.scdn.co/image/ab6761610000e5eb920dc1f617550de8388f368e"

export default function Database({musicList}) {
    return (
        <>
            <Link href="/">
                <IconButton variant="plain" size="lg" sx={{color: 'white'}}>
                    <KeyboardReturnIcon />
                </IconButton>
            </Link>
            <Card variant="outlined" sx={{backgroundColor: 'rgb(24, 24, 24)', maxHeight: 700, overflow: 'auto'}}>
                <List
                    size='lg'
                    variant='outlined'
                >
                    { 
                        musicList.length > 0 ?
                        musicList.map((item, index) => (
                            <MusicListItem id={item.id} artist={item.artist} title={item.title} tags={item.tags} action='remove'/>
                        ))
                        :
                        <Typography variant="h4" sx={{color: '#CCCCCC'}}>
                            No music in database
                        </Typography>
                    }
                </List>
            </Card>
            <Card variant="outlined" sx={{backgroundColor: 'rgb(24, 24, 24)', mt: 2}}>
                <MusicUpload />
            </Card>
        </>
    )
}

export async function getServerSideProps() {
    const sqlite3 = require('sqlite3').verbose();

    // open database
    let db = new sqlite3.Database('./db/test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the file SQlite database.');
    });

    //gather music from database
    
    let sql = `SELECT * FROM music`;
    let musicListPromise = new Promise((resolve, reject) => {
        var musicList = [];
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error(err.message);
                return reject(err);
            }
            rows.forEach((row) => {
                musicList.push({
                    id: row.id,
                    title: row.title,
                    artist: row.artist,
                    tags: row.tags,
                });
                //console.log(row.name);
            });
            return resolve(musicList);
        });
    });
    
    let musicList = await musicListPromise;
    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    //console.log(musicList);
    return {
        props: {musicList},
    }
}