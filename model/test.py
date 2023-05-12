import json
import unittest
import requests
import os
import itertools
import main
import tags
import torch
import time

class TestMainAPI(unittest.TestCase):
    def setUp(self):
        self.base_url = 'http://localhost:5000'
        
    def test_PYTHONSERVERAVAILABLE(self):
        response = requests.get(f'{self.base_url}/')
        self.assertEqual(response.text, 'Hello, World!')
        
    def test_GETMUSICLIST(self):
        expected_files = os.listdir('public/music')
        response = requests.get(f'{self.base_url}/musiclist')
        returned_files = [x['path'][6:] for x in response.json()]
        
        returned_files.sort()
        expected_files.sort()
        
    def test_GETALLKEYWORDS(self):
        response = requests.get(f'{self.base_url}/keywords')
        self.assertEqual(response.status_code, 200)
        keywords = response.json()
        # Test that every keyword returned is present in the music list
        response = requests.get(f'{self.base_url}/musiclist')
        music_list = response.json()
        keywords_in_music_list = list(itertools.chain.from_iterable([x['tags'].split(',') for x in music_list]))
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(music_list), 0)
        for keyword in keywords:
            self.assertIn(keyword, keywords_in_music_list)
                    
    def test_BUILDTREE(self):
        response = requests.post(f'{self.base_url}/tree/build')
        self.assertIn(response.status_code, [200, 500])
        
    def test_GETPLAYLISTWITHNAMES(self):
        response = requests.post(f'{self.base_url}/playlist/names', json={'prompt': 'Calm music', 'songCount': 10})
        self.assertIn(response.status_code, [200, 500])
        if response.status_code == 200:
            playlist_names = response.json()
            # Test that every playlist name returned is a string
            for name in playlist_names:
                self.assertIsInstance(name, str)
        
    def test_GETPLAYLIST(self):
        response = requests.post(f'{self.base_url}/playlist', json={'prompt': 'Calm music', 'songCount': 10, 'scale': 5})
        self.assertIn(response.status_code, [200, 500])
        if response.status_code == 200:
            playlist = response.json()
            # Test that every playlist entry has a valid ID and distance
            for entry in playlist.keys():
                self.assertIsInstance(int(entry), int)
                self.assertIsInstance(playlist[entry], float)
        
    def test_GETMUSICDATAFROMDATABASE(self):
        music_data = main.get_music_data_from_database().all()
        if len(music_data) > 0:
            # Test that every music entry has a valid ID and other properties
            for entry in music_data:
                self.assertIsInstance(entry.id, int)
                self.assertIsInstance(entry.title, str)
                self.assertIsInstance(entry.artist, str)
        else:
            self.assertEqual(music_data, [])
            
    def test_GETTAGSCOREOFMUSIC(self):
        music_data = main.get_music_data_from_database().all()
        if len(music_data) > 0:
            # Test with the first music entry in the database
            response = requests.get(f'{self.base_url}/keywords')
            keywords = response.json()
            music_id = music_data[0].id
            score_data = dict([(x,1.1) for x in keywords])
            score = main.get_tag_score_of_music(music_id, score_data)
            self.assertIsInstance(score, float)
        else:
            with self.assertRaises(Exception):
                main.get_tag_score_of_music(1, [])

class TestTagsAPI(unittest.TestCase):
        
    def test_cosine_similarity(self):
        a = torch.Tensor([1, 2, 3])
        b = torch.Tensor([4, 5, 6])
        c = torch.Tensor([-1, -2, -3])
        d = torch.Tensor([-4, -5, -6])
        e = torch.Tensor([1, 0, 0])
        f = torch.Tensor([-1, 0, 0])
        self.assertAlmostEqual(tags.cosine_similarity(a,b), 0.9746318, places=7)
        self.assertAlmostEqual(tags.cosine_similarity(c,d), 0.9746318, places=7)
        self.assertAlmostEqual(tags.cosine_similarity(e,f), -1, places=7)
        
    def test_encode_with_model(self):
        tree_tensor = tags.encode_with_model("tree")
        forest_tensor = tags.encode_with_model("forest")
        parrot_tensor = tags.encode_with_model("parrot")
        tree_forest_sim = tags.cosine_similarity(tree_tensor, forest_tensor)
        tree_parrot_sim = tags.cosine_similarity(tree_tensor, parrot_tensor)
        self.assertGreater(tree_forest_sim, tree_parrot_sim)
        
    def test_calc_similarity(self):
        prompt = "This is a sample prompt"
        keywords = ["sample", "prompt"]
        result = tags.calc_similarity(prompt, keywords)
        self.assertIsInstance(result, dict)
        self.assertEqual(len(result), 2)
        for similarity in result.keys():
            self.assertIsInstance(similarity, str)
            self.assertIsInstance(result[similarity], float)
            self.assertGreaterEqual(result[similarity], -1)
            self.assertLessEqual(result[similarity], 1)
    
