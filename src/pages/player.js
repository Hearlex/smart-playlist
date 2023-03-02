import IconButton from '@mui/joy/IconButton';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Link from 'next/link';
import Footer from '@/components/footer';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';
import Textarea from '@mui/joy/Textarea';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Home from '@mui/icons-material/Home';
import Card from '@mui/joy/Card';
import { Typography } from '@mui/joy';
import Chip from '@mui/joy/Chip';
import Button from '@mui/joy/Button';

export default function Player() {
    return (
        <>
            <Link href="/">
                <IconButton variant="plain" size="lg" sx={{color: 'white'}}>
                    <KeyboardReturnIcon />
                </IconButton>
            </Link>
            
            <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={12}
            >
                <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                    <Grid xs={12}>
                    <Textarea
                        minRows={2}
                        placeholder="Write your prompt here..."
                        size="lg"
                        variant="soft"
                        sx={{ height: 300, backgroundColor: 'rgb(24, 24, 24)', color: '#CCCCCC' }}
                    />
                    </Grid>
                    <Grid xs={9}>
                        
                    </Grid>
                    <Grid xs={3}>
                    <Button
                        color="neutral"
                        onClick={function(){}}
                        size="lg"
                        variant="outlined"
                        sx={{ backgroundColor: '#CCCCCC' }}
                    >
                        Generate Playlist
                    </Button>
                    </Grid>
                </Grid>
                <Card variant="outlined" sx={{ width: 1000, backgroundColor: 'rgb(24, 24, 24)' }}>
                    <List
                        size='lg'
                        variant='outlined'
                    >
                        { Array.from({ length: 10 }).map((_, index) => (
                        <ListItem
                        variant="outlined"
                        sx={{ mb: 1 }}
                        >
                            <ListItemButton>
                                <ListItemDecorator><Home /></ListItemDecorator>
                                <ListItemContent>
                                <Typography level="display1" sx={{ fontSize: 20, color: '#CCCCCC' }}>
                                    Radioactive: Imagine Dragons
                                    <Typography level="body" sx={{ fontSize: 20, color: '#000000' }}>
                                    <Chip
                                        color="neutral"
                                        disabled={false}
                                        onClick={function(){}}
                                        size="sm"
                                        variant="soft"
                                        sx={{ ml: 1, backgroundColor: '#CCCCCC' }}
                                    >
                                        Rock
                                    </Chip>
                                    <Chip
                                        color="neutral"
                                        disabled={false}
                                        onClick={function(){}}
                                        size="sm"
                                        variant="soft"
                                        sx={{ ml: 1, backgroundColor: '#CCCCCC' }}
                                    >
                                        Pop
                                    </Chip>
                                    <Chip
                                        color="neutral"
                                        disabled={false}
                                        onClick={function(){}}
                                        size="sm"
                                        variant="soft"
                                        sx={{ ml: 1, backgroundColor: '#CCCCCC' }}
                                    >
                                        Fighting
                                    </Chip></Typography>
                                </Typography>
                                </ListItemContent>
                                <KeyboardArrowRight />
                            </ListItemButton>
                        </ListItem>
                        ))}
                    </List>
                </Card>
            </Stack>

            <Footer />
        </>
    )
}