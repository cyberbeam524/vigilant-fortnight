# OpenAI Doc Search

With few annotators or domain experts we need to be selective on which data out of possibly thousands or millions of unlabelled data to choose from for labelling. Labelling is necessary for two reasons:

Need for training data to improve models: Models may predict new data wrongly due to seeing unseen features it has not been trained on. Thus, Ground truth may differ from current model predictions.
Need for accurate evaluation metrics: Unlabelled data cannot be used for evaluating the model on new data that may have vastly different attributes compared to old data that the model was evaluated on


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

![alt text](https://github.com/cyberbeam524/fictional-octo-spoon/blob/main/imgs/ArchitectureDiagram.png)