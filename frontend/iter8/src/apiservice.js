import axios from 'axios';

const API_URL = 'http://localhost:8000/iter8/';
const OAUTH_URL = 'http://localhost:8000/iter8/oauth/authorise/';

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

export const handleChanneliClick = async () => {
	window.location.href = OAUTH_URL;
};

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

export const fetchRevieweeSubtask = async (subtask_id, reviewee_id) => {
    try {
        const response = await axios.get(API_URL + 'reviewee_subtask/?subtask_id=' + subtask_id + '&reviewee_id=' + reviewee_id);
        return response.data;
    } catch (error) {
        console.error('Error fetching reviewee subtask:', error);
        throw error;
    }
}

export const fetchUserRevieweeSubtask = async (id) => {
    try {
        const response = await axios.get(API_URL + 'user_reviewee_subtask/?subtask_id=' + id);
        return response.data;
    } catch (error) {
        console.error('Error fetching user reviewee subtask:', error);
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

export const createIteration = async (reviewee_subtask_id, remark) => {
    try {
        const response = await axios.post(API_URL + 'iteration/', {
            reviewee_subtask_id,
            remark
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating iteration:', error);
        throw error;
    }
}


export const createIterationAttachment = async (iteration_id, attachment) => {
    try {
        const formData = new FormData();
        formData.append('iteration_id', iteration_id);
        formData.append('attachment', attachment);

        const response = await axios.post(API_URL + 'iteration/attachments/', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating iteration attachment:', error);
        throw error;
    }
}


export const createAssignmentAttachment = async (assignment_id, attachment) => {
    try {
        const formData = new FormData();
        formData.append('assignment_id', assignment_id);
        formData.append('attachment', attachment);

        const response = await axios.post(API_URL + 'assignment/attachments/', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating assignment attachment:', error);
        throw error;
    }
}


export const createAssignment = async (assignmentData) => {
    try {
        const formData = new FormData();
        formData.append('name', assignmentData.name);
        formData.append('description', assignmentData.description);
        formData.append('due_date', assignmentData.due_date);
        formData.append('reviewee_list', JSON.stringify(assignmentData.reviewee_list));
        formData.append('reviewer_list', JSON.stringify(assignmentData.reviewer_list));

        const response = await axios.post(API_URL + 'assignmentinfo/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error creating assignment:', error.response.data);
        } else {
            console.error('Error creating assignment:', error.message);
        }
        throw error;
    }
}

export const fetchUsers = async () => {
    try {
        const response = await axios.get(API_URL + 'users/');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export const createSubtask = async (subtaskData) => {
    try {
        const formData = new FormData();
        formData.append('name', subtaskData.name);
        formData.append('description', subtaskData.description);
        formData.append('due_date', subtaskData.due_date);
        formData.append('assignment_id', subtaskData.assignment_id);
        formData.append('maxscore', subtaskData.maxscore);

        const response = await axios.post(API_URL + 'assignment/subtask/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating subtask:', error);
        throw error;
    }
}

export const changeRevieweeSubtaskStatus = async (reviewee_subtask_id, status) => {
    try {
        const response = await axios.post(API_URL + 'change_status/', {
            reviewee_subtask_id,
            status
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error changing reviewee subtask status:', error);
        throw error;
    }
}

export const createComment = async (iteration_id, comment) => {
    try {
        const response = await axios.post(API_URL + 'iteration/comments/', {
            iteration_id,
            comment
        },
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
}