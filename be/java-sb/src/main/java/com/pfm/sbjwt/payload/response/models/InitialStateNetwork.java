package com.pfm.sbjwt.payload.response.models;

import com.pfm.sbjwt.models.InitialState;
import java.math.BigDecimal;
import java.time.LocalDate;

public class InitialStateNetwork {

  private BigDecimal value;

  private LocalDate startDate;

  public InitialStateNetwork() {
    // Empty constructor
  }

  public InitialStateNetwork(InitialState initialState) {
    this.value = initialState.getValue();
    this.startDate = initialState.getStartDate();
  }

  public BigDecimal getValue() {
    return value;
  }

  public LocalDate getStartDate() {
    return startDate;
  }
}
