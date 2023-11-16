import requests
import json
from openai import OpenAI

def generate_description(esg_data1, esg_data2):
    client = OpenAI(
        api_key='',
    )

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": f"Generate a simple conclusion no more than 150 words based on the following ESG data: {esg_data1}, {esg_data2}",
            }
        ],
        model="gpt-3.5-turbo-1106",
        max_tokens=600
    )

    return chat_completion.choices[0].message.content


