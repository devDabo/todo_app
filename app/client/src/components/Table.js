import React, { Component } from 'react';
import axios from 'axios';

class Table extends Component {
  state = {
    todos: [],
    editingTodoId: null,
    editedTodoText: '',
    completedTodos: [],
  };

  componentDidMount() {
    this.fetchTodos();
  }

  fetchTodos = () => {
    axios
      .get('http://localhost:4000/api/todo')
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          const completedTodos = response.data.filter(todo => todo.complete);
          const incompleteTodos = response.data.filter(todo => !todo.complete);

          this.setState({
            todos: incompleteTodos,
            completedTodos: completedTodos,
          });
        } else {
          console.log('Invalid response data format');
        }
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
      .delete(`http://localhost:4000/api/todo/${id}`)
      .then(response => {
        console.log('Todo deleted successfully');
        this.setState(prevState => ({
          todos: prevState.todos.filter(todo => todo._id !== id),
          completedTodos: prevState.completedTodos.filter(todo => todo._id !== id),
        }));
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
      .put(`http://localhost:4000/api/todo/${id}`, { todo: editedTodoText })
      .then(response => {
        console.log('Todo updated successfully');
        this.fetchTodos(); // Refresh the todo list after editing
        this.cancelEditing();
      })
      .catch(error => {
        console.log(error);
      });
  };

  toggleComplete = (id) => {
    const { todos, completedTodos } = this.state;
    const todoToToggle = todos.find(todo => todo._id === id);

    if (!todoToToggle) {
      return;
    }

    const updatedTodos = todos.filter(todo => todo._id !== id);
    todoToToggle.complete = !todoToToggle.complete;

    if (todoToToggle.complete) {
      this.setState({
        todos: updatedTodos,
        completedTodos: [...completedTodos, todoToToggle],
      });
    } else {
      this.setState({
        todos: [...updatedTodos, todoToToggle],
        completedTodos: completedTodos.filter(todo => todo._id !== id),
      });
    }

    axios
      .put(`http://localhost:4000/api/todo/${id}`, { complete: todoToToggle.complete })
      .then(response => {
        console.log('Todo completion status updated successfully');
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { todos, completedTodos, editingTodoId, editedTodoText } = this.state;
    console.log('Todo list:', todos);
    console.log('Completed Todo list:', completedTodos);
    return (
      <div>
        <h2>Todo List</h2>
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
                  aria-label={`Toggle ${todo.todo}`}
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
                  <button onClick={() => this.deleteTodo(todo._id)}
                  aria-label={`Delete ${todo.todo}`}
                  >Delete</button>
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
                      onChange={() => this.toggleComplete(todo._id)}
                      aria-label={`Toggle ${todo.todo}`} // Adding aria-label
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

export default Table;
