from django.shortcuts import render
from .models import Gifts

# Create your views here.
def gifts_list(request):
    gifts = Gifts.objects.all().values()
    context={'gifts':gifts}
    return render(request, 'base.html', context)