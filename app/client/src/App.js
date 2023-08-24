import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Form from './components/Form';
import Table from './components/Table';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [todoText, setTodoText] = useState('');
  const tableComponent = useRef(null);

  const onSubmitTodo = () => {
    axios
      .post('http://localhost:4000/api/todo', { todo: todoText })
      .then(response => {
        console.log(response.data);
        tableComponent.current.fetchTodos();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleTodoTextChange = newText => {
    setTodoText(newText);
  };

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
        </Switch>
        <Form onTodoTextChange={handleTodoTextChange} onSubmitTodo={onSubmitTodo} />
        <button onClick={onSubmitTodo}>Add todo</button>
        <Table ref={tableComponent} />
      </div>
    </Router>
  );
}

export default App;
