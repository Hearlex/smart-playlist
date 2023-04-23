import IconButton from '@mui/joy/IconButton';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Link from 'next/link';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';
import Textarea from '@mui/joy/Textarea';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Home from '@mui/icons-material/Home';
import Card from '@mui/joy/Card';
import { Typography } from '@mui/joy';
import Chip from '@mui/joy/Chip';
import Button from '@mui/joy/Button';
import MusicListItem from '@/components/musicListItem';
import React from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import Footer from '@/components/footer';
import Slider from '@mui/joy/Slider';

export default function Player({playList, musicLength, refreshPlayer}) {
    const [prompt, setPrompt] = React.useState('');
    const [songCount, setSongCount] = React.useState(1);

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleSongCountChange = (event, value) => {
        setSongCount(value);
    };

    const handlePrompt = async (event) => {
        const data = {
          prompt: prompt,
          songCount: songCount,
          musicScale: 10,
          keyScale: 4
        }
    
        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);
    
        // API endpoint where we send form data.
        const endpoint = process.env.API_URL+'/playlist';
    
        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json',
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata,
        }

        const response = await fetch(endpoint,  options);

        var result = await response.json();
        const entries = Object.entries(result);
        result = entries.sort((a, b) => a[1] - b[1]).reverse();
        console.log(result)

        var newPlayList = [];
        result.forEach((item, index) => {
            newPlayList.push({
            'id': item[0],
            'order': index,
            });
        })

        await fetch('/api/updatePlaylist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPlayList),
        })
        
        console.log(refreshPlayer);
        Router.reload();
      }


    return (
        <>
            <Link href="/">
                <IconButton variant="plain" size="lg" sx={{color: 'white'}}>
                    <KeyboardReturnIcon />
                </IconButton>
            </Link>
            
            <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={12}
            >
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid xs={12}>
                    <Textarea
                        minRows={2}
                        placeholder="Write your prompt here..."
                        size="lg"
                        variant="soft"
                        name='prompt'
                        value={prompt}
                        onChange={handlePromptChange}
                        sx={{ height: 300, backgroundColor: 'rgb(24, 24, 24)', color: '#CCCCCC' }}
                    />
                    </Grid>
                    <Grid xs={9}>
                        <Slider
                            color="neutral"
                            disabled={false}
                            marks
                            orientation="horizontal"
                            size="lg"
                            valueLabelDisplay="auto"
                            variant="plain"
                            sx={{ mx: '1em', width: '90%' }}
                            min={1}
                            max={musicLength}
                            onChangeCommitted={handleSongCountChange}
                        />
                    </Grid>
                    <Grid xs={3}>
                    <Button
                        color="neutral"
                        onClick={handlePrompt}
                        size="lg"
                        variant="soft"
                        sx={{ backgroundColor: 'rgb(24, 24, 24)' }}
                    >
                        Generate Playlist
                    </Button>
                    </Grid>
                </Grid>
                <Card variant="outlined" sx={{ width: 1000, backgroundColor: 'rgb(24, 24, 24)' }}>
                    <List
                        size='lg'
                        variant='outlined'
                    >
                        { playList.length > 0 ?
                            playList.map((item, index) => (
                                <MusicListItem id={item.id} artist={item.artist} title={item.title} tags={item.tags} action='none'/>
                            ))
                            :
                            <Typography variant="h4" sx={{color: '#CCCCCC'}}>
                                No music in playlist
                            </Typography>
                        }
                    </List>
                </Card>
            </Stack>

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

    // gather number of music
    let sql = `SELECT Count(*) FROM music`;
    let musicLengthPromise = new Promise((resolve, reject) => {
        db.get(sql, [], (err, row) => {
            if (err) {
                console.error(err.message);
                return reject(err);
            }
            

            return resolve(row['Count(*)']);
        });
    });

    //gather music from database
    sql = `SELECT * FROM playlist INNER JOIN music ON playlist.id = music.id ORDER BY playlist.listOrder ASC`;
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
    let musicLength = await musicLengthPromise;
    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the database connection.');
    });
    console.log(playList);
    return {
        props: {playList, musicLength},
    }
}