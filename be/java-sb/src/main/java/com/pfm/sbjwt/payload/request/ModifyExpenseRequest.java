package com.pfm.sbjwt.payload.request;

import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;
import jakarta.validation.constraints.NotNull;

public class ModifyExpenseRequest {

  @NotNull private Boolean delete;

  @NotNull private ExpenseNetwork expense;

  public ModifyExpenseRequest() {
    // Public empty constructor
  }

  public Boolean getDelete() {
    return delete;
  }

  public ExpenseNetwork getExpense() {
    return expense;
  }
}
