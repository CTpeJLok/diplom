from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from core import settings


def send_code(template, subject, email, code):
    context = {
        "domain": "web-dat.ru",
        "code": code,
    }

    email_from = settings.DEFAULT_FROM_EMAIL

    message = render_to_string(template, context=context)

    send_mail(subject, strip_tags(message), email_from, [email], html_message=message)


def send_email_activation_code(email, code):
    send_code(
        "email_manager/email_activation_code.html",
        "Подтверждение создания аккаунта",
        email,
        code,
    )


def send_email_password_recovery_code(email, code):
    send_code(
        "email_manager/password_recovery_code.html",
        "Восстановление пароля",
        email,
        code,
    )


def send_message(email, subject, message):
    email_from = settings.DEFAULT_FROM_EMAIL
    send_mail(subject, message, email_from, [email])
