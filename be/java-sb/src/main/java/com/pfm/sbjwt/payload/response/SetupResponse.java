package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.NetWorth;
import java.math.BigDecimal;
import java.time.LocalDate;

public class SetupResponse {
  private final BigDecimal value;

  private final LocalDate startDate;

  public SetupResponse(NetWorth netWorth) {
    this.value = netWorth.getValue();
    this.startDate = netWorth.getStartDate();
  }

  public BigDecimal getValue() {
    return value;
  }

  public LocalDate getStartDate() {
    return startDate;
  }
}
