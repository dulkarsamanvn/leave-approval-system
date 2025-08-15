from django.urls import path
from leave.views import ApplyLeaveRequestView,GetLeavesView,UpdateStatusView

urlpatterns = [
    path('request-leave/',ApplyLeaveRequestView.as_view(),name='request-leave'),
    path('all-leaves/',GetLeavesView.as_view(),name='all-leaves'),
    path('<int:id>/update-status/',UpdateStatusView.as_view(),name='update-status'),
]
