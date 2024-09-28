from django.contrib import admin
from .models import User, group ,  Assignment, Assignment_attachment, Subtask, Reviewee_subtask, Iteration, Iteration_attachment, comment
# Register your models here.
admin.site.register(User)
admin.site.register(Assignment)
admin.site.register(Assignment_attachment)
admin.site.register(Subtask)
admin.site.register(Reviewee_subtask)
admin.site.register(Iteration)
admin.site.register(Iteration_attachment)
admin.site.register(comment)
admin.site.register(group)


