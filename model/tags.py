from transformers import BertTokenizer, BertModel, AutoTokenizer, AutoModel
import torch

tokenizer = AutoTokenizer.from_pretrained('EleutherAI/gpt-neo-125m')
model = AutoModel.from_pretrained('EleutherAI/gpt-neo-125m')

def encode_with_model(text):
    '''
    Creates GPT-NEO embeddings for a given text.
    
    Paramteres:
        text (str): The text to be encoded
        
    Returns:
        torch.tensor: The GPT-NEO embeddings for the text
    '''
    encoded_text = tokenizer(text, return_tensors='pt')
    output = model(**encoded_text)
    return torch.mean(output.last_hidden_state, dim=1).flatten()


def cosine_similarity(a, b):
    '''
    This function provides the cosine similarity between two vectors a and b.
    '''
    return torch.nn.functional.cosine_similarity(a, b, dim=0).item()

def calc_similarity(prompt, keywords):
    '''
    This function is used to calculate the similarity between a prompt and a list of keywords
    The keywords are encoded using BERT and the similarity is calculated using cosine similarity
    The keywords are then sorted by their similarity to the prompt
    
    Parameters:
        prompt (str): The prompt to be compared to the keywords
        keywords (list): A list of keywords to be compared to the prompt
    
    Returns:
        keyValues (dict): A dictionary containing the keywords and their similarity to the prompt
    '''
    prompt_embed = encode_with_model(prompt)
    keyword_embeds = [encode_with_model(keyword) for keyword in keywords]
    cossims = [cosine_similarity(prompt_embed, keyword_embed) for keyword_embed in keyword_embeds]
    keyValues = dict(zip(keywords, cossims))
    keyValues = {k: v for k, v in sorted(keyValues.items(), key=lambda item: item[1], reverse=True)}
    return keyValues

# This is just a test to see if the code works
if __name__ == "__main__":
    text = "Calm and relaxing piano music"
    test_text = encode_with_model(text)
    print("\n",text)

    keywords = [
        "calm","relaxing","piano","music","classical",
        "epic","fantasy","orchestral","adventure",
        "sad","emotional","romantic",
        "rap","hip hop","urban","street",
        "rock","metal","guitar","electric","lawnmowercore",
        "electronic","synthwave","synthpop","synthwave",
        "jazz","blues","soul","funk", "r&b",
        "country","bluegrass","folk", "acoustic",
        "Feminine","Masculine","Aggressive","Passive","Happy","Sad","Angry","Calm",
        "Relaxing","Energetic","Tense","Excited","Bored","Anxious","Fearful","Confident","Confused","Cute",
        "Depresso", "Screaming men with eyeliner", "Feminine rage", "Meme", "Meme music"
    ]
    
    embeds = [encode_with_model(x) for x in keywords]
    
    cossims = [cosine_similarity(test_text, x)*10 for x in embeds]
    keyValues = dict(zip(keywords, cossims))
    keyValues = {k: v for k, v in sorted(keyValues.items(), key=lambda item: item[1], reverse=True)}
    
    print("\n",keyValues)