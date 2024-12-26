import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupMembers } from '../apiservice';
import { Container, Typography, Card, CardContent, List, ListItem, ListItemText, CircularProgress, Alert} from '@mui/material';

const GroupPage = () => {
    const { groupId } = useParams();
    const [groupmembers, setGroupMembers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadGroupMembers = async () => {
            try {
                const groupData = await fetchGroupMembers(groupId);
                setGroupMembers(groupData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadGroupMembers();
    }, [groupId]);

    if (loading) return <CircularProgress color="primary" />;
    if (error) return <Alert severity="error">Error loading group details: {error.message}</Alert>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom color="text.primary">
                Group Members
            </Typography>
            <Card sx={{ backgroundColor: 'background.paper', border: '1px solid', borderColor: 'text.secondary' }}>
                <CardContent>
                    <List>
                        {groupmembers.map((groupmember) => (
                            <ListItem key={groupmember.id}>
                                <ListItemText
                                    primary={groupmember.name}
                                    primaryTypographyProps={{ color: 'text.primary' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Container>
    );
};

export default GroupPage;