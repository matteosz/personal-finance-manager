package com.pfm.sbjwt.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "income")
public class Income {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @Column(nullable = false)
  private LocalDate date;

  @NotBlank
  @Size(min = 3, max = 3)
  private String currencyCode;

  @NotBlank
  @Size(max = 20)
  private String category;

  @NotBlank
  @Size(max = 20)
  private String subCategory;

  @Size(max = 100)
  private String description;

  @Column(nullable = false)
  private BigDecimal amount;

  public Income() {
    // Public empty constructor
  }

  public Income(
      User user,
      LocalDate date,
      String currencyCode,
      String category,
      String subCategory,
      String description,
      BigDecimal amount) {
    this.user = user;
    this.date = date;
    this.currencyCode = currencyCode;
    this.category = category;
    this.subCategory = subCategory;
    this.description = description;
    this.amount = amount;
  }

  public Long getId() {
    return id;
  }

  public LocalDate getTimestamp() {
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
