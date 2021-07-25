import React from "react";
import table from "./table"




export default class Todo_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true, data: []};


    this.componentWillMount = this.componentWillMount.bind(this)
    }




    async componentWillMount() {
        const response = await fetch('http://127.0.0.1:5000/todo_list',{body: this.state.login})
        const data = await response.json()
        this.setState({isLoading: false, data})
        console.log(this.state.data)
    }


    render() {
        let items = this.state.data
        let page = null
        console.log(items)
        if (this.state.isLoading === false) {
          page = <table>
              { items.map(item =>(
                <tr key={item.task_id}>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.task_start}</td>
                    <td>{item.task_end}</td>
                    <td>{item.updated}</td>
                </tr>
              ))}</table>
      } else {page = <div>loading</div>}


        return (
            <div>
                {page}
            </div>
        );
    }
}

