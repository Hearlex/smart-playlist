import IconButton from '@mui/joy/IconButton';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import Link from 'next/link';
import { Card } from '@mui/joy';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import Home from '@mui/icons-material/Home';
import { Typography } from '@mui/joy';
import Chip from '@mui/joy/Chip';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';

const imagesrc = "https://i.scdn.co/image/ab6761610000e5eb920dc1f617550de8388f368e"

export default function Database() {
    return (
        <>
            <Link href="/">
                <IconButton variant="plain" size="lg" sx={{color: 'white'}}>
                    <KeyboardReturnIcon />
                </IconButton>
            </Link>
            <Card variant="outlined" sx={{backgroundColor: 'rgb(24, 24, 24)', maxHeight: 700, overflow: 'auto'}}>
                <List
                    size='lg'
                    variant='outlined'
                >
                    { Array.from({ length: 20 }).map((_, index) => (
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
            <Card variant="outlined" sx={{backgroundColor: 'rgb(24, 24, 24)', mt: 2}}>
                <Grid container spacing={2}>
                        <Grid xs={3}>
                            <Input />
                        </Grid>
                        <Grid xs={3}>
                            <Input />
                        </Grid>
                        <Grid xs={3}>
                            <Input />
                        </Grid>
                        <Grid xs={3}>
                            <Input />
                        </Grid>
                        <Grid xs={3}>
                            <Input />
                        </Grid>
                        <Grid xs={3}>
                        <Input />
                        </Grid>
                        <Grid xs={3}>
                            <Input />
                        </Grid>
                        <Grid xs={3}>
                            <Input />
                        </Grid>
                </Grid>
            </Card>
        </>
    )
}