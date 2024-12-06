import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAssignment, fetchAssignmentAttachments, fetchAssignmentSubtaskList, fetchRevieweeSubtaskList } from '../apiservice';
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, CircularProgress, Alert, Button } from '@mui/material';

const AssignmentPage = () => {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    // const [revieweeSubtasks, setRevieweeSubtasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAssignment = async () => {
            try {
                const assignmentData = await fetchAssignment(assignmentId);
                setAssignment(assignmentData);
                const attachmentsData = await fetchAssignmentAttachments(assignmentId);
                setAttachments(attachmentsData);
                const subtasksData = await fetchAssignmentSubtaskList(assignmentId);
                setSubtasks(subtasksData);
                // const revieweeSubtasksData = await fetchRevieweeSubtaskList(assignmentId);
                // setRevieweeSubtasks(revieweeSubtasksData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadAssignment();
    }, [assignmentId]);

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

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">Error loading assignment details: {error.message}</Alert>;

    // const completedSubtaskIds = new Set(
    //     revieweeSubtasks
    //         .filter(revieweeSubtask => revieweeSubtask.isCompleted)
    //         .map(revieweeSubtask => revieweeSubtask.subtask)
    // );

    // const notCompletedSubtasks = subtasks.filter(subtask => !completedSubtaskIds.has(subtask.id));
    // const completedSubtasks = subtasks.filter(subtask => completedSubtaskIds.has(subtask.id));


    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Assignment Details
            </Typography>
            {assignment && (
                <Card sx={{ mb: 4, border: '2px solid', borderColor: 'primary.main' }}>
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            {assignment[0].name}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Description:</strong> {assignment[0].description}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Due Date:</strong> {formatDate(assignment[0].due_date)}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Created At:</strong> {formatDate(assignment[0].created_at)}
                        </Typography>
                        {/* <Typography variant="body1" gutterBottom>
                            <strong>Creator:</strong> <span style={{ fontWeight: 'bold' }}>{assignment[0].creator}</span>
                        </Typography> */}
                        <Typography variant="body1" gutterBottom>
                            <strong>Reviewers:</strong>
                        </Typography>
                        <List>
                            {assignment[0].reviewers && assignment[0].reviewers.map((reviewer, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`Reviewer ${index + 1}: ${reviewer.name}`} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}
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
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        }}}
                                        
                                        onClick={() => navigate('/subtask/' + subtask.id


                                        )}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {subtask.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Due Date: {formatDate(subtask.due_date)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))}




                        {/* {notCompletedSubtasks.map((subtask, index) => (
                            <ListItem key={index} sx={{ mb: 2 }}>
                                <Card 
                                    sx={{ 
                                        width: '100%', 
                                        border: '1px solid', 
                                        borderColor: 'error.main', 
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        }}}
                                        onClick={() => navigate('/subtask/' + subtask.id)}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {subtask.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Due Date: {formatDate(subtask.due_date)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))}
                        {completedSubtasks.map((subtask, index) => (
                            <ListItem key={index} sx={{ mb: 2 }}>
                                <Card 
                                    sx={{ 
                                        width: '100%', 
                                        border: '1px solid', 
                                        borderColor: 'info.main', 
                                        cursor: 'pointer',
                                        opacity: 0.6,
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                            opacity: 1
                                        }
                                    }}
                                    onClick={() => navigate('/subtask/' + subtask.id)}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="div">
                                            {subtask.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Due Date: {formatDate(subtask.due_date)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))} */}
                    </List>
                </CardContent>
            </Card>
 
        </Container>
    );
};

export default AssignmentPage;