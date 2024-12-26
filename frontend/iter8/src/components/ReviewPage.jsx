import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAssignment, fetchAssignmentAttachments, fetchAssignmentSubtaskList, createSubtask } from '../apiservice';
import { Container, Typography, Card, CardContent, List, ListItem, CircularProgress, Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ReviewPage = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [newSubtaskData, setNewSubtaskData] = useState({
        name: '',
        description: '',
        due_date: '',
        maxscore: 100
    });

    useEffect(() => {
        const loadAssignment = async () => {
            try {
                const assignmentData = await fetchAssignment(assignmentId);
                setAssignment(assignmentData);
                const attachmentsData = await fetchAssignmentAttachments(assignmentId);
                setAttachments(attachmentsData);
                const subtasksData = await fetchAssignmentSubtaskList(assignmentId);
                setSubtasks(subtasksData);
                
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadAssignment();
    }, [assignmentId]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setNewSubtaskData({
            ...newSubtaskData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateSubtask = async () => {
        const subtaskData = {
            ...newSubtaskData,
            assignment_id: assignmentId,
            due_date: new Date(newSubtaskData.due_date).toISOString() 
        };
        try {
            await createSubtask(subtaskData);
            const subtasksData = await fetchAssignmentSubtaskList(assignmentId);
            setSubtasks(subtasksData);
            handleClose();
        } catch (error) {
            setError(error);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit', 
             
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error loading assignment details: {error.message}</Alert>;


    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                {assignment[0].name}
            </Typography>
            {assignment && (
                <Card sx={{ mb: 4, border: '2px solid', borderColor: 'primary.main' }}>
                    <CardContent>
                        <Typography variant="body1" gutterBottom>
                            <strong>Description:</strong> {assignment[0].description}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Due Date:</strong> {formatDate(assignment[0].due_date)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Created At:</strong> {formatDate(assignment[0].created_at)}
                        </Typography>
                    </CardContent>
                </Card>

                
            )}


            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Reviewees
            </Typography>

            <Card sx={{ border: '2px solid', borderColor: 'primary.main'  , mb: 4}}>
                <CardContent>
                    <List>

                        
                        {assignment[0].reviewees && assignment[0].reviewees.map((reviewee, index) => (
                            <ListItem key={index} sx={{ mb: 2 }}>
                                <Card 
                                    sx={{ 
                                        width: '100%', 
                                        border: '1px solid', 
                                        borderColor: 'info.main', 
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        }}}
                                        
                                        onClick={() => navigate(`/revieweeAssignment/${reviewee.id}/${assignmentId}`)}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {reviewee.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))}

                    </List>
                </CardContent>
            </Card>

            <Typography variant="h5" gutterBottom>
                Attachments
            </Typography>
            <Card sx={{ border: '2px solid', borderColor: 'primary.main' }}>
                <CardContent>
                    <List>
                        {attachments && attachments.map((attachment, index) => (
                            <ListItem key={index}>
                                <Button
                                    variant="contained"
                                    href={attachment}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ borderRadius: '50px', textTransform: 'none', borderColor: 'secondary.main', color: 'primary.contrastText', backgroundColor: 'primary.main' }}
                                >
                                    Attachment {index + 1}
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Subtasks
                <IconButton
                    color="primary"
                    onClick={handleClickOpen}
                    sx={{ 
                        ml: 2,
                        backgroundColor: 'info.main',
                        padding: '2px',
                        '&:hover': {
                            backgroundColor: 'info.dark',
                        },
                        color: 'primary.contrastText'
                    }}
                >
                    <AddIcon fontSize="small"/>
                </IconButton>
            </Typography>
            <Card sx={{ border: '2px solid', borderColor: 'primary.main' }}>
                <CardContent>
                <List>
                    {subtasks.map((subtask, index) => (
                        <ListItem key={index} sx={{ mb: 2 }}>
                            <Card 
                                sx={{ 
                                    width: '100%', 
                                    border: '1px solid', 
                                    borderColor: 'info.main', 
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    // '&:hover': {
                                    //     transform: 'translateY(-4px)',
                                    //     boxShadow: 4,
                                    // }
                                    }}
                                
                            >
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {subtask.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.primary">
                                        {subtask.maxscore} points
                                    </Typography>
                                    <Typography variant="body2" color="text.primary">
                                        {subtask.description}
                                    </Typography>
                                    <Typography variant="body2" color="error.main">
                                        {formatDate(subtask.due_date)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </ListItem>
                    ))}
                </List>
                </CardContent>
            </Card>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Subtask</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newSubtaskData.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newSubtaskData.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="due_date"
                        label="Due Date"
                        type="datetime-local"
                        fullWidth
                        variant="standard"
                        value={newSubtaskData.due_date}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="maxscore"
                        label="Max Score"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={newSubtaskData.maxscore}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateSubtask}>Create</Button>
                </DialogActions>
            </Dialog>
 
        </Container>
    );
};

export default ReviewPage;