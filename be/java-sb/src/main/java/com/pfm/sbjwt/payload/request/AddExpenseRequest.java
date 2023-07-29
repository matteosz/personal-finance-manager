package com.pfm.sbjwt.payload.request;

import com.pfm.sbjwt.models.Expense;
import com.pfm.sbjwt.models.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class AddExpenseRequest {

  @NotBlank
  @Size(min = 10, max = 10)
  private String date;

  @NotBlank
  @Size(min = 3, max = 3)
  private String currencyCode;

  @NotBlank
  @Size(max = 20)
  private String category;

  @NotBlank
  @Size(max = 30)
  private String subCategory;

  @Size(max = 100)
  private String description;

  @NotNull private Float amount;

  public AddExpenseRequest() {
    // Public empty constructor
  }

  public Expense buildExpense(User user) {
    return new Expense(user, date, currencyCode, category, subCategory, description, amount);
  }

  public LocalDate getDate() {
    LocalDate localDate = LocalDate.parse(date);
    return localDate.minusDays(localDate.getDayOfMonth() - 1);
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

  public Float getAmount() {
    return amount;
  }
}
