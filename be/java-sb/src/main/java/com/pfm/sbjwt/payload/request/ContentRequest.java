package com.pfm.sbjwt.payload.request;

import jakarta.validation.constraints.NotBlank;

public record ContentRequest(@NotBlank String jwtToken) {
  public ContentRequest(String jwtToken) {
    this.jwtToken = jwtToken;
  }

  @Override
  public String jwtToken() {
    return jwtToken;
  }
}
