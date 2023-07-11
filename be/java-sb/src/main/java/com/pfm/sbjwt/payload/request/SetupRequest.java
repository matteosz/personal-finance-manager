package com.pfm.sbjwt.payload.request;

import jakarta.validation.constraints.NotNull;

public class SetupRequest {
  @NotNull private Float amount;

  public Float getAmount() {
    return amount;
  }
}
