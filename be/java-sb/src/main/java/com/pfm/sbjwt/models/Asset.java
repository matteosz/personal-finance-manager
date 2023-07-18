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
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "assets")
public class Asset {
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
  @Size(min = 4, max = 5)
  private String category;

  @Size(max = 100)
  private String description;

  @Size(max = 50)
  private String identifierCode;

  @Column(nullable = false)
  private BigDecimal purchasedAmount;

  public Asset() {
    // Empty public constructor
  }

  public Asset(
      User user,
      LocalDate date,
      String currencyCode,
      String category,
      String description,
      String identifierCode,
      BigDecimal purchasedAmount) {
    this.user = user;
    this.date = date;
    this.currencyCode = currencyCode;
    this.category = category;
    this.description = description;
    this.identifierCode = identifierCode;
    this.purchasedAmount = purchasedAmount;
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

  public String getDescription() {
    return description;
  }

  public String getIdentifierCode() {
    return identifierCode;
  }

  public BigDecimal getPurchasedAmount() {
    return purchasedAmount;
  }

  public Map<LocalDate, BigDecimal> getPricesByDate() {
    return new HashMap<>();
  }
}
