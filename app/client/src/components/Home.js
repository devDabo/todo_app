import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
    state = {
        todos: [],
        error: null,
    };

    componentDidMount() {
        this.fetchTodos();
    }

    fetchTodos = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:4000/api/todo', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            this.setState({ todos: response.data });
        })
        .catch((error) => {
            console.error(error);
            this.setState({ error: 'An error occurred while fetching todos' });
        });
    };

    render() {
        const { todos, error } = this.state;
        return (
            <div>
                <h2>Your Todos</h2>
                {error ? <p>{error}</p> : (
                    <ul>
                        {todos.map((todo) => (
                            <li key={todo._id}>{todo.text}</li>  // Assuming 'text' property contains todo text
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

export default Home;
