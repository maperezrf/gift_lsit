from django.db import models

class Gifts(models.Model):
    name = models.CharField(max_length=60, null=False, blank=False)
    status = models.BooleanField(default=False)
    guest_name = models.CharField(max_length=60, null=True, blank=True)
    image_name = models.CharField(max_length=20, null=True, blank=True)
