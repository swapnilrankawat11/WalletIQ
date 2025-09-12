from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet, TransactionCategoriesViewSet, TransactionTypesViewSet, AccountGroupsViewSet, AccountsViewSet, TransferViewSet, AccountsSummaryAPIView, AccountInsightsAndAnalyticsAPIView, BudgetViewSet, BudgetSummaryAPIView, BudgetVsSpentChartAPIView, CalendarDayBadgesAPIView, CalendarDaySummaryAPIView, TransferListByDateAPIView, TransactionListByDateAPIView
from django.urls import path

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transactions')
router.register(r'categories', TransactionCategoriesViewSet,
                basename="categories")
router.register(r'transactiontypes', TransactionTypesViewSet,
                basename='transasctiontypes')
router.register(r'accountgroups', AccountGroupsViewSet,
                basename='accountgroups')
router.register(r'accounts', AccountsViewSet, basename="accounts")
router.register(r'transfers', TransferViewSet, basename="transfers")
router.register(r'budgets', BudgetViewSet, basename="budgets")


extra_urlpatterns = [
    path('accounts-summary/', AccountsSummaryAPIView.as_view(),
         name="accounts-summary"),
    path('accountInsightsAndAnalytics/<int:acc_id>/', AccountInsightsAndAnalyticsAPIView.as_view(),
         name="accountInsightsAndAnalytics"),
    path('budgetSummary/', BudgetSummaryAPIView.as_view(), name="budgetSummary"),
    path('budgetVsSpentChartData/', BudgetVsSpentChartAPIView.as_view(),
         name="budgetVsSpentChartData"),
    path('calendarDayBadges/', CalendarDayBadgesAPIView.as_view(),
         name="calendarDayBadges"),
    path('calendarDaySummary/', CalendarDaySummaryAPIView.as_view(),
         name="calendarDaySummary"),
    path('transferListByDate/', TransferListByDateAPIView.as_view(),
         name="transferListByDate"),
    path('transactionListByDate/', TransactionListByDateAPIView.as_view(), name="")
]

urlpatterns = router.urls + extra_urlpatterns
