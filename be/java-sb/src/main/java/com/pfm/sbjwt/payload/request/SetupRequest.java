package com.pfm.sbjwt.payload.request;

import static com.pfm.sbjwt.Constants.CURRENCIES;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class SetupRequest {

  @NotNull private Map<String, BigDecimal> entries;

  @NotNull private LocalDate startDate;

  public SetupRequest() {
    // Public empty constructor
  }

  public Map<String, BigDecimal> getEntries() {
    // Add 0 to not specified currency
    for (String currency : CURRENCIES) {
      entries.putIfAbsent(currency, BigDecimal.ZERO);
    }
    return entries;
  }

  public LocalDate getStartDate() {
    // Use always 1st of the month
    return startDate.minusDays(startDate.getDayOfMonth() - 1);
  }
}
