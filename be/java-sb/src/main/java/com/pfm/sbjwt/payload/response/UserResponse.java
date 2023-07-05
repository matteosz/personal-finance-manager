package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.ExchangeRate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserResponse {
  private final Map<String, Float> lastRates = new HashMap<>();

  public UserResponse(List<ExchangeRate> lastRates) {
    lastRates.forEach(rate -> this.lastRates.put(rate.getCurrencyCode(), rate.getRate()));
  }
}
