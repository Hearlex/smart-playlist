import React, { Component } from 'react';
import { Inter } from 'next/font/google'
import Sheet from '@mui/joy/Sheet'

export default function Header() {
    return (
        <Sheet sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '14vh',
            backgroundColor: 'rgb(24, 24, 24)',
        }}
        >

        </Sheet>
    )
}