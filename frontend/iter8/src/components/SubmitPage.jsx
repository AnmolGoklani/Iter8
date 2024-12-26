import { useState } from 'react';
import { TextField, Button, Typography, Container, Box} from '@mui/material';
import { createIteration, createIterationAttachment } from '../apiservice';
import { useParams, useNavigate } from 'react-router-dom';

const SubmitPage = () => {
    const {revieweeSubtaskId} = useParams();
    const [remark, setRemark] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRemarkChange = (event) => {
        event.preventDefault();
        setRemark(event.target.value);
    };

    const handleAttachmentChange = (event) => {
        setAttachments([...attachments,...event.target.files]);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(revieweeSubtaskId);
            const iterationResponse = await createIteration(revieweeSubtaskId,remark);
            const iterationId = iterationResponse.iteration_id;
            setMessage(iterationResponse.message);

            for (const attachment of attachments) {
                await createIterationAttachment(iterationId, attachment);
            }

            setRemark('');
            setAttachments([]);

            setMessage('Iteration and attachments created successfully!');
            setTimeout(() => {
                navigate(-1);
            }, 2500);
            
        } catch {
            setMessage('Error creating iteration or attachments.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom color="text.primary">
                    Submit Iteration
                </Typography>
                <form>
                    <TextField
                        label="Remark"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={remark}
                        onChange={handleRemarkChange}
                        onKeyDown={handleKeyPress}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'primary.main',
                              },
                              '&:hover fieldset': {
                                borderColor: 'secondary.main',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'secondary.main',
                              },
                            },
                            '& .MuiInputBase-input': {
                              color: 'text.primary',
                            },
                            '& .MuiInputLabel-root': {
                              color: '#f8f8f2',
                            },
                          }}
                    />
                    <div>
                        <input
                            type="file"
                            multiple
                            onChange={handleAttachmentChange}
                            style={{ display: 'none' }}
                            id="file-input"
                        />
                        <label htmlFor="file-input">
                            <Button variant="contained" component="span">
                                Upload Attachments
                            </Button>
                        </label>
                    </div>
                    <Box sx={{ mt: 2 }}>
                        {attachments.length > 0 && attachments.map((file, index) => (
                            <Button key={index} variant="outlined" sx={{ mr: 1, mb: 1 }}>
                                {file.name}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box>
                </form>
                {message && (
                    <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default SubmitPage;