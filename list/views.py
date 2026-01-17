from django.shortcuts import render
import json
from .models import Gifts
from django.http import JsonResponse


# Create your views here.
def gifts_list(request):
    if request.method == 'GET':
        gifts_to_reserve = Gifts.objects.filter(status=False).values()
        reserved_gifts = Gifts.objects.filter(status=True).values()
        context = {"gifts_to_reserve": gifts_to_reserve,'reserved_gifts':reserved_gifts}
        return render(request, "base.html", context)
    elif request.method == 'POST':
        try:
            data = {}
            data = json.loads(request.body)
            gift_objs = Gifts.objects.filter(id=int(data['id']), status=False)
            if gift_objs.exists():
                gift_obj = gift_objs[0]
                gift_obj.status = True
                gift_obj.guest_name = data['persona'].lower()
                gift_obj.save()
                status = 200
            else:
                status=204
        except Exception as e:
            data = {"error": str(e)}
            status = 500
        return JsonResponse(data, status= status)
