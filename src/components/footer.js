import React, { Component, useEffect } from 'react';
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

let audioInstance = null;

    
const Audio = dynamic(() => import('react-audioplayer'), {
    ssr: false
});

export default function Footer({}) {
    /* const ReactHowler = dynamic(() => import('react-howler'), {
        ssr: false
    }); */
    
    const path = useRouter().pathname;
    const [playList, setPlayList] = useState([]);
    
    const playlist = []
    playList.map((item) => {
        playlist.push({
            name: item.title,
            src: item.path,
        })
    })
    
    const updatePlaylist = async (setPlayList) => {
        const res = await fetch('/api/listPlaylist', {
            method: 'GET',
        });
        
        const result = await res.json();
        setPlayList(result.playList);
    }
    useEffect(() => {updatePlaylist(setPlayList)}, []);

    return (
        <Sheet elevation={10} sx={{
            position: 'fixed',
            bottom: 0,
            left:0,
            width: '100%',
            height: '10em',
            backgroundColor: 'rgb(24, 24, 24)',
            overflow: 'hidden',
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
                    <Sheet variant="soft" sx={{mx: '15%', my: '2em', height: '40%', backgroundColor: 'rgb(24, 24, 24)'}}>
                        {/* <ReactHowler
                            src={['music/intheend.wav']}
                            playing={true}
                        /> */}
                        {
                        playList.length > 0
                        &&
                        <Audio
                            width={'100%'}
                            height={'1000'}
                            fullPlayer={false}
                            playlist={playlist}
                            color='rgb(80, 80, 80)'
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