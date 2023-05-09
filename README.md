This is a Smart Playlist generator system powered by GPT_NEO and LAION_CLAP, and using Spotify Annoy for Aproximated Nearest Neighbors Search.
The purpose of this project is to create custom playlists from a prompt in a matter of seconds.

The base of this project was created as the dissertation of Alex Armand Hegedüs studying at Eötvös Loránd University.

## Getting Started

First clone this repo.
Then you need to download the model for CLAP from here: [music_audioset_epoch_15_esc_90.14.pt](https://huggingface.co/lukewys/laion_clap/blob/main/music_audioset_epoch_15_esc_90.14.pt).
Copy the downloaded file to the model folder.

Then run the following commands from the main folder

```bash
npm install
npm run build
npm run start
```

Then open up another terminal and install Python if needed. Python 3.10.9 is preferred.
Write the following commands from the main folder:

```bash
pip install -r model/requirements.txt
flask --app ./model/main run --host=0.0.0.0
```

With both servers running open [http://localhost:3000](http://localhost:3000) with your browser to access the User Interface.

Here you can use the database page to upload new music, or refresh the trees used during generation with the new music data.
You need to write the artist and title of the song. The tags are used for fine-tuning the meaning of the songs, and you can give multiple tags by seperating them with commas. The file must be a ".wav".

With the Generate Playlist Page you can write a prompt, select the number of songs and choose which AI to use during ordering the songs.
The Music side uses CLAP to analyze the song and tries to find the closest match to the prompt using that.
The Tags side uses GPT-NEO to analyze the similarity between the prompt and the keywords of the songs.
Click Generate to create your playlist, then use the music player to access your playlist.