import math
from flask import Flask, request
import laion_clap
import os
from annoy import AnnoyIndex
from sqlalchemy import String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session
from flask_cors import CORS
from tags import calc_similarity

# CONSTS
# trees_ratio - The ratio of the number of trees to the number of items in the database
trees_ratio = 0.1

# SQLDatabase
class Base(DeclarativeBase):
    pass

class Music(Base):
    '''
    This class is used to represent the music table in the database
    
    Attributes:
        id (int): The id of the music
        artist (str): The artist of the music
        title (str): The title of the music
        tags (str): The tags of the music, seperated by commas
        path (str): The path to the music file
    '''
    __tablename__ = 'music'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    artist: Mapped[str] = mapped_column(String(255))
    title: Mapped[str] = mapped_column(String(255))
    tags: Mapped[str] = mapped_column(String(255))
    path: Mapped[str] = mapped_column(String(255))
    
    def __repr__(self):
        return f'Music(id={self.id}, artist={self.artist}, title={self.title}, tags={self.tags}, path={self.path})'
    
    def as_dict(self):
        return {'id': self.id, 'artist': self.artist, 'title': self.title, 'tags': self.tags, 'path': self.path}
    
engine = create_engine('sqlite:///db/test.db')

# Startup
print('Server starting...')
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

print('Loading model...')
model = laion_clap.CLAP_Module(enable_fusion=False, amodel='HTSAT-base')
model.load_ckpt('model/music_audioset_epoch_15_esc_90.14.pt')

print('Loading annoy...')
t = AnnoyIndex(512, 'angular')
print('searching for db/music.ann')
if os.path.exists('./db/music.ann'):
    t.load('./db/music.ann')
    print('found and loaded.')

# Functions

def get_music_data_from_database():
    '''
    This function is used to get all the music data from the database
    Then it is used in other functions
    '''
    session = Session(engine)
    statement = select(Music)
    return session.scalars(statement)

def get_tag_score_of_music(id, keyvalues):
    '''
    Creates a score for a music based on the tags it has
    The higher the score, the more relevant the music is to the prompt
    
    Parameters:
        id (int): The id of the music
        keyvalues (dict): A dictionary of keywords and their scores in this search
        
    Returns:
        score (float): The score of the music
    '''
    score = 0
    
    session = Session(engine)
    statement = select(Music.tags).where(Music.id == id)
    tags = session.execute(statement).all()[0][0]
    if ',' in tags:
        tags = tags.replace(' ', '').split(',')
    
    for tag in tags:
        if tag in keyvalues:
            score += keyvalues[tag]
    
    # Scale the score to an about correct value between [-1,1] then Normalize to [-100,100]
    score = (score/len(tags))*100
            
    return score

@app.route('/keywords', methods=['GET'])
def get_all_keywords():
    '''
    Returns a list of all the keywords in the database used as tags for the music
    '''
    keywords = []
    md = get_music_data_from_database().all()
    
    [[keywords.append(y) for y in x.tags.split(',')] for x in md]
    return sorted(set(keywords))
    
@app.route('/musiclist', methods=['GET'])
def get_music_list():
    '''
    Returns a list of all the music in the database
    '''
    md = [x.as_dict() for x in get_music_data_from_database().all()]
    return md

@app.route('/tree/build', methods=['POST'])
def build_tree():
    '''
    Builds the annoy tree from the database
    Based on the number of items in the database, it will decide how many trees to use.
    '''
    try:
        print('Unloading annoy tree if exists...')
        t.unload()
        t.unbuild()
        
        print('Getting music list...')
        md = get_music_list()
    
        for music in md:
            # Temporary fix - music['path'] is not valid as it is a relative path in public
            try:
                t.add_item(music['id'], model.get_audio_embedding_from_filelist(x = ['public/'+music['path']])[0,:])
            except:
                print('Error adding item to annoy tree, name: ', music['title'])
                raise Exception('Error adding item to annoy tree')
        
        print('Building annoy tree...')
        t.build(math.ceil(len(md)*trees_ratio), n_jobs=-1)
        print('Saving to index file')
        t.save('./db/music.ann')
        return 'Success', 200
    except Exception as e:
        print(e)
        return 'Error', 500


@app.route('/playlist', methods=['POST', 'OPTIONS'])
def get_playlist():
    '''
    Returns a playlist of music based on the prompt and the number of songs requested
    This is the main function of the server, and it's called by the client.
    
    Parameters:
        prompt (str): The prompt for the playlist
        songCount (int): The number of songs requested
        scale (float): The scale of the CLAP score or keywords score (tags of the music) up to 10, 0 means only CLAP score, 10 means only keywords score
        
    Returns:
        playlist (dict): A dictionary of music ids and their scores, the scores are the sum of the scaled clap score and the scaled keywords score
    '''
    if request.method == 'OPTIONS':
        return 'OK', 200
    prompt = request.json['prompt']
    songCount = request.json['songCount']
    scale = request.json['scale']
    text_embed = model.get_text_embedding(x=[prompt,""])[0,:]
    ids, distances = t.get_nns_by_vector(text_embed, songCount, include_distances=True)
    # distances is between [0,2] so we need to move it to [-1,1], and then scale it
    distances = [(x-1)*100 for x in distances]
    
    clapScores = dict(zip(ids, distances))
    #print("clapScores: ", clapScores)
    
    keywords = get_all_keywords()
    keyvalues = calc_similarity(prompt, keywords)
    
    playlist = {}
    for id in ids:
        scaled_score = (scale/10)*get_tag_score_of_music(id, keyvalues)+((10-scale)/10)*clapScores[id]
        playlist[id] = scaled_score
    
    # Sort by score
    playlist = {k: v for k, v in sorted(playlist.items(), key=lambda item: item[1], reverse=True)}
    print(playlist)
    
    return playlist

@app.route('/playlist/names', methods=['POST'])
def get_playlist_with_names():
    '''
        Older version of get_playlist, returns a list of music names instead of ids
        Can be used for testing, or later is planned to update to use tags score as well.
        
        Parameters:
            prompt (str): The prompt for the playlist
            songCount (int): The number of songs requested
            
        Returns:
            playlist (list): A list of music names
    '''
    md = get_music_list()
    prompt = request.json['prompt']
    songCount = request.json['songCount']
    text_embed = model.get_text_embedding(x=[prompt,""])[0,:]
    playlist = t.get_nns_by_vector(text_embed, songCount)
    return [x['title'] for x in md if x['id'] in playlist]

@app.route('/')
def hello_world():
    '''
    A test function to check if the server is running
    Can be used from a browser by going to http://localhost:5000/
    '''
    return 'Hello, World!'
