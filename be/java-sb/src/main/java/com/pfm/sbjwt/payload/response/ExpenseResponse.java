package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;

public class ExpenseResponse {
  private final ExpenseNetwork expense;

  public ExpenseResponse(ExpenseNetwork expense) {
    this.expense = expense;
  }

  public ExpenseNetwork getExpense() {
    return expense;
  }
}
