from typing import Dict

from django.utils import timezone
from django.contrib.auth.hashers import check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.token_blacklist.models import (
    OutstandingToken,
)

from email_manager.main import (
    send_email_activation_code,
    send_email_password_recovery_code,
)

from user_manager.models import CustomUser
from confirm_manager.models import CodeEmail, CodeRecovery

CODE_TYPE_ACTIVATE = "email_activate"
CODE_TYPE_RECOVERY = "password_recovery"

CODE_TYPES = {
    CODE_TYPE_ACTIVATE: CodeEmail,
    CODE_TYPE_RECOVERY: CodeRecovery,
}


def get_tokens(
    user: CustomUser | None = None,
    token: RefreshToken | None = None,
) -> Dict[str, str] | None:
    tokens = None
    if user:
        tokens = RefreshToken.for_user(user)
    elif token:
        tokens = token

    if not tokens:
        return

    return {
        "refresh": str(tokens),
        "access": str(tokens.access_token),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request) -> Response:
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not username:
        return Response(
            {"detail": "Missing username or username"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = CustomUser.objects.filter(
        username=username,
    ).first()
    if not user or not check_password(password, user.password):
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not user.is_active:
        return Response(
            {"detail": "User is not active"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    tokens = get_tokens(user)

    user.last_login = timezone.now()
    user.save()

    return Response(
        {
            "tokens": tokens,
            "userInfo": {
                "username": user.username,
                "action": "login",
            },
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request) -> Response:
    username = request.data.get("username")
    password = request.data.get("password")
    if not username or not password:
        return Response(
            {"detail": "Missing username or password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = CustomUser.objects.filter(username=username).first()
    if user:
        if user.is_active:
            return Response(
                {"detail": "User already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.delete()

    try:
        validate_password(password)
    except ValidationError:
        return Response(
            {"detail": "Invalid password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = CustomUser.objects.create_user(username=username, password=password)

    code = CodeEmail.objects.create(user=user)
    send_email_activation_code(
        user.username,
        code.code,
    )

    return Response(
        {
            "userInfo": {
                "username": user.username,
                "action": "register",
            },
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def refresh(request):
    refresh = request.data.get("refresh")
    if not refresh:
        return Response(
            {"detail": "Missing refresh token"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        token = RefreshToken(refresh)
        OutstandingToken.objects.get(token=token)

        user: CustomUser = CustomUser.objects.get(username=token["username"])
        token.blacklist()

        return Response(
            {
                "tokens": get_tokens(user),
                "userInfo": {
                    "username": user.username,
                    "action": "refresh",
                },
            },
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"detail": "Invalid refresh token"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request):
    refresh = request.data.get("refresh")
    if not refresh:
        return Response(
            {"detail": "Missing refresh token"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        token = RefreshToken(refresh)
        token.blacklist()

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"detail": "Invalid refresh token"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def request_recovery(request) -> Response:
    username = request.data.get("username")
    if not username:
        return Response(
            {"detail": "Missing username"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = CustomUser.objects.filter(username=username).first()
    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    code = CodeRecovery.objects.create(user=user)
    send_email_password_recovery_code(
        user.username,
        code.code,
    )

    return Response(
        {
            "userInfo": {
                "username": user.username,
                "action": "request_recovery",
            },
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def check_code(request) -> Response:
    username = request.data.get("username")
    code = request.data.get("code")
    type = request.data.get("type")
    if not username or not code or not type or type not in CODE_TYPES:
        return Response(
            {"detail": "Missing username, code or type"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if type == CODE_TYPE_RECOVERY:
        password = request.data.get("password")
        if not password:
            return Response(
                {"detail": "Missing password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(password)
        except ValidationError:
            return Response(
                {"detail": "Invalid password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    user = CustomUser.objects.filter(username=username).first()
    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    model = CODE_TYPES[type]

    codes = model.objects.filter(user=user, is_active=True)

    code_db = codes.last()
    if not code_db or code_db.code != code:
        return Responses.invalid_credentials()

    codes = codes.all()
    for code in codes:
        code.is_active = False
    model.objects.bulk_update(codes, ["is_active"])

    result = {}
    if type == CODE_TYPE_ACTIVATE:
        user.is_active = True
        user.last_login = timezone.now()
        user.save()

        result = {
            "tokens": get_tokens(user),
            "userInfo": {
                "username": user.username,
                "action": "activate",
            },
        }
    elif type == CODE_TYPE_RECOVERY:
        user.set_password(password)
        user.save()

    return Response(result, status=status.HTTP_200_OK)
