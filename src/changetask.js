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

export default function ChangeTask(data) {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);

  };


   function updateTask() {
       let task_id = data.data.task_id
       let title = document.getElementById('title').value
       let description = document.getElementById('description').value
       let task_end = document.getElementById('date').value
       let priority = document.getElementById('priority').innerText
       let responsible = document.getElementById('responsible').offsetParent.children[1].value
       let status = document.getElementById('status').innerText
       axios.post('http://127.0.0.1:5000/update_task', {task_id: task_id, title: title,description: description,task_end: task_end,
           priority: priority, responsible: responsible, status: status})
       handleClose()
    }

    function updateTaskStatus() {
       let task_id = data.data.task_id
       let status = document.getElementById('status').innerText
       axios.post('http://127.0.0.1:5000/update_task_status',{task_id: task_id, status: status})
       handleClose()
    }


  const classes = useStyles();
  const [priority, setPriority] = React.useState('');
  const [responsible, setResponsible] = React.useState('');
  const [status, setStatus] = React.useState('');

  const priorityChange = (event) => {
    setPriority(event.target.value);
  };

  const statusChange = (event) => {
    setStatus(event.target.value);
  };

  const responsibleChange = (event) => {
    setResponsible(event.target.value);
  };

  if (data.tablename === 'main')
  {
      var form = <div>
      <Button variant="outlined" color="default" onClick={handleClickOpen}>
        ???????????????? ????????????
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">???????????? {data.data.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ????????????????
          </DialogContentText>
          <TextField
            disabled={true}
            defaultValue={data.data.title}
            autoFocus
            id="title"
            label="?????????????????? ????????????"
            fullWidth
          />
          <TextField
            disabled={true}
            defaultValue={data.data.description}
            autoFocus
            id="description"
            label="???????????????? ????????????"
            multiline
            fullWidth
          />
          <TextField
            disabled={true}
            defaultValue={data.data.task_end}
            autoFocus
            id="date"
            label="???????? ??????????????????"
            type="date"
            fullWidth
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="priority-select">??????????????????</InputLabel>
            <Select
              disabled={true}
              labelId="priority-select"
              id="priority"
              value={priority}
              onChange={priorityChange}
              defaultValue={data.data.priority}
            >
              <MenuItem value={'High'}>??????????????</MenuItem>
              <MenuItem value={'Medium'}>??????????????</MenuItem>
              <MenuItem value={'Low'}>????????????</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="status-select">????????????</InputLabel>
            <Select
              labelId="status-select"
              id="status"
              value={status}
              onChange={statusChange}
              defaultValue={data.data.status}
            >
              <MenuItem value={'Start'}>?? ????????????????????</MenuItem>
              <MenuItem value={'Performed'}>??????????????????????</MenuItem>
              <MenuItem value={'Completed'}>??????????????????</MenuItem>
              <MenuItem value={'Cancelled'}>????????????????</MenuItem>
            </Select>
          </FormControl>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            ????????????
          </Button>
          <Button onClick={updateTaskStatus} color="primary">
            ??????????????????
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  } else {
      var form =
          <div>
      <Button variant="outlined" color="default" onClick={handleClickOpen}>
        ???????????????? ????????????
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">???????????? {data.data.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ????????????????
          </DialogContentText>
          <TextField
            defaultValue={data.data.title}
            autoFocus
            id="title"
            label="?????????????????? ????????????"
            fullWidth
          />
          <TextField
            defaultValue={data.data.description}
            autoFocus
            id="description"
            label="???????????????? ????????????"
            multiline
            fullWidth
          />
          <TextField
            defaultValue={data.data.task_end}
            autoFocus
            id="date"
            label="???????? ??????????????????"
            type="date"
            fullWidth
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="priority-select">??????????????????</InputLabel>
            <Select
              labelId="priority-select"
              id="priority"
              value={priority}
              onChange={priorityChange}
              defaultValue={data.data.priority}
            >
              <MenuItem value={'High'}>??????????????</MenuItem>
              <MenuItem value={'Medium'}>??????????????</MenuItem>
              <MenuItem value={'Low'}>????????????</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="status-select">????????????</InputLabel>
            <Select
              labelId="status-select"
              id="status"
              value={status}
              onChange={statusChange}
              defaultValue={data.data.status}
            >
              <MenuItem value={'Start'}>?? ????????????????????</MenuItem>
              <MenuItem value={'Performed'}>??????????????????????</MenuItem>
              <MenuItem value={'Completed'}>??????????????????</MenuItem>
              <MenuItem value={'Cancelled'}>????????????????</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="responsible-select">??????????????????????????</InputLabel>
            <Select
              labelId="responsible-select"
              id="responsible"
              value={responsible}
              onChange={responsibleChange}
            >
              {data.resp.map((resp) => (
              <MenuItem  value={resp.id}>{resp.name}</MenuItem>
                ))}
            </Select>
          </FormControl>


        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            ????????????
          </Button>
          <Button onClick={updateTask} color="primary">
            ??????????????
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  }

  return (
    <div>
      {form}
    </div>
  );
}
