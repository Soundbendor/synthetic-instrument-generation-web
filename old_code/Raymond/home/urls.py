from django.http import JsonResponse
from django.urls import path
from home import views
from django.conf.urls.static import static
from django.conf import settings


urlpatterns=[
    path("", views.index, name='home'),
    path('survey', views.survey, name='survey'),
    path('about', views.about, name='about'),
    # path('testView', views.testView.as_view(), name='testView'),
    #path('json/<int:num_aduios>/', views.PostJsonListView.as_view(), name='json'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)