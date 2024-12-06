import axios from 'axios';

const API_URL = 'http://localhost:8000/iter8/';

axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
export const Login = async (username, password) => {
    try {
        const response = await axios.post(API_URL + 'auth/login/', {
            username,
            password
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const Logout = async () => {
    try {
        const response = await axios.post(API_URL + 'auth/logout/');
        return response.data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}





export const Signup = async (name, username, email, password) => {
    try {
        const response = await axios.post(API_URL + 'auth/signup/', {
            name,
            username,
            email,
            password
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const fetchAssignments = async () => {
    try {
        const response = await axios.get(API_URL + 'assignments/');
        return response.data;
    } catch (error) {
        console.error('Error fetching assignments:', error);
        throw error;
    }
};

export const fetchReviews = async () => {
    try {
        const response = await axios.get(API_URL + 'reviews/');
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

export const fetchAssignment = async (id) => {
    try {
        const response = await axios.get(API_URL + 'assignmentinfo/?assignment_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching assignment:', error);
        throw error;
    }
};

export const fetchAssignmentAttachments = async (id) => {
    try {
        const response = await axios.get(API_URL + 'assignment/attachments/?assignment_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching assignment attachment:', error);
        throw error;
    }
}

export const fetchAssignmentSubtaskList = async (id) => {  
    try {
        const response = await axios.get(API_URL + 'assignment/subtasks/?assignment_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching assignment subtasks:', error);
        throw error;
    }
}

export const fetchRevieweeSubtaskList = async (id) => {
    try {
        const response = await axios.get(API_URL + 'fetch/user_subtask/?assignment_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching reviewee subtasks:', error);
        throw error;
    }
}

export const fetchRevieweeSubtask = async (id) => {
    try {
        const response = await axios.get(API_URL + 'reviewee_subtask/?subtask_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching reviewee subtask:', error);
        throw error;
    }
}

export const fetchGroupList = async () => {
    try {
        const response = await axios.get(API_URL + 'groups/');
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error;
    }
}

export const fetchGroupMembers = async (id) => {
    try {
        const response = await axios.get(API_URL + 'group/members/?group_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching group members:', error);
        throw error;
    }
}

export const fetchSubtask = async (id) => {
    try {
        const response = await axios.get(API_URL + 'assignment/subtask/?subtask_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching subtask:', error);
        throw error;
    }
}

export const fetchIterationList = async (id) => {
    try {
        const response = await axios.get(API_URL + 'iteration/?reviewee_subtask_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching iterations:', error);
        throw error;
    }
}

export const fetchIterationAttachment = async (id) => {
    try {
        const response = await axios.get(API_URL + 'iteration/attachments/?iteration_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching iteration attachments:', error);
        throw error;
    }
}

export const fetchIterationComments = async (id) => {
    try {
        const response = await axios.get(API_URL + 'iteration/comments/?iteration_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching iteration comments:', error);
        throw error;
    }
}