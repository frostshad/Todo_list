import './App.css';
import React, {useContext} from 'react'
import LoginForm from './loginform'
import Todo_list from './todoList'
import {LoggedContext} from './context'




function App() {
  let isLogged = useContext(LoggedContext)

  return (
        <LoggedContext.Provider value={LoggedContext}>
        {isLogged.isLogged === 'true' ? <Todo_list />  :   <LoginForm />}
        </LoggedContext.Provider>
  );
}

export default App;

