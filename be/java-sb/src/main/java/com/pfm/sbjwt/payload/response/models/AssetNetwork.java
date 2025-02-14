package com.pfm.sbjwt.payload.response.models;

import com.pfm.sbjwt.models.Asset;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class AssetNetwork {
  private Long id;

  private LocalDate date;

  private String currencyCode;

  private String category;

  private String description;

  private String identifierCode;

  private BigDecimal amount;

  private Map<LocalDate, BigDecimal> pricesByDate;

  private Boolean toBeDeleted;

  private Boolean toBePurchased;

  public AssetNetwork() {
    // Public empty constructor
  }

  public AssetNetwork(Long id) {
    this.id = id;
    toBeDeleted = true;
  }

  public AssetNetwork(Asset asset) {
    date = asset.getDate();
    currencyCode = asset.getCurrencyCode();
    category = asset.getCategory();
    description = asset.getDescription();
    identifierCode = asset.getIdentifierCode();
    amount = asset.getAmount();
    pricesByDate = asset.getPricesByDate();
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

  public BigDecimal getAmount() {
    return amount;
  }

  public Map<LocalDate, BigDecimal> getPricesByDate() {
    return pricesByDate;
  }

  public Boolean getToBeDeleted() {
    return toBeDeleted;
  }
}
