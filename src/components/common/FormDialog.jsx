import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


export default function FormDialog({ onSave }) {
  const [open, setOpen] = React.useState(false);

  const [project, setProject] = React.useState({
    title: "",
    role: "",
    project_desc: "",
    techstack: ""
  });

  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    onSave(project);      // ✅ send data to RHF
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Project Details
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} keepMounted={false}>
        <DialogContent>
          <TextField
            name="title"
            label="Project Title"
            fullWidth
            margin="dense"
            value={project.title}
            onChange={handleChange}
          />

          <TextField
            name="role"
            label="Your Role In The Project"
            fullWidth
            margin="dense"
            value={project.role}
            onChange={handleChange}
          />

          <TextField
            name="project_desc"
            label="Project Description"
            fullWidth
            margin="dense"
            value={project.project_desc}
            onChange={handleChange}
          />

          <TextField
            name="techstack"
            label="Tech Stack Used In The Project"
            fullWidth
            margin="dense"
            value={project.techstack}
            onChange={handleChange}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
