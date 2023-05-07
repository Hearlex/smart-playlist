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


export default function Footer({}) {
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
    
    var tempplaylist = []
    playList.map((item) => {
        tempplaylist.push({
            name: item.title,
            src: item.path,
        })
    })

    const setPlayerToSong = (index) => {
        if (audio != null) {
            audio.current.state.currentPlaylistPos = index.id;
            audio.current.loadSrc();
        }
    }
    
    const updatePlaylist = async () => {
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
                <Grid xs={12}>
                    <Sheet variant="soft" sx={{mx: '15%', my: '2em', backgroundColor: 'rgb(24, 24, 24)'}}>
                        {
                        playList.length > 0
                        &&
                        <Audio
                            width={'100%'}
                            height={'1000'}
                            fullPlayer={false}
                            playlist={tempplaylist}
                            color='rgb(80, 80, 80)'
                            ref={audio}
                        />
                        }
                    </Sheet>
                </Grid>
            </Grid>
        </Sheet>
    )
}