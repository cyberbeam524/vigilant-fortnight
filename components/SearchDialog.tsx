'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCompletion } from 'ai/react'
import { X, Loader, User, Frown, CornerDownLeft, Search, Wand, Code2 } from 'lucide-react'
import axios from 'axios';

interface ChatHistory {
  query: string;
  answer: string;
  sources: string;
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')
  const [isLoading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string>('')
  const [chatHistory, setChatHistory] = React.useState<ChatHistory[]>([])
  const [completion, setCompletion] = React.useState<string>('')
  const [file, setFile] = React.useState<File | null>(null);
  const [sources, setSources] = React.useState<string>('')


  // set source feature:
  const complete2 = async (query: string) => {
    setLoading(true)
    await axios.get('http://localhost:1005/?query=' + query,)
      .then(function (response) {
        console.log(response.data);
        setCompletion(response.data.data)
        setSources(response.data.sources)
        const chathis: ChatHistory = {
          query: query,
          answer: response.data.data,
          sources: response.data.sources
        };
        
        setChatHistory([...chatHistory, chathis])
        setError('')
      })
      .catch(function (error2) {
        console.log(error2);
        setError(error2)
        setCompletion('')
      });
    setLoading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("hellooo1")
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    let formData = new FormData();
    if (file != null){
    formData.append("file", file);
    var config = {
      method: 'post',
      url: 'http://localhost:1005/file',
      data : formData
    };

    await axios.post('http://localhost:1005/file', formData)
    .then(function (response) {
      console.log("file", response)
      setError('')
    })
    .catch(function (error2) {
      console.log(error2);
      setError('error2')
    });
  }

  setLoading(false)
    setFile(null)
  };

  // const { complete, completion, isLoading, error } = useCompletion({
  //   api: '/api/vector-search',
  // })

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen(true)
      }

      if (e.key === 'Escape') {
        console.log('esc')
        handleModalToggle()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  function handleModalToggle() {
    setOpen(!open)
    setQuery('')
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log("query: ", query)
    complete2(query)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-base flex gap-2 items-center px-4 py-2 z-50 relative
        text-slate-500 dark:text-slate-400  hover:text-slate-700 dark:hover:text-slate-300
        transition-colors
        rounded-md
        border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
        min-w-[300px] "
      >
        <Search width={15} />
        <span className="border border-l h-5"></span>
        <span className="inline-block ml-4">Search...</span>
        <kbd
          className="absolute right-3 top-2.5
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd>{' '}
      </button>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[850px] max-h-[80vh] overflow-y-auto text-black">
          <DialogHeader>
            <DialogTitle>OpenAI powered doc search</DialogTitle>
            <DialogDescription>
            </DialogDescription>
            <hr />
            <button className="absolute top-0 right-2 p-2" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700">

            {completion && !error ? (

              <div>
              {chatHistory.slice(0, chatHistory.length - 1).map((i, key) => {
                return <div key={key}>

              <div className="flex gap-4">
              <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                <User width={18} />{' '}
              </span>
              <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">{i.query}</p>
              </div>

                <div className="flex items-center gap-4 dark:text-white">
                  <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Wand width={18} className="text-white" />
                  </span>
                  <h3 className="font-semibold">Answer:</h3>
                  <div>
                  {i.answer.split("\n").map((i,key) => {
                      return <div key={key}>
                        <div >{i}</div>
                      </div>;
                  })}
                  </div>
                  </div>

                <div className="flex items-center gap-4 dark:text-white">
                  <span className="bg-blue-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Code2 width={18} className="text-white" />
                  </span>
                  <h3 className="font-semibold">Sources:</h3>
                  <div>
                  {i.sources.split("\n").map((i,key) => {
                      return <div key={key}>
                        <div >{i}</div>
                      </div>;
                  })}
                  </div>
                  </div>
                </div>;
              })}
              </div>
              ) : null}

              {query && (
                <div className="flex gap-4">
                  <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <User width={18} />{' '}
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">{query}</p>
                </div>
              )}

              {isLoading && (
                <div className="animate-spin relative flex w-5 h-5 ml-2">
                  <Loader />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-4">
                  <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Frown width={18} />
                  </span>
                  <span className="text-slate-700 dark:text-slate-100">
                    Sad news, the search has failed! Please try again.
                  </span>
                </div>
              )}

              {completion && !error ? (
                <div className="flex items-center gap-4 dark:text-white">
                  <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Wand width={18} className="text-white" />
                  </span>
                  <h3 className="font-semibold">Answer:</h3>
                  <div>
                  {completion.split("\n").map((i,key) => {
                      return <div key={key}>
                        <div >{i}</div>
                      </div>;
                  })}
                  </div>
                </div>
              ) : null}

            {sources && !error ? (
                <div className="flex items-center gap-4 dark:text-white">
                  <span className="bg-blue-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Code2 width={18} className="text-white" />
                  </span>
                  <h3 className="font-semibold">Sources:</h3>
                  <div>
                  {sources.split("\n").map((i,key) => {
                      return <div key={key}>
                        <div >{i}</div>
                      </div>;
                  })}
                  </div>
                </div>
              ) : null}

              <div className="relative">
                <Input
                  placeholder="Ask a question..."
                  name="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="col-span-3"
                />
                <CornerDownLeft
                  className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                    query ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-100">
                Or try:{' '}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) => setQuery('What are common carbon protocols?')}
                >
                  What are common carbon protocols?
                </button>
              </div>
            </div>
            <DialogFooter className="text-xs text-gray-500 dark:text-gray-100 flex items-center space-x-2 place-items-center ">

                <Button type="submit" className="bg-red-500">
                  Ask
                </Button>
            </DialogFooter>
          </form>
                  <div className='text-xs text-gray-500 dark:text-gray-100'>
          <div className='mt-2'>Upload a pdf file: <input name="file" type="file" onChange={handleFileChange}/></div>

          {file && 
                 <Button className="bg-red-500" onClick={handleUpload} >
                 Upload
               </Button>
                }
                </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
