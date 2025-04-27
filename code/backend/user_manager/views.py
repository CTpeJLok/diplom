from typing import Dict, Type

from confirm_manager.models import Code, CodeEmail, CodeRecovery
from django.contrib.auth.hashers import check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db.models import QuerySet
from django.utils import timezone
from email_manager.main import (
    send_email_activation_code,
    send_email_password_recovery_code,
)
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken
from user_manager.models import CustomUser

CODE_TYPE_ACTIVATE = "email_activate"
CODE_TYPE_RECOVERY = "password_recovery"

CODE_TYPES: dict[str, Type[Code]] = {
    CODE_TYPE_ACTIVATE: CodeEmail,
    CODE_TYPE_RECOVERY: CodeRecovery,
}


def get_tokens(user: CustomUser | None = None) -> Dict[str, str] | None:
    token: RefreshToken = RefreshToken.for_user(user)  # type: ignore

    if not token:
        return

    return {
        "refresh": str(token),
        "access": str(token.access_token),
    }


@api_view(["POST"])
def login(request) -> Response:
    email = request.data.get("email")
    password = request.data.get("password")
    if not email or not password:
        return Response(
            {"detail": "Missing email or password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user: CustomUser | None = CustomUser.objects.filter(
        username=email,
    ).first()
    if not user or not check_password(password, user.password):
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not user.is_verified:
        return Response(
            {"detail": "User is not verified"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    tokens = get_tokens(user)

    user.last_login = timezone.now()
    user.save()

    return Response(
        {
            "tokens": tokens,
            "userInfo": {
                "email": user.username,
                "action": "login",
            },
        },
    )


@api_view(["POST"])
def register(request) -> Response:
    email = request.data.get("email")
    password = request.data.get("password")
    if not email or not password:
        return Response(
            {"detail": "Missing email or password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        validate_password(password)
    except ValidationError:
        return Response(
            {"detail": "Invalid password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    old_user: CustomUser | None = CustomUser.objects.filter(username=email).first()
    if old_user:
        if old_user.is_verified:
            return Response(
                {"detail": "User already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        old_user.delete()

    user: CustomUser = CustomUser.objects.create_user(username=email, password=password)

    code: CodeEmail = CodeEmail.objects.create(user=user)
    send_email_activation_code(
        user.username,
        code.code,
    )

    return Response(
        {
            "userInfo": {
                "email": user.username,
                "action": "register",
            },
        },
    )


@api_view(["POST"])
def refresh(request) -> Response:
    refresh = request.data.get("refresh")
    if not refresh:
        return Response(
            {"detail": "Missing refresh token"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        token = RefreshToken(refresh)
        out_token: OutstandingToken = OutstandingToken.objects.get(token=token)

        user: CustomUser = CustomUser.objects.get(username=token["username"])
        token.blacklist()

        return Response(
            {
                "tokens": get_tokens(user),
                "userInfo": {
                    "email": user.username,
                    "action": "refresh",
                },
            }
        )
    except Exception as e:
        return Response(
            {"detail": "Invalid refresh token"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request) -> Response:
    refresh = request.data.get("refresh")
    if not refresh:
        return Response(
            {"detail": "Missing refresh token"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        token = RefreshToken(refresh)
        out_token: OutstandingToken = OutstandingToken.objects.get(token=token)

        user: CustomUser = CustomUser.objects.get(username=token["username"])
        token.blacklist()

        return Response()
    except Exception as e:
        return Response(
            {"detail": "Invalid refresh token"},
            status=status.HTTP_400_BAD_REQUEST,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def request_recovery(request) -> Response:
    email = request.data.get("email")
    if not email:
        return Response(
            {"detail": "Missing email"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user: CustomUser | None = CustomUser.objects.filter(username=email).first()
    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    code: CodeRecovery = CodeRecovery.objects.create(user=user)
    send_email_password_recovery_code(
        user.username,
        code.code,
    )

    return Response(
        {
            "userInfo": {
                "email": user.username,
                "action": "request_recovery",
            },
        },
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def check_code(request) -> Response:
    email = request.data.get("email")
    code = request.data.get("code")
    type = request.data.get("type")
    if not email or not code or not type or type not in CODE_TYPES:
        return Response(
            {"detail": "Missing email, code or type"},
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

    user: CustomUser | None = CustomUser.objects.filter(username=email).first()
    if not user:
        return Response(
            {"detail": "User not found"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    model = CODE_TYPES[type]

    codes: QuerySet[Code] = model.objects.filter(user=user, is_active=True)

    code_db: Code | None = codes.last()
    if not code_db or code_db.code != code:
        return Response(
            {"detail": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    for code in codes:
        code.is_active = False
    model.objects.bulk_update(codes, ["is_active"])

    result = {}
    if type == CODE_TYPE_ACTIVATE:
        user.is_verified = True
        user.last_login = timezone.now()
        user.save()

        result = {
            "tokens": get_tokens(user),
            "userInfo": {
                "email": user.username,
                "action": "activate",
            },
        }
    elif type == CODE_TYPE_RECOVERY:
        user.set_password(password)
        user.save()

    return Response(result)
