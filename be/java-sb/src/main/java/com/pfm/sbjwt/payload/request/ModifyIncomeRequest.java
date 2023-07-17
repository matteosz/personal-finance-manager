package com.pfm.sbjwt.payload.request;

import com.pfm.sbjwt.payload.response.models.IncomeNetwork;
import jakarta.validation.constraints.NotNull;

public class ModifyIncomeRequest {

  @NotNull private Boolean delete;

  @NotNull private IncomeNetwork income;

  public ModifyIncomeRequest() {
    // Public empty constructor
  }

  public Boolean getDelete() {
    return delete;
  }

  public IncomeNetwork getIncome() {
    return income;
  }
}
