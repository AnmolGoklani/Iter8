import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSubtask , fetchRevieweeSubtask, fetchIterationAttachment, fetchIterationComments, fetchIterationList} from '../apiservice';
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, CircularProgress, Alert, Button } from '@mui/material';

const SubtaskPage = () => {
    const { subtaskId } = useParams();
    const navigate = useNavigate();
    const [Subtask, setSubtask] = useState(null);
    const [RevieweeSubtask, setRevieweeSubtask] = useState(null);
    const [Iterations, setIterations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSubtask = async () => {
            try {
                const SubtaskData = await fetchSubtask(subtaskId);
                setSubtask(SubtaskData);
                const RevieweeSubtaskData = await fetchRevieweeSubtask(subtaskId);
                console.log(RevieweeSubtaskData);
                setRevieweeSubtask(RevieweeSubtaskData);
                const IterationData = await fetchIterationList(RevieweeSubtaskData[0].id);
                
                const IterationDataWithDetails = await Promise.all(IterationData.map(async (iteration) => {
                    const comments = await fetchIterationComments(iteration.id);
                    const attachments = await fetchIterationAttachment(iteration.id);
                    return { ...iteration, comments, attachments };
                }));
    
                setIterations(IterationDataWithDetails);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadSubtask();
    }, [subtaskId]);

    const formatDate = (dateString) => {
        const options = { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    const handleSubmit = () => {
        // Handle the submit action here
        console.log('Submit button clicked');
    };


    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error loading Subtask details: {error.message}</Alert>;

    

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                {Subtask[0].name}
            </Typography>
            {Subtask && (
                <Card sx={{ mb: 4, border: '2px solid', borderColor: 'primary.main' }}>
                    <CardContent>
                        <Typography variant="body1" gutterBottom>
                            <strong>Description:</strong> {Subtask[0].description}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Due Date:</strong> {formatDate(Subtask[0].due_date)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Max Score:</strong> {Subtask[0].maxscore}
                        </Typography>
                        
                    </CardContent>
                </Card>
            )}

            {RevieweeSubtask && RevieweeSubtask[0].isCompleted && (
                <Alert severity="success"sx={{ border: '2px dashed', borderColor: 'success.main', mb: '24px' }} >This subtask is completed</Alert>
            )}

            <Typography variant="h5" gutterBottom>
                Iterations
            </Typography>

            {Iterations && Iterations.map((iteration) => (
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

            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                sx={{ mt: 4 }}
            >
                Submit next iteration
            </Button>
            
            

        </Container>
    );
};

export default SubtaskPage;