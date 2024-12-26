import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAssignmentSubtaskList, fetchRevieweeSubtask, fetchIterationList, fetchIterationAttachment, fetchIterationComments, changeRevieweeSubtaskStatus, createComment } from '../apiservice';
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, CircularProgress, Alert, Button, IconButton, DialogActions, DialogTitle, Dialog, DialogContent, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const RevieweeAssignmentPage = () => {
    const { revieweeId, assignmentId } = useParams();
    const [subtasks, setSubtasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [currentIterationId, setCurrentIterationId] = useState(null);

    useEffect(() => {
        const loadSubtasks = async () => {
            try {
                const subtaskList = await fetchAssignmentSubtaskList(assignmentId);
                const subtasksWithDetails = await Promise.all(subtaskList.map(async (subtask) => {
                    // console.log(subtask);
                    // console.log(revieweeId);
                    const revieweeSubtask = await fetchRevieweeSubtask(subtask.id, revieweeId);
                    // console.log(revieweeSubtask);
                    const iterations = await fetchIterationList(revieweeSubtask[0].id);
                    const iterationsWithDetails = await Promise.all(iterations.map(async (iteration) => {
                        const comments = await fetchIterationComments(iteration.id);
                        const attachments = await fetchIterationAttachment(iteration.id);
                        return { ...iteration, comments, attachments };
                    }));
                    return { ...subtask, revieweeSubtask, iterations: iterationsWithDetails };
                }));
                setSubtasks(subtasksWithDetails);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadSubtasks();
    }, [revieweeId, assignmentId]);

    const handleMarkComplete = async (id) => {
        try {
            await changeRevieweeSubtaskStatus(id,1);
            window.location.reload();
        } catch (err) {
            console.error('Error marking subtask as complete:', err);
        }
    };

    const handleUnMarkComplete = async (id) => {
        try {
            await changeRevieweeSubtaskStatus(id,0);
            window.location.reload();
        } catch (err) {
            console.error('Error marking subtask as not complete:', err);
        }
    };

    const handleClickOpen = (iterationId) => {
        setCurrentIterationId(iterationId);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCreateComment = async () => {
        try {
            await createComment(currentIterationId, comment);
            setOpen(false);
            window.location.reload();
        } catch (err) {
            console.error('Error creating comment:', err);
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
                Assignment Subtasks
            </Typography>
            {subtasks.map((subtask) => (
                <Card key={subtask.id} sx={{ mb: 4, border: '2px solid', borderColor: 'primary.main' }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {subtask.name} {subtask.revieweeSubtask[0]?.isCompleted? (
                                
                            <Button 
                                variant="contained" 
                                style={{ 
                                    backgroundColor: 'green', 
                                    color: 'white', 
                                    fontSize: '0.8rem', 
                                    fontWeight: 'bold', 
                                    padding: '4px 12px', 
                                    borderRadius: '12px', 
                                    marginLeft: '8px' 
                                }}
                                onClick={() => handleUnMarkComplete(subtask.revieweeSubtask[0]?.id)}
                            >
                                Mark Uncomplete
                            </Button>

                            ): (
                                <Button 
                                    variant="outlined"
                                    sx={
                                        { 
                                            borderColor: 'success.main', 
                                            color: 'success.main', 
                                            textTransform: 'none', 
                                            borderRadius: '50px', 
                                            '&:hover': { 
                                                backgroundColor: 'success.main', 
                                                color: 'white' 
                                            } 
                                        }
                                    }
                                    onClick={() => handleMarkComplete(subtask.revieweeSubtask[0]?.id)}
                                >
                                    Mark Complete
                                </Button>
                            )}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Due Date:</strong> {formatDate(subtask.due_date)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Max Score:</strong> {subtask.maxscore}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Iterations
                        </Typography>
                        {subtask.iterations.map((iteration) => (
                            <Card key={iteration.id} sx={{ mb: 4, border: '2px solid', borderColor: iteration.isReviewed ? 'success.main' : 'error.main' }}>
                                <CardContent>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Date Submitted:</strong> {formatDate(iteration.date_submitted)}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Remark:</strong> {iteration.remark}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Attachments:</strong>
                                        <List>
                                            {(iteration.attachments?.attachments || []).map((attachment, index) => (
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
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <strong>Comments:</strong>
                                        <IconButton 
                                            color="primary" 
                                            aria-label="add comment" 
                                            sx={{ 
                                                marginLeft: '8px', 
                                                backgroundColor: 'secondary.main', 
                                                color: 'white',
                                                padding: '1px',
                                                fontSize: '0.5rem',
                                                '&:hover': {
                                                    backgroundColor: 'secondary.dark'
                                                }
                                            }}
                                            onClick={() => handleClickOpen(iteration.id)}
                                        >
                                            <AddIcon fontSize="small"/>
                                        </IconButton>
                                        <Dialog open={open} onClose={handleClose}>
                                            <DialogTitle>Add Comment</DialogTitle>
                                            <DialogContent>
                                                <TextField
                                                    autoFocus
                                                    margin="dense"
                                                    label="Comment"
                                                    type="text"
                                                    fullWidth
                                                    variant="standard"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose}>Cancel</Button>
                                                <Button onClick={handleCreateComment}>Create</Button>
                    
                                            </DialogActions>
                                        </Dialog>
                                        <List>
                                            {iteration.comments.map((comment, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText primary={`${comment.comment}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            ))}
            {/* <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Comment</DialogTitle>
                <DialogContent>
                    <TextField
                        placeholder="Type your comment"
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={Comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button  >Create</Button>
                </DialogActions>
            </Dialog> */}
        </Container>
    );
};

export default RevieweeAssignmentPage;
