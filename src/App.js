import logo from './logo.svg';
import './App.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';


function App() {

  const [query , setquery] = useState('')
  const [ pageNumber , setpageNumber] = useState(1)
  const [Loading , setloading] = useState(true)
  const [error , seterror] = useState(false)
  const [books , setbooks] = useState("")
  const [hasmore , sethasmore] = useState(false)
  const observer = useRef()

const lastbook = useCallback(node=>{
  if(Loading) return 

  if(observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(ent =>{
      if(ent[0].isIntersecting ){
        setpageNumber(prev => prev+1)
      }
    })
   if(node) observer.current.observe(node)
  
},[Loading , hasmore])

  let handleSearch = (e)=>{
    setquery(e.target.value)
    setpageNumber(1)
  }
  useEffect(()=>{
  setbooks([])
  },[query])

  useEffect(()=>{
    setloading(true)
    seterror(false)
    let cancle;
    axios({
        method:"GET",
        url:"http://openlibrary.org/search.json",
        params:{q:query , page:pageNumber},
        cancelToken: new axios.CancelToken(c=> cancle = c)
    }).then((r)=>{
        setbooks(r.data.docs)
        setloading(false)
        sethasmore(r.data.length > 0 )
    }).catch((e)=>{
      if(axios.isCancel(e)) return
      seterror(true)
    })
    return ()=> cancle()
   },[query,pageNumber])



  return (
    <div className="App">
      <input type="text" value={query} onChange={handleSearch}></input>
      
      <div>{error && "Error"}</div>
      {books && <div>{books.map((book,index)=>{
        if(books.length == index+1){
          return  <div ref={lastbook} > {book.title}</div>
        }
       return  <div > {book.title}</div>
      }
         
      )}</div> }
     <div>{Loading && "Loading..."}</div>
    </div>
  );
}

export default App;
