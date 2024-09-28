from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    user_score = models.IntegerField(default=0)
    
class Assignment(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    reviewer = models.ManyToManyField(User, related_name='reviewer_assignments')
    reviewee = models.ManyToManyField(User, related_name='reviewee_assignments')
    name = models.CharField(max_length=100)
    description = models.TextField()
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Assignment_attachment(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    attachment = models.FileField(upload_to='assignment_attachments/')

    def __str__(self):
        return self.assignment.name + ' - ' + self.attachment.name
    
class Subtask(models.Model):
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()
    due_date = models.DateTimeField()
    maxscore = models.IntegerField(default=10)

    def __str__(self):
        return self.name
    
class Reviewee_subtask(models.Model):
    subtask = models.ForeignKey(Subtask, on_delete=models.CASCADE)
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE)
    isCompleted = models.BooleanField(default=False)

    def __str__(self):
        return self.subtask.name + ' - ' + self.reviewee.username
    
class Iteration(models.Model):
    subtask = models.ForeignKey(Reviewee_subtask, on_delete=models.CASCADE)
    date_submitted = models.DateTimeField(auto_now_add=True)
    remarks = models.TextField()
    isReviewed = models.BooleanField(default=False)

    def __str__(self):
        return self.subtask.subtask.name + ' - ' + self.subtask.reviewee.username

class Iteration_attachment(models.Model):
    iteration = models.ForeignKey(Iteration, on_delete=models.CASCADE)
    attachment = models.FileField(upload_to='iteration_attachments/')

    def __str__(self):
        return self.iteration.subtask.subtask.name + ' - ' + self.iteration.subtask.reviewee.username + ' - ' + self.attachment.name
    
class comment(models.Model):
    iteration = models.ForeignKey(Iteration, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()

    def __str__(self):
        return self.iteration.subtask.subtask.name + ' - ' + self.iteration.subtask.reviewee.username + ' - ' + self.reviewer.username

class group(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, related_name='group_members')

    def __str__(self):
        return self.name
