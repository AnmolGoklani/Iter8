import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGroupList } from '../apiservice';
import {
  Card,
  CardContent,
  Typography,
  Container,
  Stack,
} from '@mui/material';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getGroups = async () => {
      try {
        const data = await fetchGroupList();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching Groups:', error);
      }
    };
    
    getGroups();
  }, []);

  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Groups
      </Typography>
      
      <Stack spacing={2}>
        {groups.map((Group) => (
          <Card 
            key={Group.id} 
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
            onClick={() => navigate('/group/' + Group.id)}
          >
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {Group.name}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default GroupList;