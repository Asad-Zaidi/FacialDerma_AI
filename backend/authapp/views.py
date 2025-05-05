from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser
from .serializers import UserProfileSerializer
import numpy as np
from PIL import Image
import os
from django.conf import settings
from tensorflow.keras.models import load_model


@api_view(['POST'])
def signup_view(request):
    data = request.data
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    age = data.get('age')
    gender = data.get('gender')
    
    if CustomUser.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    if CustomUser.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = CustomUser.objects.create_user(
        username=username,
        email=email,
        password=password,
        age=age,
        gender=gender
    )

    return Response({'message': 'Signup successful!'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_view(request):
    data = request.data
    identifier = data.get('identifier')  
    password = data.get('password')

    
    try:
        user_obj = CustomUser.objects.get(email=identifier)
        username = user_obj.username
    except CustomUser.objects.model.DoesNotExist:
        username = identifier

    
    user = authenticate(request, username=username, password=password)

    if user is not None:
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        return Response({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'message': 'Login successful!',
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def logout_view(request):
    try:
        
        token = request.data.get('refresh_token')
        if token:
            token_obj = RefreshToken(token)
            token_obj.blacklist()
            return Response({'message': 'Logout successful!'}, status=status.HTTP_205_RESET_CONTENT)
        else:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
def update_profile_view(request):
    user = request.user
    serializer = UserProfileSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


labels_map = {0: "Acne", 1: "Melanoma", 2: "Normal", 3: "Perioral_Dermatitis", 4: "Rosacea", 5: "Warts"}

def preprocess_image(img):
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# The code snippet you provided defines a view function named `analyze_view` in a Django REST
# framework API. Here's what the code does:
# @api_view(['POST'])
# @csrf_exempt
# def analyze_view(request):
    try:
        if 'image' not in request.FILES:
            return Response({'error': 'No image uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['image']
        img = Image.open(file).convert('RGB')
        processed_img = preprocess_image(img)

        model_path = os.path.join(settings.BASE_DIR, 'authapp', 'model', 'ResNet_Model.keras')
        model = load_model(model_path)

        prediction = model.predict(processed_img)
        predicted_class = np.argmax(prediction)
        predicted_label = labels_map.get(predicted_class, "Unknown")
        confidence = float(np.max(prediction))

        return Response({
            'predicted_label': predicted_label,
            'confidence': confidence
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@csrf_exempt
def analyze_view(request):
    try:
        # Check if 'image' exists in the request files
        if 'image' not in request.FILES:
            print("No image found in request files")  # Debugging log
            return Response({'error': 'No image uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the uploaded image
        file = request.FILES['image']
        print(f"Received image: {file.name}")  # Debugging log
        
        # Open and preprocess the image
        img = Image.open(file).convert('RGB')
        processed_img = preprocess_image(img)

        # Load the model from the directory
        model_path = os.path.join(settings.BASE_DIR, 'authapp', 'model', 'ResNet_Model.keras')
        model = load_model(model_path)

        # Predict the image
        prediction = model.predict(processed_img)
        predicted_class = np.argmax(prediction)
        predicted_label = labels_map.get(predicted_class, "Unknown")
        confidence = float(np.max(prediction))

        # Return the prediction results
        return Response({
            'predicted_label': predicted_label,
            'confidence': confidence
        }, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {e}")  # Debugging log
        # Handle any unexpected errors
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
