from .models import User, Assignment, Assignment_attachment, Subtask, Reviewee_subtask, Iteration, Iteration_attachment, Comment, Group
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

class Assignment_attachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment_attachment
        fields = '__all__'

class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = '__all__'

class Reviewee_subtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reviewee_subtask
        fields = '__all__'

class IterationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Iteration
        fields = '__all__'

class Iteration_attachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Iteration_attachment
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

