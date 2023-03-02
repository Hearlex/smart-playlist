import React, { Component } from 'react';
import { Inter } from 'next/font/google'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function MainMenu({ children }) {
    return (
        <>
            <Header />
            <main class='main'>{children}</main>
            <Footer />
        </>
        )
}