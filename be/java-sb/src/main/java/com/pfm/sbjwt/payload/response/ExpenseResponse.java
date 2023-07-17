package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.Expense;
import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;
import java.util.List;
import java.util.stream.Collectors;

public class ExpenseResponse {
  private final List<ExpenseNetwork> expenses;

  public ExpenseResponse(List<Expense> expenses) {
    this.expenses = expenses.stream().map(ExpenseNetwork::new).collect(Collectors.toList());
  }

  public ExpenseResponse(ExpenseNetwork expense) {
    expenses = List.of(expense);
  }

  public List<ExpenseNetwork> getExpense() {
    return expenses;
  }
}
