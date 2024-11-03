import openai
import base64
import requests
import os 
from dotenv import load_dotenv

load_dotenv() 

openai_key = os.getenv("open_ai_key")
openai.api_key = openai_key  # Replace 'your_api_key' with your actual API key

# Function to encode the image
def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def describe_image(image_url):
    # API call to generate a description of the image
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {
            "role": "user",
            "content": [
                {"type": "text", "text": "Give me a two sentence description of this image"},
                {
                "type": "image_url",
                "image_url": {
                    "url": image_url,
                },
                },
            ],
            }
        ],
        max_tokens=300,
    )
    api_description = response.choices[0].message['content'] 
    return api_description

def find_primary_color(image_url):
    # API call to find the primary color of the animal in the image 
    response_color = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {
            "role": "user",
            "content": [
                {"type": "text", "text": "Give me ONLY a hex-code, nothing else, that represents the primary color of the animal."},
                {
                "type": "image_url",
                "image_url": {
                    "url": image_url,
                },
                },
            ],
            }
        ],
        max_tokens=300,
    )
    animal_color = response_color.choices[0].message['content'] 
    return animal_color

def generate_image(description):
    api_description_final = description + " Make the image in the style of a 2D anime-like cartoon image with the animal(s) at the center. Make sure it's colored"
    api_key = openai_key 

    # API endpoint
    url = "https://api.openai.com/v1/images/generations"

    # Set up request data
    data = {
        "prompt": api_description_final,
        "model": "dall-e-3",  # Specify the model; defaults to "dall-e-2" if not provided
        "n": 1,  # Number of images to generate; only `n=1` is supported for dall-e-3
        "quality": "hd",  # Quality of the image; "hd" for higher detail, available only for dall-e-3
        "response_format": "url",  # Choose "url" or "b64_json"
        "size": "1024x1024",  # Image size; choose from "256x256", "512x512", "1024x1024" for dall-e-2, or specific sizes for dall-e-3
        "style": "vivid",  # Choose "vivid" or "natural"; only available for dall-e-3
    }

    # Set up headers with authorization
    headers = {
        "Authorization": f"Bearer {api_key}",
    }

    # Make the API request
    response = requests.post(url, headers=headers, json=data)

    # Check and handle the response
    if response.status_code == 200:
        result = response.json()
        return result["data"][0]["url"]
    else:
        return response.text