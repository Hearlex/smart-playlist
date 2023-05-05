import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import { useEffect, useState } from 'react';
import eventBus from './eventBus';

export default function MusicCard() {
  const [music, setMusic] = useState(null);
  
  useEffect(() => {
    eventBus.on('musicChanged', (data) => {
      setMusic(data);
    })
  })

  return (
    <Card variant="soft" sx={{ width: '20vw', maxHeight:'30vh', overflow:'auto', backgroundColor: 'rgb(24, 24, 24)' }}>
      <Typography level="h2" sx={{ color: '#FFFFFF' }}>
        {(music == null && "Not playing") || music.title}
      </Typography>
      <Typography level="h4" sx={{ mt: 0.5, mb: 2, color: '#B3B3B3' }}>
        {(music == null && " ") || music.artist}
      </Typography>
      <Divider />
      <CardOverflow>
        <Typography level="body2" sx={{ mt: 2, mb: 1 }}>
            Tags:
        </Typography>
        {(music == null && " ") || music.tags.split(',').map((tag, index) => (  
              <Chip
              color="neutral"
              key={index}
              size="sm"
              variant="soft"
              sx={{ mr: 1, mb: 1 }}
              >
                  {tag}
              </Chip>
            ))}
      </CardOverflow>
    </Card>
  );
}