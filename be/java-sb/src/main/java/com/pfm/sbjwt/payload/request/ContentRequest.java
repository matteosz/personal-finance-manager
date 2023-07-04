package com.pfm.sbjwt.payload.request;

import jakarta.validation.constraints.NotBlank;

public class ContentRequest {
  @NotBlank
  private String token;

  public ContentRequest(String token) {
    this.token = token;
  }

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }
}
