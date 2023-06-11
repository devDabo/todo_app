import React, { Component } from 'react';
import axios from 'axios';
import Form from './components/Form';
import Table from './components/Table';

class App extends Component {
  onSubmitTodo = () => {
    axios
      .post('http://localhost:4000/createtodo', {
        todo: this.state.todoText
      })
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
      <div className="App">
        <Form onTodoTextChange={this.handleTodoTextChange} onSubmitTodo={this.onSubmitTodo} />
        <button onClick={this.onSubmitTodo}>Add todo</button>
        <Table ref={instance => (this.tableComponent = instance)} />
      </div>
    );
  }
}

export default App;
