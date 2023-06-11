import React, { Component } from 'react';
import axios from 'axios';
import Form from './components/Form';

class App extends Component {
  onSubmitTodo = () => {
    axios
      .post('http://localhost:4000/createtodo', {
        todo: this.state.todoText
      })
      .then(response => {
        console.log(response.data);
      });
  };

  handleTodoTextChange = todoText => {
    this.setState({ todoText });
  };

  render() {
    return (
      <div className="App">
        <Form onTodoTextChange={this.handleTodoTextChange} />
        <button onClick={this.onSubmitTodo}>Add todo</button>
      </div>
    );
  }
}

export default App;