import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';

const imagesrc = "https://i.scdn.co/image/ab6761610000e5eb920dc1f617550de8388f368e"

export default function MusicCard() {
  return (
    <Card variant="outlined" sx={{ width: 400, backgroundColor: 'rgb(24, 24, 24)' }}>
      <CardOverflow>
        <AspectRatio ratio="2">
          <img
            src={imagesrc}
            loading="lazy"
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <Typography level="display1" sx={{ fontSize: 30, mt: 2, color: '#FFFFFF' }}>
        Radioactive
      </Typography>
      <Typography level="body2" sx={{ fontSize: 20, mt: 0.5, mb: 2, color: '#B3B3B3' }}>
        Imagine Dragons
      </Typography>
      <Divider />
      <CardOverflow>
        <Typography level="body2" sx={{ mt: 2, mb: 2 }}>
            Keywords:
            <Chip
                color="neutral"
                disabled={false}
                onClick={function(){}}
                size="sm"
                variant="soft"
                sx={{ ml: 1 }}
            >
                Rock
            </Chip>
            <Chip
                color="neutral"
                disabled={false}
                onClick={function(){}}
                size="sm"
                variant="soft"
                sx={{ ml: 1 }}
            >
                Pop
            </Chip>
            <Chip
                color="neutral"
                disabled={false}
                onClick={function(){}}
                size="sm"
                variant="soft"
                sx={{ ml: 1 }}
            >
                Fighting
            </Chip>
        </Typography>
      </CardOverflow>
    </Card>
  );
}