from core import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_code(template, subject, email, **kwargs):
    context = {
        "domain": "diplom.by-byte.ru",
        **kwargs,
    }

    email_from = settings.DEFAULT_FROM_EMAIL

    message = render_to_string(template, context=context)

    send_mail(subject, strip_tags(message), email_from, [email], html_message=message)


def send_email_activation_code(email, code):
    send_code(
        "email_manager/email_activation_code.html",
        "Подтверждение создания аккаунта",
        email,
        code=code,
    )


def send_email_password_recovery_code(email, code):
    send_code(
        "email_manager/password_recovery_code.html",
        "Восстановление пароля",
        email,
        code=code,
    )


def send_email_invite_code(email, project_name, project_id, code):
    send_code(
        "email_manager/invite_code.html",
        "Приглашение в проект",
        email,
        code=code,
        project_id=project_id,
        project_name=project_name,
    )


def send_message(email, subject, message):
    email_from = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, email_from, [email])
