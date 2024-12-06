import {createBrowserRouter} from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AssignmentList from './components/AssignmentList';
import ReviewList from './components/ReviewList';
import AssignmentPage from './components/AssignmentPage';
import Dashboard from './components/Dashboard';
import GroupList from './components/GroupList';
import GroupPage from './components/GroupPage';
import SubtaskPage from './components/SubtaskPage';

const router = createBrowserRouter([
    
    {
        path: '/',
        element: <LoginPage />
    },
    {
        path: '/signup',
        element: <SignupPage />
    },
    {
        path: '/assignments',
        element: <AssignmentList />
    },
    {
        path: '/reviews',
        element: <ReviewList />
    },
    {
        path: '/assignment/:assignmentId',  
        element: <AssignmentPage />
    },
    {
        path: '/dashboard',
        element: <Dashboard />
    },
    {
        path: '/groups',
        element: <GroupList />
    },
    {
        path: '/group/:groupId',
        element: <GroupPage />
    },
    {
        path: '/subtask/:subtaskId',
        element: <SubtaskPage />
    }



]);


export default router;