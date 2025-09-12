from django.urls import path
from .views import MonthSummaryAPIView, IncomeVsExpenseChartAPIView, ExpenseByCategoryChartAPIView, WeeklyExpenseChartAPIView, RecentTransactionsOfMonthAPIView, AccountBalancesChartAPIView

urlpatterns = [
    path('monthly-summary/', MonthSummaryAPIView.as_view(), name="monthly-summary"),
    path('incomeVsExpenseChart/', IncomeVsExpenseChartAPIView.as_view(),
         name="incomeVsExpenseChart"),
    path('expenseByCategoryChart/', ExpenseByCategoryChartAPIView.as_view(),
         name='expenseByCategoryChart'),
    path('weeklyExpenseChart/',
         WeeklyExpenseChartAPIView.as_view(), name='weeklyExpense'),
    path('recentTransactionsMonth/', RecentTransactionsOfMonthAPIView.as_view(),
         name='recentTransactionsMonth'),
    path('totalAccountBalancesChart/',
         AccountBalancesChartAPIView.as_view(), name='totalAccountBalancesChart')
]
