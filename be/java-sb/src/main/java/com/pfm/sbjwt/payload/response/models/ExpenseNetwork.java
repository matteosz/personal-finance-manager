package com.pfm.sbjwt.payload.response.models;

import com.pfm.sbjwt.models.Expense;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseNetwork {
  private final LocalDate date;

  private final String currencyCode;

  private final String category;

  private final String subCategory;

  private final String description;

  private final BigDecimal amount;

  public ExpenseNetwork(Expense expense) {
    date = expense.getTimestamp();
    currencyCode = expense.getCurrencyCode();
    category = expense.getCategory();
    subCategory = expense.getSubCategory();
    description = expense.getDescription();
    amount = expense.getAmount();
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
