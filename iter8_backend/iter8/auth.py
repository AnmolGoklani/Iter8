from django.shortcuts import redirect
from django.views import View
import requests
from iter8_backend.settings import client_id, client_secret
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from django.utils.decorators import method_decorator

redirect_uri = "http://localhost:8000/iter8/oauth/channeli/callback/"
authorisation_url = "https://channeli.in/oauth/authorise/"
token_url = "https://channeli.in/open_auth/token/"
get_user_data_url = "https://channeli.in/open_auth/get_user_data/"
logout_url = "https://channeli.in/open_auth/revoke_token/"

class Authorize(View):
    def get(self, request):
        return redirect(f"{authorisation_url}?client_id={client_id}&redirect_uri={redirect_uri}&state=random_string")
        
    

class GetToken(View):
    def get(self, request):
        code = request.GET.get("code")
        state = request.GET.get("state")

        data = {
            "client_id": client_id,
            "client_secret": client_secret,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri,
            "code": code,
        }

        response = requests.post(token_url, data=data)

        if response.status_code != 200:
            return JsonResponse({"error": "response not found"}, status=400)

        token_data = response.json()
        # print(token_data)
        access_token = token_data.get('access_token')
        refresh_token = token_data.get('refresh_token')
		
        user_info = requests.get(get_user_data_url, headers = {'Authorization': f'Bearer {access_token}'})
        user_data = user_info.json()
        print(user_data)

        PersonalEmail = user_data["contactInformation"]["emailAddress"]
        InstituteEmail = user_data["contactInformation"]["instituteWebmailAddress"]
		
        mails = {
			'PersonalEmail': PersonalEmail,
			'InstituteEmail': InstituteEmail
		}

        user_list = User.objects.filter(email = InstituteEmail)
        user_list2 = User.objects.filter(email = PersonalEmail)

        if user_list:
            user = user_list[0]
            login(request, user)
            return redirect('http://localhost:5173/dashboard/')
        
        elif user_list2:
            user = user_list2[0]
            login(request, user)
            return redirect('http://localhost:5173/dashboard/')

        return redirect("http://localhost:5173/")

        
    
class OAuthLogout(View):
    def get(self, request):
        params = {
            "client_id": client_id,
            "client_secret": client_secret,
            "token": request.GET.get("token"),
            "token_type_hint" : request.GET.get("token_type_hint")
        }
        response = requests.post(logout_url, data=params)

@method_decorator(csrf_exempt, name='dispatch')
class Login(View):
    def post(self, request):
        user = authenticate(username=request.POST.get("username"), password=request.POST.get("password"))
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "login successful"})
        else:
            return JsonResponse({"message": "login failed"}, status=400)
        
@method_decorator(csrf_exempt, name='dispatch')
class Logout(View):
    def post(self, request):
        logout(request)
        return JsonResponse({"message": "logout successful"})
    
@method_decorator(csrf_exempt, name='dispatch')
class SignUp(View):
    def post(self, request):
        name = request.POST.get("name")
        username = request.POST.get("username")
        password = request.POST.get("password")
        email = request.POST.get("email")
        # print(name, username, password, email)
        user = User.objects.filter(username=username).first()
        if user is not None:
            return JsonResponse({"message": "user already exists"}, status=400)
        else:
            user = User.objects.create_user(username=username, password=password, email=email, name=name)

        user = User.objects.filter(username=username).first()
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "signup successful"})
        else:
            return JsonResponse({"message": "signup failed"}, status=400)

