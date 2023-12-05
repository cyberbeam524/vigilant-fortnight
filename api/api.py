#!/usr/bin/env python
# encoding: utf-8
import json
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin


import sys
import os
from langchain.document_loaders import PyPDFLoader
from langchain.document_loaders import Docx2txtLoader
from langchain.document_loaders import TextLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.text_splitter import CharacterTextSplitter
from langchain.prompts import PromptTemplate


app = Flask(__name__)
CORS(app, support_credentials=True)

os.environ["OPENAI_API_KEY"] = "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"

folderToSearch = "cps"
# # folderToSearch = "docs"
# documents = []
# for file in os.listdir(folderToSearch):
#     if file.endswith(".pdf"):
#         pdf_path = f"./{folderToSearch}/" + file
#         loader = PyPDFLoader(pdf_path)
#         documents.extend(loader.load())
#     elif file.endswith('.docx') or file.endswith('.doc'):
#         doc_path = f"./{folderToSearch}/" + file
#         loader = Docx2txtLoader(doc_path)
#         documents.extend(loader.load())
#     elif file.endswith('.txt'):
#         text_path = f"./{folderToSearch}/" + file
#         loader = TextLoader(text_path)
#         documents.extend(loader.load())

# text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=10)
# documents = text_splitter.split_documents(documents)

# vectordb = Chroma.from_documents(documents, embedding=OpenAIEmbeddings(), persist_directory="./data5")
# vectordb.persist()

directory = "./data5"
vectordb = Chroma(persist_directory=directory, embedding_function=OpenAIEmbeddings())

# multiple file upload feature:
pdf_qa = ConversationalRetrievalChain.from_llm(
    ChatOpenAI(temperature=0.9, model_name="gpt-3.5-turbo"),
    vectordb.as_retriever(search_kwargs={'k': 6, "score_threshold": .5}, search_type="mmr"),
    return_source_documents=True,
    verbose=False
)

# multiple chat history feature:
chat_history = []

@app.route('/', methods=['GET'])
def query_records():
    args = request.args
    query = args["query"]
    print(query)
    result = pdf_qa(
        {"question": query, "chat_history": chat_history})
    print(f"Answer: " + result["answer"])
    chat_history.append((query, result["answer"]))
    sources = ""
    uniquesources = set()
    for i in result["source_documents"]:
        uniquesources.add((i.metadata['page'], i.metadata['source']))
    for page, source in list(uniquesources):
        sources += f"Page {page} from doc {source}\n"
    return {"data": result["answer"],
            "sources": sources}

@app.route('/file', methods=['POST'])
def update_record2():
    f = request.files['file']
    print(secure_filename(f.filename))
    f.save( "/Users/maarunipandithurai/Documents/jdolittle/ai_search_engine_pro/nextjs-openai-doc-search-starter/api/cps" \
           + "/" + secure_filename(f.filename))

    folderToSearch = "cps"
    # folderToSearch = "docs"
    documents = []
    for file in os.listdir(folderToSearch):
        if file.endswith(".pdf"):
            pdf_path = f"./{folderToSearch}/" + file
            loader = PyPDFLoader(pdf_path)
            documents.extend(loader.load())
        elif file.endswith('.docx') or file.endswith('.doc'):
            doc_path = f"./{folderToSearch}/" + file
            loader = Docx2txtLoader(doc_path)
            documents.extend(loader.load())
        elif file.endswith('.txt'):
            text_path = f"./{folderToSearch}/" + file
            loader = TextLoader(text_path)
            documents.extend(loader.load())

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=10)
    documents = text_splitter.split_documents(documents)

    vectordb = Chroma.from_documents(documents, embedding=OpenAIEmbeddings(), persist_directory="./data5")
    vectordb.persist()

    return jsonify({"status": "uploaded"})

app.run(debug=True, port=1005)