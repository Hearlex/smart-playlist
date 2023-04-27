import Grid from '@mui/joy/Grid';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Router from 'next/router';
import React from 'react';
import { Alert } from '@mui/joy/Alert';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { FormHelperText } from '@mui/joy';
import eventBus from "./eventBus"
import { Loading } from 'notiflix/build/notiflix-loading-aio';

export default function MusicUpload() {
    const handleRebuildRequest = async (event) => {
      event.preventDefault();
      eventBus.dispatch("rebuildRequest", null);

      // API endpoint where we send form data.
      const endpoint = process.env.API_URL+'/tree/build';
      
      const options = {
        // The method is POST because we are sending a request.
        method: 'POST',
      }
      
      const response = await fetch(endpoint, options);
      if (response.status != 200) {
        Notify.failure('Rebuild Failed', {position: 'left-bottom'});
        return;
      }
      Notify.success('Rebuild Successful', {position: 'left-bottom'});
      Loading.remove(1000);
    }

    // Handles the submit event on form submit.
    const handleSubmit = async (event) => {
      // Stop the form from submitting and refreshing the page.
      event.preventDefault();
      Loading.pulse('Uploading music...')
      
      var reader = new FileReader();
      let file = event.target.file.files[0];
      let bytes;

      const formData = new FormData();
      formData.append('artist', event.target.artist.value);
      formData.append('title', event.target.title.value);
      formData.append('tags', event.target.tags.value);
      formData.append('path', event.target.path.value);
      formData.append('file', file);

      // API endpoint where we send form data.
      const endpoint = '/api/uploadMusic';

      const options = {
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        // Body of the request is the JSON data we created above.
        body: formData,
      }

      // Send the form data to our forms API and get a response.
      const response = await fetch(endpoint, options);
    
      // Get the response data from server as JSON.
      // If server returns the name submitted, that means the form works.
      const result = await response.json();
      if (response.status != 200) {
        alert(result);
        return;
      }
      //alert(`Uploaded with name: ${response}`);
      Router.reload();
      
    }

    const artistInput = React.useRef(null);
    const titleInput = React.useRef(null);
    const tagsInput = React.useRef(null);
    const hiddenFileInput = React.useRef(null);
    const buttonFileInput = React.useRef(null);
    const submitButton = React.useRef(null);

    const handleFileUploadClick = event => {
        hiddenFileInput.current.children[0].click();
    };

    const [artistInputProps, setArtistInputProps] = React.useState({error: false});
    const [titleInputProps, settitleInputProps] = React.useState({error: false});
    const [tagsInputProps, settagsInputProps] = React.useState({error: false});
    const [buttonFileInputProps, setButtonFileInputProps] = React.useState({});
    const [submitProps, setSubmitProps] = React.useState({disabled: true});
    const [errorText, setErrorText] = React.useState('');

    const handleChange = event => {
      if (!hiddenFileInput.current.children[0].files[0]){
        return;
      }
      buttonFileInput.current.children[0].value = hiddenFileInput.current.children[0].files[0].name;
      
      if (hiddenFileInput.current.children[0].files[0].name.endsWith('.wav') && artistInput.current.children[0].value != '' && titleInput.current.children[0].value != '' && tagsInput.current.children[0].value != '') {
        setSubmitProps({disabled: false});
        setButtonFileInputProps({error: false});
        setErrorText('');
      }
      else {
        setSubmitProps({disabled: true});
        let errormsg = '';
        if (!hiddenFileInput.current.children[0].files[0].name.endsWith('.wav')) {
          setButtonFileInputProps({error: true});
          errormsg += 'File must be a .wav file';
        }
        setErrorText(errormsg);
      }
    };

    return (
      // We pass the event to the handleSubmit() function on submit.
        <form onSubmit={handleSubmit} method='POST'>
        <Grid container spacing={2}>
                <Grid xs={3}>
                    <Input id='artist' name='artist' placeholder='artist' ref={artistInput} onChange={handleChange} {...artistInputProps}/>
                </Grid>
                <Grid xs={3}>
                    <Input id='title' name='title' placeholder='title' ref={titleInput} onChange={handleChange} {...titleInputProps}/>
                </Grid>
                <Grid xs={3}>
                    <Input id='tags' name='tags' placeholder='tags' ref={tagsInput} onChange={handleChange} {...tagsInputProps}/>
                </Grid>
                <Grid xs={3}>
                    <div onClick={handleFileUploadClick}>
                      <Input id='path' name='path' placeholder='file' disabled ref={buttonFileInput} {...buttonFileInputProps}/>
                    </div>
                </Grid>
                <Grid xs={3}>
                  <FormHelperText>{errorText}</FormHelperText>
                </Grid>
                <Grid xs={3}>
                    {/* <Input /> */}
                </Grid>
                <Grid xs={3}>
                    <Button color="neutral" variant='soft' sx={{ width: '100%' }} onClick={handleRebuildRequest}>
                        Rebuild Music Indexes
                    </Button>
                </Grid>
                <Grid xs={3}>
                    <Button color="neutral" variant='soft' sx={{ width: '100%' }} type='submit' ref={submitButton} {...submitProps}>
                        Add
                    </Button>
                </Grid>
        </Grid>
        <Input type="file" id='file' name='file' sx={{display: 'none'}} accept="audio/wav" ref={hiddenFileInput} onChange={handleChange} />
        </form>
    )
  }