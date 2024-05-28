import React, { useState } from 'react';

const Form = ({ onFormSubmit }) => {
  const [todoText, setTodoText] = useState('');

  const handleChange = e => {
    setTodoText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoText.trim() === '') {
      return;
    }
    onFormSubmit(todoText);
    setTodoText('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Todo: {' '}
          <input type="text" value={todoText} onChange={handleChange} />
        </label>
        <button type="submit">Add Todo</button>
      </form>
    </>
  );
};

export default Form;