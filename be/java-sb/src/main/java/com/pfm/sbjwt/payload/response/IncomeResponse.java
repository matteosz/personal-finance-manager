package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.payload.response.models.IncomeNetwork;

public class IncomeResponse {
  private final IncomeNetwork income;

  public IncomeResponse(IncomeNetwork income) {
    this.income = income;
  }

  public IncomeNetwork getIncome() {
    return income;
  }
}
