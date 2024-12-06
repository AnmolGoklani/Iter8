from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    name = models.CharField(max_length=100,blank=True)
    user_score = models.IntegerField(default=0)

    def  __str__(self):
        return str(self.id) + self.name
    
class Assignment(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    reviewer = models.ManyToManyField(User, related_name='reviewer_assignments', blank = True, null = True)
    reviewee = models.ManyToManyField(User, related_name='reviewee_assignments', blank = True, null = True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id) + '-' + self.name
    
class Assignment_attachment(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    def assignment_directory_path(instance, filename):
        return 'assignment_attachment/assignment_{0}/{1}'.format(instance.assignment.id, filename)

    attachment = models.FileField(upload_to=assignment_directory_path)

    def __str__(self):
        return self.assignment.name + ' - ' + self.attachment.name
    
class Subtask(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    due_date = models.DateTimeField()
    maxscore = models.IntegerField(default=10)

    def __str__(self):
        return str(self.id) + '-' + self.name
    
class Reviewee_subtask(models.Model):
    subtask = models.ForeignKey(Subtask, on_delete=models.CASCADE)
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE)
    isCompleted = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id) + '-' + self.subtask.name + ' - ' + self.reviewee.username
    
class Iteration(models.Model):
    reviewee_subtask = models.ForeignKey(Reviewee_subtask, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(auto_now_add=True)
    remark = models.TextField()
    isReviewed = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id) + '-' + self.reviewee_subtask.subtask.name

class Iteration_attachment(models.Model):
    iteration = models.ForeignKey(Iteration, on_delete=models.CASCADE)
    def iteration_directory_path(instance, filename):
        return 'iteration_attachment/iteration_{0}/{1}'.format(instance.iteration.id, filename)

    attachment = models.FileField(upload_to=iteration_directory_path)

    def __str__(self):
        return self.iteration.reviewee_subtask.subtask.name + ' - ' + self.iteration.reviewee_subtask.reviewee.username + ' - ' + self.attachment.name
    
class Comment(models.Model):
    iteration = models.ForeignKey(Iteration, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()

    def __str__(self):
        return self.iteration.reviewee_subtask.subtask.name + ' - ' + self.iteration.reviewee_subtask.reviewee.username + ' - ' + self.reviewer.username

class Group(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name='group_members')

    def __str__(self):
        return self.name
