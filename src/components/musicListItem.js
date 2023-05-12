import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import { Typography } from '@mui/joy';
import Chip from '@mui/joy/Chip';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import IconButton from '@mui/joy/IconButton';
import Delete from '@mui/icons-material/Delete';
import Router from 'next/router';
import eventBus from '../components/eventBus';
import EditIcon from '@mui/icons-material/Edit';

export default function MusicListItem(props) {
    const setPlayerToSong = (event) => {
        eventBus.dispatch('setPlayerToSong', {id: props.order});
    }

    const handleModify = async (event) => {
        const data = {
          id: props.id,
          title: props.title,
          artist: props.artist,
          tags: props.tags,
        }

        // Open a modal to modify the song data.
        eventBus.dispatch('openModifyModal', data);

    }

    const handleDelete = async (event) => {
        const data = {
          id: props.id,
          title: props.title,
          artist: props.artist,
          tags: props.tags,
          action: props.action,
        }
    
        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data);
    
        // API endpoint where we send form data.
        const endpoint = '/api/removeMusic';
    
        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json',
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata,
        }
    
        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options);

        if (response.status != 200) {
          Notify.failure('Delete Failed', {position: 'left-bottom'});
          return;
        }
        Notify.success('Delete Successful', {position: 'left-bottom'});
    
        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json();
        //alert(`Removed with name: ${result.name}`);
        Router.reload();
      }
      return (
        <ListItem
            variant="outlined"
            sx={{ mb: 1 }}
            key={props.id}
            endAction={
              props.action === 'remove' &&
                [
                  <IconButton key="modify" aria-label="Modify" size="sm" color="warning" sx={{mx: 1}} onClick={handleModify}>
                      <EditIcon />
                  </IconButton>,
                  <IconButton key="delete" aria-label="Delete" size="sm" color="danger" sx={{mx: 1}} onClick={handleDelete}>
                      <Delete />
                  </IconButton>
                ]
            }
            onClick={(props.action === 'choose' && setPlayerToSong) || function(){}}
        >
            <ListItemButton>
                <ListItemDecorator><MusicNoteIcon /></ListItemDecorator>
                <ListItemContent>
                <Typography level="display1" sx={{ fontSize: 20, color: '#CCCCCC' }}>
                    {props.artist}: {props.title}
                    <Typography level="body" sx={{ fontSize: 20, color: '#000000' }}>
                    {props.tags.split(',').map((tag, index) => (
                        <Chip
                        color="neutral"
                        key={index}
                        onClick={function(){}}
                        size="sm"
                        variant="soft"
                        sx={{ ml: 1 }}
                        >
                            {tag}
                        </Chip>
                    ))}
                    </Typography>
                </Typography>
                </ListItemContent>
            </ListItemButton>
        </ListItem>
      )
}