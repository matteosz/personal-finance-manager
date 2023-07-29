package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.Expense;
import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;
import com.pfm.sbjwt.payload.response.models.WalletNetwork;

public class ExpenseResponse {
  private final ExpenseNetwork expense;

  private final WalletNetwork wallet;

  public ExpenseResponse(Expense expense, WalletNetwork wallet) {
    this.expense = new ExpenseNetwork(expense);
    this.wallet = wallet;
  }

  public ExpenseResponse(ExpenseNetwork expense, WalletNetwork wallet) {
    this.expense = expense;
    this.wallet = wallet;
  }

  public ExpenseNetwork getExpense() {
    return expense;
  }

  public WalletNetwork getWallet() {
    return wallet;
  }
}
