import './App.css';
import React, {useContext} from 'react'
import LoginForm from './loginform'
import Todo_list from './todoList'
import UserContext from './context'


function App() {
  let isLogged = useContext(UserContext)
  return (
      <UserContext.Provider>
        {console.log(isLogged.isLogged)}
        {isLogged.isLogged === 'true' ? <Todo_list/> :   <LoginForm/>}
      </UserContext.Provider>
  );
}

export default App;
