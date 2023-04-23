import React from 'react'
import { ReactDOM } from 'react';
import dynamic from 'next/dynamic';

const MusicPlayer = dynamic(() => import('@/components/musicPlayer'), {
    ssr: false
});

/* ReactDOM.render(
    <MusicPlayer />,
    document.getElementById('root')
); */

export default function test() {
    return (
        <div>
            <MusicPlayer />
        </div>
    )
}