import axios from 'axios'
import { useEffect, useState } from 'react'

const URL = 'http://localhost:5000'

export default function PageLayout() {
  const [allUsers, setAllUsers] = useState([])
  const [createTodo, setCreateTodo] = useState('')
  const [edit, setEdit] = useState(0)
  const [updateTodo, setUpdateTodo] = useState('')

  const getAllUsers = () => {
    axios
      .get(`${URL}/todos`)
      .then((res) => {
        const data = res.data
        console.log(data)
        setAllUsers(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDelete = (id) => {
    axios
      .delete(`${URL}/todos/${id}`)
      .then((res) => {
        const data = res.data
        console.log(data)
        setAllUsers(allUsers.filter((user) => user.todo_id !== id))
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handlePut = (id) => {
    setEdit(0)

    if (
      updateTodo === allUsers.find((user) => user.todo_id === id).description
    ) {
      return
    }
    axios
      .put(`${URL}/todos/${id}`, { description: updateTodo })
      .then((res) => {
        if (res.status === 200) {
          getAllUsers()
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleCreateTodo = (e) => {
    setCreateTodo(e.currentTarget.value)
  }

  const handleUpdate = (e) => {
    setUpdateTodo(e.currentTarget.value)
  }
  const handleSubmit = () => {
    axios
      .post(`${URL}/todos`, { description: createTodo })
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleSetEdit = (e, id) => {
    setEdit(id)
    const newDesc = allUsers.find((user) => user.todo_id === id)
    setUpdateTodo(newDesc.description)
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <div styles={{ width: '100%' }}>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '10px',
        }}
        onSubmit={handleSubmit}
      >
        <p style={{ margin: '0' }}>Create new task!</p>
        <input
          value={createTodo}
          onChange={(e) => {
            handleCreateTodo(e)
          }}
        />
        <button>Create</button>
      </form>
      <div style={{}}>
        {allUsers?.map((item) => (
          <div
            key={item.todo_id}
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            {edit !== item.todo_id ? (
              <p
                onClick={(e) => handleSetEdit(e, item.todo_id)}
                style={{
                  cursor: 'pointer',
                  marginRight: '20px',
                }}
              >
                {item.description}
              </p>
            ) : (
              <input
                autoFocus="autofocus"
                onBlur={() => handlePut(item.todo_id)}
                value={updateTodo}
                onChange={(e) => {
                  handleUpdate(e, item.description)
                }}
              />
            )}

            <button onClick={() => handleDelete(item.todo_id)}>DEL</button>
          </div>
        ))}
      </div>
    </div>
  )
}
