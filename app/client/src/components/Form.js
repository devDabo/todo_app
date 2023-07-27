import React, { useState } from 'react';

const Form = ({ onTodoTextChange }) => {
  const [todoText, setTodoText] = useState('');

  const handleChange = e => {
    const newText = e.target.value;
    setTodoText(newText);
    onTodoTextChange(newText); // Call the onTodoTextChange prop with the new text
  };

  return (
    <>
      <form>
        <label>
          Todo: {' '}
          <input type="text" value={todoText} onChange={handleChange} />
        </label>
      </form>
    </>
  );
};

export default Form;
