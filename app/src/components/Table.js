import React, { Component } from 'react';
import axios from 'axios';

class Table extends Component {
  state = {
    todos: [],
    editingTodoId: null,
    editedTodoText: ''
  };

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = () => {
    axios
      .get('http://localhost:4000/todo/${id}')
      .then(response => {
        this.setState({ todos: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  deleteTodo = (id) => {
    if (!id) {
      console.log('Invalid todo ID');
      return;
    }

    axios
      .delete(`http://localhost:4000/todo/${id}`)
      .then(response => {
        console.log('Todo deleted successfully');
        this.fetchTodos(); // Refresh the todo list after deletion
      })
      .catch(error => {
        console.log(error);
      });
  };

  startEditing = (id, todo) => {
    this.setState({
      editingTodoId: id,
      editedTodoText: todo
    });
  };

  cancelEditing = () => {
    this.setState({
      editingTodoId: null,
      editedTodoText: ''
    });
  };

  saveTodo = (id) => {
    const { editedTodoText } = this.state;
    if (!editedTodoText.trim()) {
      console.log('Todo text cannot be empty');
      return;
    }

    axios
      .put(`http://localhost:4000/todo/${id}`, { todo: editedTodoText })
      .then(response => {
        console.log('Todo updated successfully');
        this.fetchTodos(); // Refresh the todo list after editing
        this.cancelEditing();
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { todos, editingTodoId, editedTodoText } = this.state;
    console.log('Todo list:', todos);
    return (
      <div>
        <h2>Todo List</h2>
        <table>
          <thead>
            <tr>
              <th>Todo</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {todos.map(todo => (
              <tr key={todo._id}>
                <td>
                  {editingTodoId === todo._id ? (
                    <input
                      type="text"
                      value={editedTodoText}
                      onChange={(e) => this.setState({ editedTodoText: e.target.value })}
                    />
                  ) : (
                    todo.todo
                  )}
                </td>
                <td>
                  {editingTodoId === todo._id ? (
                    <>
                      <button onClick={() => this.saveTodo(todo._id)}>Save</button>
                      <button onClick={() => this.cancelEditing()}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => this.startEditing(todo._id, todo.todo)}>Edit</button>
                  )}
                </td>
                <td>
                  <button onClick={() => this.deleteTodo(todo._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
