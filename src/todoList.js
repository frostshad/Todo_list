import React from "react";
import FormDialog from "./newtask";
import Button from '@material-ui/core/Button';
import TaskTable from "./table";


export default class Todo_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true, subIsLoading: true, respIsLoading: true, data: [], subData:[],respData:[]};


    this.componentWillMount = this.componentWillMount.bind(this)
    this.dayTasks = this.dayTasks.bind(this)
    this.weekTasks = this.weekTasks.bind(this)
    this.mweekTasks = this.mweekTasks.bind(this)
    this.allTasks = this.allTasks.bind(this)
    this.respSelect = this.respSelect.bind(this)
    this.subTasks = this.subTasks.bind(this)
    }

    async respSelect() {
        const response = await fetch('http://127.0.0.1:5000/select_resp?login='+this.props.login)
        const respData = await response.json()
        this.setState({respIsLoading: false, respData})
    }


    async subTasks() {
        const response = await fetch('http://127.0.0.1:5000/sub_todo_list?login='+this.props.login)
        const subData = await response.json()
        this.setState({subIsLoading: false, subData})
    }


    async dayTasks() {
        const response = await fetch('http://127.0.0.1:5000/todo_list?login='+this.props.login+'&date=Now')
        const data = await response.json()
        this.setState({isLoading: false, data})


    }
    async weekTasks() {
        const response = await fetch('http://127.0.0.1:5000/todo_list?login='+this.props.login+'&date=Week')
        const data = await response.json()
        this.setState({isLoading: false, data})
    }

     async mweekTasks() {
        const response = await fetch('http://127.0.0.1:5000/todo_list?login='+this.props.login+'&date=mWeek')
        const data = await response.json()
        this.setState({isLoading: false, data})
    }

    async allTasks() {
        const response = await fetch('http://127.0.0.1:5000/todo_list?login='+this.props.login+'&date=All')
        const data = await response.json()
        this.setState({isLoading: false, data})
    }

    async componentWillMount() {
        this.allTasks()
        this.subTasks()
        this.respSelect()
    }


    render() {
        let items = this.state.data
        let subItems = this.state.subData
        let newdata = this.state.respData
        let page = null
        let subPage = null
        let respPage = null
        if (this.state.isLoading === false)
        {page =  <TaskTable rows={items} tablename={'main'}/>} else {page = <div>loading</div>}
        if (this.state.subIsLoading === false)
        {subPage =  <TaskTable rows={subItems} tablename={'sub'} data={newdata}/>} else {subPage = <div>loading</div>}
        if (this.state.respIsLoading === false)
        {respPage =  <FormDialog login={this.props.login} data = {newdata}/>} else {respPage = <div>loading</div>}
        if (items === null)
        {page = <div>У вас нет задач</div>}
        if (subItems === null)
        {subPage = <div>Нет задач подчиненных</div>}




        return (
            <div>
                {page}
            <Button variant="outlined" color="default" onClick={this.dayTasks}>Задачи на сегодня</Button>
            <Button variant="outlined" color="default" onClick={this.weekTasks}>Задачи на неделю</Button>
            <Button variant="outlined" color="default" onClick={this.allTasks}>Все задачи</Button>
            <Button variant="outlined" color="default" onClick={this.mweekTasks}>Задачи на будущее</Button>
                <br/>

                {respPage}
                {subPage}
            <Button variant="outlined" color="default" onClick={this.subTasks}>Задачи на сегодня</Button>
            </div>

        );
    }
}
