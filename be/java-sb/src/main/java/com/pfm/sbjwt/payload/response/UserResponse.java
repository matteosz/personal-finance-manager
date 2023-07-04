package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.ExchangeRate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserResponse {
  private final Map<String, Float> lastRates = new HashMap<>();

  private final Integer amountEUR;

  public UserResponse(List<ExchangeRate> lastRates, Integer amountEUR) {
    lastRates.forEach(rate -> this.lastRates.put(rate.getCurrencyCode(), rate.getRate()));
    this.amountEUR = amountEUR;
  }

  public Map<String, Float> getLastRates() {
    return lastRates;
  }

  public Integer getAmountEUR() {
    return amountEUR;
  }
}
