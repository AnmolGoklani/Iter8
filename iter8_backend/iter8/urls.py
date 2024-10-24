from django.urls import path
from . import views
from . import auth

urlpatterns = [
    path("oauth/authorise/", auth.Authorize.as_view() , name="Authorise"),
    path("oauth/channeli/callback/", auth.GetToken.as_view(), name="Callback"),
    path("oauth/logout/", auth.Logout.as_view() , name="Logout"),
    path("auth/login/", auth.Login.as_view(), name="Login"),
    path("auth/logout/", auth.Logout.as_view(), name="Logout"),
    path("auth/signup/", auth.SignUp.as_view(), name="Signup"),
    path("assignments/", views.FetchAssignmentListReviewee.as_view(), name="FetchAssignmentListReviewee"),
    path("reviews/", views.FetchAssignmentListReviewer.as_view(), name="FetchAssignmentListReviewer"),
    path("assignmentinfo/", views.AssignmentInfo.as_view(), name="Assignment"),
    path("assignment/attachments/", views.Assignment_attachmentView.as_view(), name="AssignmentAttachment"),
    path("assignment/subtasks/", views.SubtaskList.as_view(), name="Subtask"),
    path("assignment/subtask/", views.SubtaskView.as_view(), name="SubtaskView"),
    path("iteration/comments/", views.CommentView.as_view(), name="Comment"),
    path("iteration/", views.IterationView.as_view(), name="Iteration"),
    path("iteration/attachments/", views.Iteration_attachmentView.as_view(), name="IterationAttachment"),
    path("fetch/reviewee_subtask/", views.FetchReviewee_subtaskList.as_view(), name="FetchRevieweeSubtask"),
    path("fetch/reviewee/" , views.FetchRevieweeList.as_view(), name="FetchRevieweeList"),

]