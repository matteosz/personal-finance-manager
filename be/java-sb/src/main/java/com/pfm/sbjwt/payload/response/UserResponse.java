package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.Asset;
import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.models.Expense;
import com.pfm.sbjwt.models.Income;
import com.pfm.sbjwt.models.NetWorth;
import com.pfm.sbjwt.models.User;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserResponse {
  private final Map<String, Float> lastRates = new HashMap<>();

  private final NetWorth netWorth;

  private final List<Expense> expenses;

  private final List<Income> income;

  private final List<Asset> assets;

  public UserResponse(List<ExchangeRate> lastRates, User user) {
    netWorth = user.getNetWorth();
    expenses = user.getExpenses();
    income = user.getIncome();
    assets = user.getAssets();
    lastRates.forEach(rate -> this.lastRates.put(rate.getCurrencyCode(), rate.getRate()));
  }

  public Map<String, Float> getLastRates() {
    return lastRates;
  }

  public NetWorth getNetWorth() {
    return netWorth;
  }

  public List<Expense> getExpenses() {
    return expenses;
  }

  public List<Income> getIncome() {
    return income;
  }

  public List<Asset> getAssets() {
    return assets;
  }
}
