from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from ..serializers import ChangePasswordSerializer


class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        user = request.user

        if serializer.is_valid():
            if serializer.validated_data['new_password'] != serializer.validated_data['confirm_password']:
                return Response({"error": "Passwords don't match"}, status=status.HTTP_400_BAD_REQUEST)

            if not user.check_password(serializer.validated_data['current_password']):
                return Response({"error": "Password Incorrect."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password changed successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
