import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchReviews, createAssignment, fetchUsers, fetchGroupList, fetchGroupMembers, createAssignmentAttachment } from '../apiservice';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Stack,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,

} from '@mui/material';

const ReviewList = () => {
  const [Reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    name: '',
    description: '',
    due_date: '',
    reviewee_list: [],
    reviewer_list: []
  });
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedReviewees, setSelectedReviewees] = useState([]);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching Assignments to review:', error);
      }
    };
    
    getReviews();
  }, []);

  useEffect(() => {
    const getUsersAndGroups = async () => {
      try {
        const usersData = await fetchUsers();
        const groupsData = await fetchGroupList();
        setUsers(usersData);
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching users or groups:', error);
      }
    };

    getUsersAndGroups();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setAssignmentData({
      ...assignmentData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setAttachments([...attachments,...e.target.files]);
    // setAttachments([...e.target.files]);
  };

  const handleGroupSelect = async (group, type) => {
    try {
      const members = await fetchGroupMembers(group.id);
      if (type === 'reviewee') {
        setSelectedReviewees([...selectedReviewees, ...members]);
      } else {
        setSelectedReviewers([...selectedReviewers, ...members]);
      }
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  };

  const handleCreateAssignment = async () => {
    try {
        const assignment = await createAssignment({
            ...assignmentData,
            due_date: new Date(assignmentData.due_date).toISOString(),
            reviewee_list: selectedReviewees.map(user => user.id),
            reviewer_list: selectedReviewers.map(user => user.id)
        });

        for (const attachment of attachments) {
            await createAssignmentAttachment(assignment.assignment_id, attachment);
        }

        handleClose();
        // Optionally, refresh the list of reviews
    } catch (error) {
        console.error('Error creating assignment:', error);
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

  const getOptionLabel = (option) => {
    return option.username || option.name || '';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assignments to be Reviewed
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{ mb: 2 }}>
        Add Assignment
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Assignment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={assignmentData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={assignmentData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="due_date"
            label="Due Date"
            type="datetime-local"
            fullWidth
            variant="standard"
            value={assignmentData.due_date}
            onChange={handleChange}
          />
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => <TextField {...params} label="Select Reviewees" />}
            onChange={(event, value) => setSelectedReviewees(value)}
          />
          <Autocomplete
            multiple
            options={groups}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => <TextField {...params} label="Select Reviewee Groups" />}
            onChange={(event, value) => value.forEach(group => handleGroupSelect(group, 'reviewee'))}
          />
          <Autocomplete
            multiple
            options={users}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => <TextField {...params} label="Select Reviewers" />}
            onChange={(event, value) => setSelectedReviewers(value)}
          />
          <Autocomplete
            multiple
            options={groups}
            getOptionLabel={getOptionLabel}
            renderInput={(params) => <TextField {...params} label="Select Reviewer Groups" />}
            onChange={(event, value) => value.forEach(group => handleGroupSelect(group, 'reviewer'))}
          />
          <div>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="contained" component="span" sx={{ mt: 2 }}>
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
          {/* <input
            type="file"
            multiple
            onChange={handleFileChange}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreateAssignment}>Create</Button>
        </DialogActions>
      </Dialog>
      <Stack spacing={2}>
        {Reviews.map((Review) => (
          <Card 
            key={Review.id} 
            elevation={2}
            sx={{ 
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: 4,
                borderColor: 'primary.main'
              },
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'primary.main'
            }}
            onClick={() => navigate('/review/' + Review.id)}
          >
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {Review.name}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="info.main">
                  Created: {formatDate(Review.created_at)}
                </Typography>
                <Typography variant="body2" color="error.main">
                  Due: {formatDate(Review.due_date)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default ReviewList;