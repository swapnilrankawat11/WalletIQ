from django.urls import path
from .views import SignUpAPIView, LoginAPIView, UserProfileView, ChangePasswordAPIView, LogoutAPIView


urlpatterns = [
    path('login/', LoginAPIView.as_view(), name="login"),
    path('signup/', SignUpAPIView.as_view(), name="signup"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
    path('changeUserProfilePassword/',
         ChangePasswordAPIView.as_view(), name="change-password"),
    path('logout/', LogoutAPIView.as_view(), name="logout"),
]
