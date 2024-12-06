import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAssignments } from '../apiservice';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Stack,
  Box
} from '@mui/material';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAssignments = async () => {
      try {
        const data = await fetchAssignments();
        setAssignments(data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };
    
    getAssignments();
  }, []);

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assignments
      </Typography>
      
      <Stack spacing={2}>
        {assignments.map((assignment) => (
          <Card 
            key={assignment.id} 
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
              borderColor: 'text.secondary'
      
            }}
            onClick={() => navigate('/assignment/' + assignment.id)}
          >
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {assignment.name}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Created: {formatDate(assignment.created_at)}
                </Typography>
                <Typography variant="body2" color="error.main">
                  Due: {formatDate(assignment.due_date)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default AssignmentList;