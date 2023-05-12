import IconButton from '@mui/joy/IconButton';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Link from 'next/link';
import { Card, Textarea } from '@mui/joy';
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
import MusicListItem from '@/components/musicListItem';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import eventBus from '../components/eventBus';
import { useEffect, useRef } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import { useState } from 'react'; 
import ModalClose from '@mui/joy/ModalClose';
import Router from 'next/router';

export default function Database({musicList}) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const [artist, setArtist] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');

    const handleModify = async (event) => {
        event.preventDefault();

        const data = {
            id: id,
            title: title,
            artist: artist,
            tags: tags,
        }

        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);
    
        // API endpoint where we send form data.
        const endpoint = '/api/updateMusic';
    
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
    
        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options);

        if (response.status != 200) {
            Notify.failure('Modification Failed', {position: 'left-bottom'});
            return;
        }
        Notify.success('Modification Successful', {position: 'left-bottom'});
    
        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json();
        //alert(`Removed with name: ${result.name}`);
        Router.reload();
    }

    useEffect(() => {
        eventBus.on('rebuildRequest', (data) => {
            Loading.pulse('Rebuilding trees...')
        })
        eventBus.on('openModifyModal', (data) => {
            if (!open) {
                console.log(data);
                setId(data.id);
                setArtist(data.artist);
                setTitle(data.title);
                setTags(data.tags);
                setOpen(true);
            }
        })

        Loading.init({svgColor: '#FFFFFF',});
    })

    return (
        <div class='database'>
            <Modal open={open} onClose={() => setOpen(false)} size='lg' keepMounted>
                <ModalDialog aria-labelledby="modify-modal-dialog" aria-describedby="A modal where you can modify the music information">
                    <ModalClose />
                    <Typography id="modify-modal-dialog" level="h2">
                        Modify Music
                    </Typography>
                    <Typography id="modify-modal-description" level="body1">
                        Modify the music information here.
                    </Typography>
                    <form onSubmit={handleModify}>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <FormControl>
                                <FormLabel>Artist</FormLabel>
                                <Input autoFocus required type="text" value={artist} onChange={(event) => {setArtist(event.target.value)}}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Title</FormLabel>
                                <Input required type="text" value={title} onChange={(event) => {setTitle(event.target.value)}}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Tags</FormLabel>
                                <Textarea required type="text" value={tags} onChange={(event) => {setTags(event.target.value)}}/>
                            </FormControl>
                            <Button type="submit" color="neutral" variant="plain" >Modify</Button>
                        </Stack>
                    </form>
                </ModalDialog>
            </Modal>
            <Link href="/">
                <IconButton variant="plain" size="lg" sx={{color: 'white'}}>
                    <KeyboardReturnIcon />
                </IconButton>
            </Link>
            <Card variant="outlined" sx={{backgroundColor: 'rgb(24, 24, 24)', height: '70svh', overflow: 'auto'}}>
                <List
                    size='lg'
                    variant='outlined'
                    >
                    { 
                        musicList.length > 0 ?
                        musicList.map((item, index) => (
                            <MusicListItem key={index} id={item.id} artist={item.artist} title={item.title} tags={item.tags} action='remove'/>
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
        </div>
    )
}

export async function getServerSideProps() {
    const sqlite3 = require('sqlite3').verbose();

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