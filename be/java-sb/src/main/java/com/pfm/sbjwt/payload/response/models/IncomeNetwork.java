package com.pfm.sbjwt.payload.response.models;

import com.pfm.sbjwt.models.Income;
import java.math.BigDecimal;
import java.time.LocalDate;

public class IncomeNetwork {

  private final LocalDate date;

  private final String currencyCode;

  private final String category;

  private final String subCategory;

  private final String description;

  private final BigDecimal amount;

  public IncomeNetwork(Income income) {
    date = income.getTimestamp();
    currencyCode = income.getCurrencyCode();
    category = income.getCategory();
    subCategory = income.getSubCategory();
    description = income.getDescription();
    amount = income.getAmount();
  }

  public LocalDate getDate() {
    return date;
  }

  public String getCurrencyCode() {
    return currencyCode;
  }

  public String getCategory() {
    return category;
  }

  public String getSubCategory() {
    return subCategory;
  }

  public String getDescription() {
    return description;
  }

  public BigDecimal getAmount() {
    return amount;
  }
}
