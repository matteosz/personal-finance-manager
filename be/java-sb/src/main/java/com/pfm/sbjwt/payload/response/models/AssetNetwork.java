package com.pfm.sbjwt.payload.response.models;

import com.pfm.sbjwt.models.Asset;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class AssetNetwork {

  private final LocalDate date;

  private final String currencyCode;

  private final String category;

  private final String description;

  private final String identifierCode;

  private final BigDecimal purchasedAmount;

  private final Map<LocalDate, BigDecimal> pricesByDate;

  public AssetNetwork(Asset asset) {
    date = asset.getDate();
    currencyCode = asset.getCurrencyCode();
    category = asset.getCategory();
    description = asset.getDescription();
    identifierCode = asset.getIdentifierCode();
    purchasedAmount = asset.getPurchasedAmount();
    pricesByDate = asset.getPricesByDate();
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
    return pricesByDate;
  }
}
