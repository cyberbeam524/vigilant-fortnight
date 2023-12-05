# vigilant-fortnight - OpenAI Doc Search

Enabling context based queries using LLM models requires absorbing the document data into a searchable and retrievable format, retrieve the relevant context according to the question asked and formating the answer with proper grammer and sentence structure using well trained LLM models.

### Architecture diagram
![alt text](https://github.com/cyberbeam524/vigilant-fortnight/blob/main/imgs/architecture.png)

## Dependencies
- Flask (for serving OpenAI responses)
- ChromaDB (vector store for storing embeddings for LLM to use)

Run this to start the flask api locally:
```
cd api
pip install -r requirements.txt
python3 api.py
```

Create a .env file similar to .env.example and add your open ai key in it.

Run this to start the flask api locally:
```
npm i
npm run dev
```

Enter http://localhost:3000 in browser to view frontend:
![alt text](https://github.com/cyberbeam524/vigilant-fortnight/blob/main/imgs/landingpage.png)


Click on search box to enter chatbot:
![alt text](https://github.com/cyberbeam524/vigilant-fortnight/blob/main/imgs/chatbot.png)

Run a query or click the sample query to try it out and click ask:
![alt text](https://github.com/cyberbeam524/vigilant-fortnight/blob/main/imgs/queryexample.png)


Future improvements:
- Improving accuracy of model by adjusting:
    -  model types (default: gpt-3.5-turbo)
    - search_kwargs (default: 5) - for retrieving top k nearest neighbors from vectordb for using as context from documents
    - search type (default: similarity search)
        - mmr: maximum marginal search

Credits:
https://python.langchain.com/docs/modules/data_connection/retrievers/vectorstore