package com.pfm.sbjwt.payload.response.models;

import com.pfm.sbjwt.models.Expense;
import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseNetwork {
  private Long id;
  private LocalDate date;

  private String currencyCode;

  private String category;

  private String subCategory;

  private String description;

  private BigDecimal amount;

  private Boolean toBeDeleted;

  public ExpenseNetwork() {
    // Public empty constructor
  }

  public ExpenseNetwork(Long id) {
    this.id = id;
    toBeDeleted = true;
  }

  public ExpenseNetwork(Expense expense) {
    id = expense.getId();
    date = expense.getTimestamp();
    currencyCode = expense.getCurrencyCode();
    category = expense.getCategory();
    subCategory = expense.getSubCategory();
    description = expense.getDescription();
    amount = expense.getAmount();
  }

  public Long getId() {
    return id;
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

  public Boolean getToBeDeleted() {
    return toBeDeleted;
  }
}
