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
import SubmitPage from './components/SubmitPage';
import ReviewPage from './components/ReviewPage';
import RevieweeAssignmentPage from './components/RevieweeAssignmentPage';

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
        path: 'review/:assignmentId',
        element: <ReviewPage />
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
    },
    {
        path: '/submitIteration/:revieweeSubtaskId',
        element: <SubmitPage />
    },
    {
        path: '/revieweeAssignment/:revieweeId',
    },
    {
        path: '/revieweeAssignment/:revieweeId/:assignmentId',
        element: <RevieweeAssignmentPage />
    }

]);


export default router;