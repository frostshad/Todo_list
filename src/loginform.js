import React from 'react'
import axios from 'axios'
import Todo_list from "./todoList";


export default class LoginForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          login : '',
          password : '',
          isLogged: false
      };

      this.inputLogin = this.inputLogin.bind(this);
      this.inputPassword = this.inputPassword.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  inputLogin(event) {
      this.setState({login: event.target.value})
  }

  inputPassword(event) {
      this.setState({password: event.target.value})
  }

  handleSubmit(event) {

      axios.post('http://127.0.0.1:5000/user',  {login: this.state.login, password: this.state.password})
      .then(res => {
        if (res.data === 2) {this.setState({isLogged: true})} else {
            if (res.data === 1) {alert('Неверный пароль')}
            else {alert('Пользователя не существует')}}
      })
      event.preventDefault();
      }


  render() {
      let page = null
      if (this.state.isLogged === false) {
          page =
          <form onSubmit={this.handleSubmit}>
              <label>
                  Login:&nbsp;
                  <input type='text' value={this.state.login} onChange={this.inputLogin}/>
                  <br/>
                  Password:&nbsp;
                  <input type='password' value={this.state.password} onChange={this.inputPassword}/>
                  <br/>
                  <input type="submit" value="Войти" />
              </label>
          </form>
      } else { page =  <div> <Todo_list login={this.state.login}/></div> }


      return (

           <div> {page} </div>

      );
  }
}




