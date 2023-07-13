package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;

public class AddExpenseResponse {
  private final ExpenseNetwork expense;

  public AddExpenseResponse(ExpenseNetwork expense) {
    this.expense = expense;
  }

  public ExpenseNetwork getExpense() {
    return expense;
  }
}
