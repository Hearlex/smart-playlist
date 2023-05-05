import React, { Component, useCallback, useEffect, useRef } from 'react';
import { Inter } from 'next/font/google'
import Sheet from '@mui/joy/Sheet'
import dynamic from 'next/dynamic';
import { useContext } from 'react';
import { useState } from 'react';
import useSessionStorage from 'hooks/useSessionStorage'
import { IconButton } from '@mui/joy';
import RefreshIcon from '@mui/icons-material/Refresh';
import Grid from '@mui/joy/Grid';
import { useRouter } from 'next/router';
import eventBus from '../components/eventBus';
import ReactDOM from 'react-dom';
import Audio from 'react-audioplayer';

let audioInstance = null;

    
/* const Audio = dynamic(() => import('react-audioplayer'), {
    ssr: false
}); */

export default function Footer({}) {
    /* const ReactHowler = dynamic(() => import('react-howler'), {
        ssr: false
    }); */
    var song = -1;
    var audio = useRef(null);
    useEffect(() => {updatePlaylist(setPlayList)}, []);
    useEffect(() => {
        eventBus.on('setPlayerToSong', (index) => {
            setPlayerToSong(index);
        });
    });
    useCallback()
    const path = useRouter().pathname;
    const [playList, setPlayList] = useState([]);
    
    
    setInterval(() => {
        if (audio.current != null) {
            if (audio.current.state.currentPlaylistPos != song) {
                console.log('song changed', audio.current.state.currentPlaylistPos, song)
                song = audio.current.state.currentPlaylistPos;
                eventBus.dispatch('musicChanged', playList[audio.current.state.currentPlaylistPos])
            }
        }
    }, 1000);
    
    const playlist = []
    playList.map((item) => {
        playlist.push({
            name: item.title,
            src: item.path,
        })
    })

    const audioLoaded = () => {
        console.log('audio loaded')
        eventBus.dispatch('musicChanged', playList[audio.current.state.currentPlaylistPos])
    }

    const setPlayerToSong = (index) => {
        if (audio != null) {
            audio.current.state.currentPlaylistPos = index.id;
            audio.current.loadSrc();
        }
    }
    
    const updatePlaylist = async (setPlayList) => {
        const res = await fetch('/api/listPlaylist', {
            method: 'GET',
        });
        
        const result = await res.json();
        setPlayList(result.playList);
    }

    return (
        <Sheet elevation={10} sx={{
            position: 'fixed',
            bottom: 0,
            left:0,
            width: '100%',
            height: '20vh',
            backgroundColor: 'rgb(24, 24, 24)',
            overflow: 'none',
            display: path == '/database' ? 'none' : 'block',
        }}
        >
            <Grid container spacing={2}>
                {/* <Grid xs={2}>
                    <IconButton variant="outlined" onClick={() => updatePlaylist(setPlayList)} sx={{my:'1em', mx: '1em'}}>
                        <RefreshIcon />
                    </IconButton>
                </Grid> */}
                <Grid xs={12}>
                    <Sheet variant="soft" sx={{mx: '15%', my: '2em', backgroundColor: 'rgb(24, 24, 24)'}}>
                        {
                        playList.length > 0
                        &&
                        <Audio
                            width={'100%'}
                            height={'1000'}
                            fullPlayer={false}
                            playlist={playlist}
                            color='rgb(80, 80, 80)'
                            ref={audio}
                        />
                        }
                    </Sheet>
                </Grid>{/* 
                <Grid xs={2}>
                </Grid> */}
            </Grid>
        </Sheet>
    )
}