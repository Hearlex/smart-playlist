import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';

export default function MusicCard() {
  const tags = ['Rock', 'Pop', 'Fighting'];

  return (
    <Card variant="soft" sx={{ width: '20vw', height: '25vh', backgroundColor: 'rgb(24, 24, 24)' }}>
      <Typography level="h2" sx={{ color: '#FFFFFF' }}>
        Radioactive
      </Typography>
      <Typography level="h4" sx={{ mt: 0.5, mb: 2, color: '#B3B3B3' }}>
        Imagine Dragons
      </Typography>
      <Divider />
      <CardOverflow>
        <Typography level="body2" sx={{ mt: 2, mb: 1 }}>
            Tags:
        </Typography>
        {tags.map((tag, index) => (  
              <Chip
              color="neutral"
              key={index}
              size="sm"
              variant="soft"
              sx={{ mr: 1 }}
              >
                  {tag}
              </Chip>
            ))}
      </CardOverflow>
    </Card>
  );
}