import React, { useState, useEffect, useContext } from 'react'
import Post from '../components/Post'

import { UserContext } from '../context/UserContext'

export default ({ match, history }) => {

  const { id } = match.params
  console.log("id", id)

  const { user } = useContext(UserContext)
  console.log("user", user)

  const [post, setPost] = useState({})
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)

  //Used for the edit form
  const [description, setDescription] = useState('')

  const fetchPost = async () => {
    const response = await fetch(`http://localhost:1337/posts/${id}`)
    const data = await response.json()

    console.log("data", data)
    setPost(data)
    setLoading(false);
  }

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:1337/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${user.jwt}`
        }
    })
    const data = await response.json()
    history.push('/')
}

const handleEditSubmit = async (event) => {
    event.preventDefault()
    console.log("handleEditSubmit")

    const response = await fetch(`http://localhost:1337/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.jwt}`
        },
        body: JSON.stringify({
            description: description
        })
    })

    const data = await response.json()
    fetchPost()
    console.log("handleEditSubmit data", data)
    setEdit(false)
}


  useEffect(() => {
    fetchPost()
  }, [])

  return (
    <div>
      { loading &&
        <p>Loading...</p>
      }
      {!loading &&
        <>
          {post.id &&
            <>
              <Post
                likes={post.likes}
                description={post.description}
                url={post.image && post.image.url}
              />
              {user && user.user && post && post.author && post.author.id === user.user.id &&
                <>
                  <button onClick={handleDelete}>Delete this Post</button>
                  <button onClick={() => setEdit(true)}>Edit this Post</button>
                  {edit &&
                    <form onSubmit={handleEditSubmit}>
                      <input
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="New description"
                      />
                      <button>Confirm</button>
                    </form>
                  }
                </>
              }
            </>
          }
          {!post.id &&
            <p>Something Went Wrong!</p>
          }
        </>
      }
    </div>
  )

}