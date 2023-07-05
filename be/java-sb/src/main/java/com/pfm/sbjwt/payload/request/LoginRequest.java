package com.pfm.sbjwt.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
    @NotBlank @Size(min = 3, max = 20) String username,
    @NotBlank @Size(min = 6, max = 40) String password) {
  public LoginRequest(String username, String password) {
    this.username = username;
    this.password = password;
  }

  @Override
  public String username() {
    return username;
  }

  @Override
  public String password() {
    return password;
  }
}
