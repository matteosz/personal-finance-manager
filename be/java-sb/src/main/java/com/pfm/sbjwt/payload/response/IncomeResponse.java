package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.Income;
import com.pfm.sbjwt.payload.response.models.IncomeNetwork;
import java.util.List;
import java.util.stream.Collectors;

public class IncomeResponse {
  private final List<IncomeNetwork> incomes;

  public IncomeResponse(List<Income> incomes) {
    this.incomes = incomes.stream().map(IncomeNetwork::new).collect(Collectors.toList());
  }

  public IncomeResponse(IncomeNetwork income) {
    incomes = List.of(income);
  }

  public List<IncomeNetwork> getIncomes() {
    return incomes;
  }
}
