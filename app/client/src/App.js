import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Form from './components/Form';
import Table from './components/Table';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';

class App extends Component {
  state = {
    todoText: ''
  };

  onSubmitTodo = () => {
    const { todoText } = this.state;

    axios
      .post('http://localhost:4000/api/todo', { todo: todoText })
      .then(response => {
        console.log(response.data);
        this.tableComponent.fetchTodos(); // Update the todos by calling fetchTodos in the Table component
      })
      .catch(error => {
        console.log(error);
      });
  };

  handleTodoTextChange = todoText => {
    this.setState({ todoText });
  };

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Home} />
          </Switch>
          <Form onTodoTextChange={this.handleTodoTextChange} onSubmitTodo={this.onSubmitTodo} />
          <button onClick={this.onSubmitTodo}>Add todo</button>
          <Table ref={instance => (this.tableComponent = instance)} />
        </div>
      </Router>
    );
  }
}

export default App;
