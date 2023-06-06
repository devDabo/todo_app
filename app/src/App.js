import './App.css';
import React, {Component} from 'react';
import axios from 'axios';

class App extends Component {
  onSubmitTodo(){
    axios.post('http://localhost:4000/createtodo', {
      todo: 'todo55'
    })
    .then(response => {
      console.log(response.data)
    })
  }

  render() {
    return (
      <div className='App'>
        <button
          onClick={()=> this.onSubmitTodo()}
          >Add todo debug</button>
      </div>
    )
  }

}

export default App;
