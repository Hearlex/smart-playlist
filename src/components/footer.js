import React, { Component } from 'react';
import { Inter } from 'next/font/google'
import Sheet from '@mui/joy/Sheet'

export default function Footer() {
    return (
        <Sheet elevation={10} sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '10em',
            backgroundColor: 'rgb(24, 24, 24)',
        }}
        >

        </Sheet>
    )
}