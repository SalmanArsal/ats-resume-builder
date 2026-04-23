import axios from 'axios'
import React, { useEffect, useState } from 'react'

const useFetch = (url) => {
    const [api, setApi] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        (async () =>{
            try {
                const response = await (await axios.get(url)).data
                setApi(response)
            } catch (error) {
              console.log(error)  
            }
            finally{
                setLoading(false)
            }
        })()
    }, [url])

  return {api, loading}
}

export default useFetch