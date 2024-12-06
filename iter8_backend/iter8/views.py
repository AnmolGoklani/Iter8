from django.shortcuts import render
from django.views import View
from django.http import JsonResponse, Http404
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Assignment, User, Assignment_attachment, Subtask, Comment, Reviewee_subtask, Iteration, Iteration_attachment, Group
from .serializers import AssignmentSerializer, SubtaskSerializer, CommentSerializer, IterationSerializer
import json


class FetchAssignmentListReviewee(View):
    def get(self, request):
        reviewee = request.user
        assignments = list(Assignment.objects.filter(reviewee=reviewee).values('id','name', 'created_at' , 'due_date'))
        return JsonResponse(assignments, safe=False)
    
class FetchAssignmentListReviewer(View):
    def get(self, request):
        reviewer = request.user
        assignments = list(Assignment.objects.filter(reviewer=reviewer).values('name', 'created_at' , 'due_date'))
        return JsonResponse(assignments, safe=False)
    


@method_decorator(csrf_exempt, name='dispatch')
class AssignmentInfo(View):
    def get(self, request):
        assignment_id = request.GET.get('assignment_id')
        assignment = list(Assignment.objects.filter(id=assignment_id).values())
        reviewers = list(Assignment.objects.get(id=assignment_id).reviewer.all().values('name', 'id'))
        assignment[0]['reviewers'] = reviewers
        return JsonResponse(assignment, safe=False)
    
    # this only accepts form data

    def post(self, request):
        data = request.POST
        reviewee_list_str = data.get('reviewee_list')
        reviewer_list_str = data.get('reviewer_list')

        # Parse the string representation of the lists into actual lists
        try:
            reviewee_list = json.loads(reviewee_list_str)
            reviewer_list = json.loads(reviewer_list_str)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format for reviewee_list or reviewer_list'}, status=400)

        # print(request.user.id)
        assignment_data = {
            'creator' : request.user.id,
            'name' : data.get('name'), # no quotes
            'description' : data.get('description'), # no quotes
            'due_date' : data.get('due_date'), # no quotes
        }
        serializer = AssignmentSerializer(data=assignment_data)
        if serializer.is_valid():
            assignment = serializer.save()
            # reviewee_list = data.getlist('reviewee_list', [])
            # reviewer_list = data.getlist('reviewer_list', [])
            
            # Ensure reviewee_list contains valid IDs
            if all(isinstance(reviewee, int) for reviewee in reviewee_list):
                assignment.reviewee.add(*reviewee_list)
            else:
                print(reviewee_list)
                return JsonResponse({'error': 'Invalid reviewee IDs'}, status=400)
            
            # Ensure reviewer_list contains valid IDs
            if all(isinstance(reviewer, int) for reviewer in reviewer_list):
                assignment.reviewer.add(*reviewer_list)
            else:
                return JsonResponse({'error': 'Invalid reviewer IDs'}, status=400)
            # assignment.reviewee.add(*reviewee_list)
            # assignment.reviewer.add(*reviewer_list)
            assignment.reviewer.add(request.user)
            return JsonResponse({'message': 'Assignment created successfully'}, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)
        
@method_decorator(csrf_exempt, name='dispatch')
class Assignment_attachmentView(View):
    def get(self, request):
        assignment_id = request.GET.get('assignment_id')
        try:
            assignment = Assignment.objects.get(id=assignment_id)
        except Assignment.DoesNotExist:
            raise JsonResponse({'error': 'Assignment not found'}, status=404)
        
        attachments = Assignment_attachment.objects.filter(assignment=assignment)
        attachment_urls = [request.build_absolute_uri(attachment.attachment.url) for attachment in attachments]

        return JsonResponse(attachment_urls, safe=False)
    
    def post(self, request):
        assignment_id = request.POST.get('assignment_id')
        try:
            assignment = Assignment.objects.get(id=assignment_id)
        except Assignment.DoesNotExist:
            raise JsonResponse({'error': 'Assignment not found'}, status=404)
        
        attachment = request.FILES.get('attachment')
        if attachment is None:
            return JsonResponse({'error': 'No attachment provided'}, status=400)
        
        attachment_instance = Assignment_attachment(assignment=assignment, attachment=attachment)
        attachment_instance.save()
        return JsonResponse({'message': 'Attachment uploaded successfully'}, status=201)
    
class SubtaskList(View):
    def get(self, request):
        assignment_id = request.GET.get('assignment_id')
        subtasks = list(Subtask.objects.filter(assignment=assignment_id).values('name', 'id', 'due_date'))
        return JsonResponse(subtasks, safe=False)
    
