import { useState, useEffect } from 'react';
import { fetchReviews } from '../apiservice';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Stack,
  Box
} from '@mui/material';

const ReviewList = () => {
  const [Reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const data = await fetchReviews();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching Reviews:', error);
      }
    };
    
    getReviews();
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
        Assignments to be Reviewed
      </Typography>
      
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
      
            }}
            onClick={() => console.log('clicked')}
          >
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {Review.name}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
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