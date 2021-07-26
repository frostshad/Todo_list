import React, {useContext} from "react";


export default class Todo_list extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isLoading: true, data: []};


    this.componentWillMount = this.componentWillMount.bind(this)
    }




    async componentWillMount() {
        const response = await fetch('http://127.0.0.1:5000/todo_list?login='+this.state.login)
        console.log(this.state.login)
        const data = await response.json()
        this.setState({isLoading: false, data})
    }


    render() {
        let items = this.state.data
        let page = null
        console.log(items)
        if (this.state.isLoading === false) {

            page =
                <table>
              { items.map(item =>(
                  <tbody>
                <tr key={item.task_id}>
                    <td>{item.title}</td>
                    <td>{item.priority}</td>
                    <td>{item.task_end}</td>
                    <td>{item.resp_name}</td>
                    <td>{item.status}</td>
                </tr>
                 </tbody>
              ))}

                    </table>
      } else {page = <div>loading</div>}

        return (
            <div>{page}</div>
        );
    }
}

