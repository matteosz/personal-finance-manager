package com.pfm.sbjwt.payload.response.models;

import com.pfm.sbjwt.models.NetWorth;
import java.math.BigDecimal;
import java.time.LocalDate;

public class NetWorthNetwork {

  private final BigDecimal value;

  private final LocalDate startDate;

  public NetWorthNetwork(NetWorth netWorth) {
    value = netWorth.getValue();
    startDate = netWorth.getStartDate();
  }

  public BigDecimal getValue() {
    return value;
  }

  public LocalDate getStartDate() {
    return startDate;
  }
}
