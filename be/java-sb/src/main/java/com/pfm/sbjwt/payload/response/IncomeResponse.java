package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.Income;
import com.pfm.sbjwt.payload.response.models.IncomeNetwork;
import com.pfm.sbjwt.payload.response.models.WalletNetwork;

public class IncomeResponse {
  private final IncomeNetwork income;

  private final WalletNetwork wallet;

  public IncomeResponse(Income income, WalletNetwork wallet) {
    this.income = new IncomeNetwork(income);
    this.wallet = wallet;
  }

  public IncomeResponse(IncomeNetwork income, WalletNetwork wallet) {
    this.income = income;
    this.wallet = wallet;
  }

  public IncomeNetwork getIncome() {
    return income;
  }

  public WalletNetwork getWallet() {
    return wallet;
  }
}
