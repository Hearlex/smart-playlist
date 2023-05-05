import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'

import MainMenu from '@/components/mainMenu'
import * as React from 'react';
import Stack from '@mui/joy/Stack';
import MusicCard from '@/components/musicCard';
import Button from '@mui/joy/Button';
import { Grid } from '@mui/joy'
import Header from '@/components/header'
import Sheet from '@mui/joy/Sheet'

const inter = Inter({ subsets: ['latin'] })

export default function Main({playList, footerInstance}) {
    return (
      <>
        <Head>
          <title>Main Menu</title>
          <meta name="description" content="This is the main menu for the smart playlist generator application" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Public+Sans&display=swap"
          />
        </Head>
        <Header />
        <div style={{position: 'fixed', width: '100%', top: '35vh'}}>
          <Grid container alignItems="center" justifyContent="center">
            <Grid xs={4}>
              <MusicCard />
            </Grid>
            <Grid xs={4}>
              <Stack spacing={6}>
                <Link href="/player">
                  <Button
                    color="neutral"
                    size="lg"
                    variant="soft"
                    sx={{ width: '40vw', height: '12vh', backgroundColor: 'rgb(24, 24, 24)' }}
                  >
                    Request & Player
                  </Button>
                </Link>
                <Link href="/database">
                  <Button
                    color="neutral"
                    size="lg"
                    variant="soft"
                    sx={{ width: '40vw', height: '12vh', backgroundColor: 'rgb(24, 24, 24)' }}
                  >
                    Music Database
                  </Button>
              </Link>
              </Stack>
            </Grid>
          </Grid>
        </div>
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
  
  let sql = `SELECT * FROM playlist INNER JOIN music ON playlist.id = music.id`;
  let playListPromise = new Promise((resolve, reject) => {
      var playList = [];
      db.all(sql, [], (err, rows) => {
          if (err) {
              console.error(err.message);
              return reject(err);
          }
          rows.forEach((row) => {
              playList.push({
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
  // close the database connection
  db.close((err) => {
      if (err) {
          return console.error(err.message);
      }
      console.log('Close the database connection.');
  });
  console.log(playList);
  return {
      props: {playList},
  }
}