@method_decorator(csrf_exempt, name='dispatch')
class SubtaskView(View):
    def get(self, request):
        subtask_id = request.GET.get('subtask_id')
        subtask = Subtask.objects.filter(id=subtask_id).values()
        return JsonResponse(list(subtask), safe=False)
    
    def post(self, request):
        data = request.POST
        subtask_data = {
            'assignment' : data.get('assignment_id'),
            'name' : data.get('name'),
            'description' : data.get('description'),
            'due_date' : data.get('due_date'),
            'maxscore' : data.get('maxscore')
        }
        serializer = SubtaskSerializer(data=subtask_data)
        if serializer.is_valid():
            subtask = serializer.save()
            CreateRevieweeSubtask(request, subtask)
            return JsonResponse({'message': 'Subtask created successfully'}, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)
        
def CreateRevieweeSubtask(request, subtask):
    reviewee_list = list(subtask.assignment.reviewee.all())
    for reviewee in reviewee_list:
        reviewee_subtask = Reviewee_subtask(subtask=subtask, reviewee=reviewee)
        reviewee_subtask.save()

class fetchRevieweeSubtask(View):
    def get(self, request):
        reviewee = request.user
        subtask = request.GET.get('subtask_id')
        reviewee_subtask = list(Reviewee_subtask.objects.filter(reviewee=reviewee, subtask=subtask).values())
        return JsonResponse(reviewee_subtask, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class CommentView(View):
    def get(self, request):
        iteration_id = request.GET.get('iteration_id')
        comments = list(Comment.objects.filter(iteration=iteration_id).values('comment', 'reviewer'))
        return JsonResponse(comments, safe=False)
        
    def post(self,request):
        data = request.POST
        comment_data = {
            'iteration' : data.get('iteration_id'),
            'reviewer' : request.user.id,
            'comment' : data.get('comment')
        }
        serializer = CommentSerializer(data=comment_data)
        if serializer.is_valid():
            comment = serializer.save()
            comment.iteration.isReviewed = True
            return JsonResponse({'message': 'Comment added successfully'}, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)
        
@method_decorator(csrf_exempt, name='dispatch')
class IterationView(View):
    def get(self, request):
        reviewee_subtask_id = request.GET.get('reviewee_subtask_id')
        iterations = list(Iteration.objects.filter(reviewee_subtask=reviewee_subtask_id).values())
        return JsonResponse(iterations, safe=False)
    
    def post(self, request):
        data = request.POST
        iteration_data = {
            'reviewee_subtask' : data.get('reviewee_subtask_id'),
            'remark' : data.get('remark'),
        }
        serializer = IterationSerializer(data=iteration_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Iteration created successfully'}, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)


# i need reviewee_subtask_ids of reviewee_subtask.reviewee = request.get('reviewee') and reviewee_subtask.subtask.assignment = request.get('assignment')
class FetchReviewee_subtaskList(View):
    def get(self, request):
        reviewee = request.GET.get('reviewee')
        assignment = request.GET.get('assignment')
        reviewee_subtasks = list(Reviewee_subtask.objects.filter(reviewee=reviewee, subtask__assignment=assignment).values())
        return JsonResponse(reviewee_subtasks, safe=False)


# when a reviewee opens the assignment page call this along with the fetch subtask list so that we can know which subtasks are completed  
class FetchUser_subtaskList(View):
    def get(self, request):
        reviewee = request.user
        assignment = request.GET.get('assignment_id')
        reviewee_subtasks = list(Reviewee_subtask.objects.filter(reviewee=reviewee, subtask__assignment=assignment).values())
        return JsonResponse(reviewee_subtasks, safe=False)
    
# get gives list of attachments of an iteration
# post uploads an attachment for an iteration
@method_decorator(csrf_exempt, name='dispatch')
class Iteration_attachmentView(View):
    def get(self, request):
        iteration_id = request.GET.get('iteration_id')
        attachments = Iteration_attachment.objects.filter(iteration=iteration_id)
        attachment_urls = [request.build_absolute_uri(attachment.attachment.url) for attachment in attachments]
        return JsonResponse({'attachments': attachment_urls}, safe=False)
    
    def post(self, request):
        iteration_id = request.POST.get('iteration_id')
        iteration = Iteration.objects.get(id=iteration_id)
        attachment = request.FILES.get('attachment')
        if attachment is None:
            return JsonResponse({'error': 'No attachment provided'}, status=400)
        
        attachment_instance = Iteration_attachment(iteration=iteration, attachment=attachment)
        attachment_instance.save()
        return JsonResponse({'message': 'Attachment uploaded successfully'}, status=201)

# fetch reviewees of an assignment
class FetchRevieweeList(View):
    def get(self, request):
        assignment_id = request.GET.get('assignment_id')
        reviewee_list = list(Assignment.objects.get(id=assignment_id).reviewee.all().values('name', 'id'))
        return JsonResponse(reviewee_list, safe=False)
    

class FetchGroupList(View):
    def get(self, request):
        groups = list(Group.objects.all().values('name', 'id'))
        return JsonResponse(groups, safe=False)
    
class FetchGroupMembers(View):
    def get(self, request):
        group_id = request.GET.get('group_id')
        members = list(Group.objects.get(id=group_id).members.all().values('name', 'id'))
        return JsonResponse(members, safe=False)