class TestMusicAPI(unittest.TestCase):
    def setUp(self):
        self.base_url = 'http://localhost:3000'
        self.model_url = 'http://localhost:5000'

    # This is test: UPLOADMUSIC, MODIFYMUSIC, REMOVEMUSIC for all success cases
    # This is required because the following tasks require the music to be uploaded
    def test_uploadmusic_modifymusic_deletemusic_success(self):
        # Test successful music upload
        url = f"{self.base_url}/api/uploadMusic"
        data = {
            "title": "Test Music",
            "artist": "Test Artist",
            "tags": "test1,test2,test3",
            "path": "music/test.wav"
        }
        with open('model/test/test.wav', 'rb') as f:
            files = {'file': ('test.wav', f, 'audio/wav')}
            response = requests.post(url, data=data, files=files)
            self.assertEqual(response.status_code, 200)
            
        response = requests.get(f'{self.model_url}/musiclist').json()
        self.assertTrue(any(x['path'] == 'music/test.wav' for x in response))
        
        # Get the id of the uploaded music
        response = requests.get(f'{self.model_url}/musiclist').json()
        returned_id = [x['id'] for x in response if x['path'] == 'music/test.wav'][0]
        
        # Modify the uploaded music
        url = f"{self.base_url}/api/updateMusic"
        data = {
            "id": returned_id,
            "title": "Modified Music",
            "artist": "Modified Artist",
            "tags": "test1,test2,test3",
            "path": "music/test.wav"
        }
        response = requests.post(url, data=data)
        self.assertEqual(response.status_code, 200)
        response = requests.get(f'{self.model_url}/musiclist').json()
        self.assertTrue(any(x['path'] == 'music/test.wav' and x['title'] == 'Modified Music' and x['artist'] == 'Modified Artist' for x in response))
        
        # Delete the uploaded music
        data = {
            "id": returned_id
        }
        
        # Test successful music deletion
        url = f"{self.base_url}/api/removeMusic"
        response = requests.post(url, data=data)
        self.assertEqual(response.status_code, 200)
        
        response = requests.get(f'{self.model_url}/musiclist').json()
        self.assertFalse(any(x['path'] == 'music/test.wav' for x in response))
        
    def test_deletemusic_error(self):
        fake_data = {
            "name": "fake"
        }
        
        # Test bad request due to missing id parameter
        url = f"{self.base_url}/api/removeMusic"
        response = requests.post(url, data=fake_data)
        self.assertEqual(response.status_code, 400)
        
    def test_modifymusic_error(self):
        url = f"{self.base_url}/api/updateMusic"
        data = {
            "title": "Modified Music",
            "artist": "Modified Artist",
            "path": "music/test.wav"
        }
        response = requests.post(url, data=data)
        self.assertEqual(response.status_code, 400)

    def test_uploadmusic_error(self):
        # Test bad request due to missing fields
        url = f"{self.base_url}/api/uploadMusic"
        data = {
            "title": "Test Music"
        }
        with open('model/test/test.wav', 'rb') as f:
            files = {'file': ('test.wav', f, 'audio/wav')}
            response = requests.post(url, data=data, files=files)
            self.assertEqual(response.status_code, 400)
            
class TestPlaylistAPI(unittest.TestCase):
    def setUp(self):
        self.base_url = 'http://localhost:3000'
    
    def test_updateplaylist(self):
        # Test successful playlist update
        url = f"{self.base_url}/api/updatePlaylist"
        data = '[{"id": "1","order": "0"}]' # This is sent as a string because request cannot send dictionaries embedded in a list
        response = requests.post(url, data=data)
        self.assertEqual(response.status_code, 200)
        
        # Test listPlaylist and whether the playlist is updated
        time.sleep(1)
        url = f"{self.base_url}/api/listPlaylist"
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['playList'][0]['id'], 1)
        
        # Test bad request due to missing fields
        url = f"{self.base_url}/api/updatePlaylist"
        fake_data = {
            "name": "Test Playlist",
            "songs": "1,2,3,4,5"
        }
        response = requests.post(url, data=fake_data)
        self.assertEqual(response.status_code, 500)

if __name__ == '__main__':
    unittest.main()