import React, { useState, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import { listTodos } from './graphql/queries';
import { createTodo as createTodoMutation, deleteTodo as deleteTodoMutation } from './graphql/mutations';

// import { Todo } from '../backend/'
import { GraphQLResult } from "@aws-amplify/api/lib/types";

interface Todo {
  id: string;
  name?: String;
  description?: String;
}



const initialFormState = { name: '', description: '' }

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const apiData  = await API.graphql({ query: listTodos }) as GraphQLResult<any> ;
    setTodos(apiData.data.listTodos.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createTodoMutation, variables: { input: formData } });
    console.log("create note")
    // setTodos([ ...todos, formData ]);
    // setFormData(initialFormState);
  }

  async function deleteTodo( todo: Todo ) {
    const id = todo.id
    const newNotesArray = todos.filter(todo => todo.id !== id);
    setTodos(newNotesArray);
    await API.graphql({ query: deleteTodoMutation, variables: { input: { id } }});
  }

  return (
    <div className="App">
      <h1>My Notes App</h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{marginBottom: 30}}>
        {
          todos.map(todo => (
            <div>
              <h2>{todo.name}</h2>
              <p>{todo.description}</p>
              <button onClick={() => deleteTodo(todo)}>Delete note</button>
            </div>
          ))
        }
      </div>
      <Authenticator></Authenticator>
    </div>
  );
}

export default withAuthenticator(App);