package com.pfm.sbjwt.payload.request;

import com.pfm.sbjwt.models.Asset;
import com.pfm.sbjwt.models.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AddAssetRequest {
  @NotBlank
  @Size(max = 10)
  private String date;

  @NotBlank
  @Size(min = 3, max = 3)
  private String currencyCode;

  @NotBlank
  @Size(max = 20)
  private String category;

  @Size(max = 100)
  private String description;

  @Size(max = 50)
  private String identifierCode;

  @NotNull private Boolean isTracked;

  @NotNull private Float amount;

  public AddAssetRequest() {
    // Public empty constructor
  }

  public Asset buildAsset(User user) {
    return new Asset(
        user, date, currencyCode, category, description, identifierCode, isTracked, amount);
  }

  public String getDate() {
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

  public Boolean isTracked() {
    return isTracked;
  }

  public Float getAmount() {
    return amount;
  }
}
