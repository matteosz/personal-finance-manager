package com.pfm.sbjwt.payload.request;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SetupRequest {

  @NotNull private BigDecimal value;

  @NotNull private LocalDate startDate;

  public SetupRequest() {
    // Public empty constructor
  }

  public BigDecimal getValue() {
    return value;
  }

  public LocalDate getStartDate() {
    return startDate;
  }
}
