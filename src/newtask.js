import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


export default function FormDialog(data) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

  };


   function createTask() {
       let title = document.getElementById('title').value
       let description = document.getElementById('description').value
       let task_end = document.getElementById('date').value
       let priority = document.getElementById('priority').innerText
       let responsible = document.getElementById('responsible').offsetParent.children[1].value
       let creator = data.login.toString()
       axios.post('http://127.0.0.1:5000/create_task', {title: title,description: description,task_end: task_end, priority: priority, responsible: responsible, creator: creator})
       handleClose()
    }


  const classes = useStyles();
  const [priority, setPriority] = React.useState('');
  const [responsible, setResponsible] = React.useState('');
  const priorityChange = (event) => {
    setPriority(event.target.value);
  };
  const responsibleChange = (event) => {
    setResponsible(event.target.value);
  };


  return (

    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Новая задача
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Создание новой задачи</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Заполните данные задачи
          </DialogContentText>
          <TextField
            autoFocus
            id="title"
            label="Заголовок задачи"
            fullWidth
          />
          <TextField
            autoFocus
            id="description"
            label="Описание задачи"
            multiline
            fullWidth
          />
          <TextField
            autoFocus
            id="date"
            label="Дата окончания"
            type="date"
            fullWidth
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="priority-select">Приоритет</InputLabel>
            <Select
              labelId="priority-select"
              id="priority"
              value={priority}
              onChange={priorityChange}
              renderValue={'High'}
            >
              <MenuItem value={'High'}>Высокий</MenuItem>
              <MenuItem value={'Medium'}>Средний</MenuItem>
              <MenuItem value={'Low'}>Низкий</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="responsible-select">Ответственный</InputLabel>
            <Select
              labelId="responsible-select"
              id="responsible"
              value={responsible}
              onChange={responsibleChange}
            >

              {data.data.map((resp) => (
              <MenuItem  value={resp.id}>{resp.name}</MenuItem>
                ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={createTask} color="primary">
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
