package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.models.User;
import com.pfm.sbjwt.payload.response.models.AssetNetwork;
import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;
import com.pfm.sbjwt.payload.response.models.IncomeNetwork;
import com.pfm.sbjwt.payload.response.models.WalletNetwork;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public class UserResponse {
  private final Map<LocalDate, Map<String, Float>> lastRates = new TreeMap<>();

  private final List<ExpenseNetwork> expenses;

  private final List<IncomeNetwork> income;

  private final List<AssetNetwork> assets;

  private final WalletNetwork wallet;

  public UserResponse(List<ExchangeRate> exchangeRates, User user) {
    expenses = user.getExpensesNetwork();
    income = user.getIncomeNetwork();
    assets = user.getAssetsNetwork();
    wallet = user.getWalletNetwork();

    for (ExchangeRate exchangeRate : exchangeRates) {
      LocalDate date = exchangeRate.getTimestamp();
      YearMonth yearMonth = YearMonth.from(date);

      // Get or create the map for the given month
      Map<String, Float> ratesByCurrency =
          lastRates.computeIfAbsent(yearMonth.atDay(1), k -> new HashMap<>());

      // Add the exchange rate for the currency
      ratesByCurrency.put(exchangeRate.getCurrencyCode(), exchangeRate.getRate());
    }
  }

  public Map<LocalDate, Map<String, Float>> getLastRates() {
    return lastRates;
  }

  public List<ExpenseNetwork> getExpenses() {
    return expenses;
  }

  public List<IncomeNetwork> getIncome() {
    return income;
  }

  public List<AssetNetwork> getAssets() {
    return assets;
  }

  public WalletNetwork getWallet() {
    return wallet;
  }
}
