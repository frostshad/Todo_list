import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ChangeTask from "./changetask";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});





export default function TaskTable(rows) {
  const classes = useStyles();
  const rowClick = (event) => {

  };


  return (

    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" >
        <TableHead>
          <TableRow>
            <TableCell align="right">Заголовок</TableCell>
            <TableCell align="right">Приоритет</TableCell>
            <TableCell align="right">Дата завершения</TableCell>
            <TableCell align="right">Ответственный</TableCell>
            <TableCell align="right">Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.rows.map((row) => (
            <TableRow key={row.name} id={row.task_id} onClick={rowClick}>
              <TableCell id={row.task_id} align="right">{row.title}</TableCell>
              <TableCell id={row.task_id} align="right">{row.priority}</TableCell>
              <TableCell id={row.task_id} align="right">{row.task_end}</TableCell>
              <TableCell id={row.task_id} align="right">{row.resp_name}</TableCell>
              <TableCell id={row.task_id} align="right">{row.status}</TableCell>
              <ChangeTask data={row} tablename={rows.tablename} resp={rows.data}/>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
