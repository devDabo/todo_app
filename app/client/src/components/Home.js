import React, { Component } from 'react';
import axios from 'axios';
import Form from './Form';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:4000';

class Home extends Component {
  state = {
    todos: [],
    completedTodos: [],
    editingTodoId: null,
    editedTodoText: '',
    isAuthenticated: false,
  };

  componentDidMount() {
    this.checkAuthentication();
  }

  checkAuthentication = () => {
    axios.get('/api/auth/status', { withCredentials: true })
      .then(response => {
        this.setState({ isAuthenticated: response.data.authenticated });
        if (response.data.authenticated) {
          this.fetchTodos();
        }
      })
      .catch(error => {
        console.error('Authentication verification failed', error);
        this.setState({ isAuthenticated: false });
      });
  }

  fetchTodos = () => {
    if (!this.state.isAuthenticated) {
      console.log('Not authenticated');
      return;
    }

    axios.get('/api/todo')
      .then(response => {
        this.setState({ 
          todos: response.data.filter(todo => !todo.complete),
          completedTodos: response.data.filter(todo => todo.complete),
        });
      })
      .catch(error => console.error('Error fetching todos', error));
  }

  addTodo = (todoText) => {
    axios.post('/api/todo', { todo: todoText })
      .then(response => {
        console.log('Todo added successfully');
        this.fetchTodos(); // Refresh the todo list after adding a new todo
      })
      .catch(error => {
        console.error('Error adding todo', error);
      });
  }

  deleteTodo = (id) => {
    axios.delete(`/api/todo/${id}`)
      .then(response => {
        console.log('Todo deleted successfully');
        this.fetchTodos(); // Refresh the todo list after deletion
      })
      .catch(error => {
        console.error('Error deleting todo', error);
      });
  }

  startEditing = (id, todo) => {
    this.setState({
      editingTodoId: id,
      editedTodoText: todo,
    });
  }

  cancelEditing = () => {
    this.setState({
      editingTodoId: null,
      editedTodoText: '',
    });
  }

  saveTodo = (id) => {
    const { editedTodoText } = this.state;
    axios.put(`/api/todo/${id}`, { todo: editedTodoText })
      .then(response => {
        console.log('Todo updated successfully');
        this.fetchTodos(); // Refresh the todo list after updating
        this.cancelEditing();
      })
      .catch(error => {
        console.error('Error updating todo', error);
      });
  }

  toggleComplete = (id) => {
    const todo = this.state.todos.find(todo => todo._id === id);
    if (!todo) return;

    axios.put(`/api/todo/${id}`, { complete: !todo.complete })
      .then(response => {
        console.log('Todo completion status updated');
        this.fetchTodos(); // Refresh the todo list after toggling completion status
      })
      .catch(error => {
        console.error('Error updating todo completion status', error);
      });
  }

  handleTodoTextChange = (newText) => {
    this.setState({ editedTodoText: newText });
  }

  render() {
    const { isAuthenticated, todos, completedTodos, editingTodoId, editedTodoText } = this.state;

    if (!isAuthenticated) {
      return <div>Please log in to view todos.</div>;
    }

    return (
      <div>
        <h2>Todo List</h2>
        <Form onFormSubmit={this.addTodo} />
        <table>
          <thead>
            <tr>
              <th>Todo</th>
              <th>Complete</th>
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
                  <input
                    type="checkbox"
                    checked={todo.complete}
                    onChange={() => this.toggleComplete(todo._id)}
                  />
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
          {completedTodos.length > 0 && (
            <tfoot>
              <tr>
                <th colSpan="4">Completed Todos:</th>
              </tr>
              {completedTodos.map(todo => (
                <tr key={todo._id}>
                  <td>{todo.todo}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={todo.complete}
                      disabled
                    />
                  </td>
                  <td>
                    <button onClick={() => this.deleteTodo(todo._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
    );
  }
}

export default Home;