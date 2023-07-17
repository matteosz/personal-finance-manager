package com.pfm.sbjwt.payload.response.models;

import com.pfm.sbjwt.models.Income;
import java.math.BigDecimal;
import java.time.LocalDate;

public class IncomeNetwork {

  private Long id;
  private LocalDate date;

  private String currencyCode;

  private String category;

  private String subCategory;

  private String description;

  private BigDecimal amount;

  private Boolean toBeDeleted;

  public IncomeNetwork() {
    // Public empty constructor
  }

  public IncomeNetwork(Long id) {
    this.id = id;
    toBeDeleted = true;
  }

  public IncomeNetwork(Income income) {
    id = income.getId();
    date = income.getTimestamp();
    currencyCode = income.getCurrencyCode();
    category = income.getCategory();
    subCategory = income.getSubCategory();
    description = income.getDescription();
    amount = income.getAmount();
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
