package com.pfm.sbjwt.payload.request;

import jakarta.validation.constraints.*;
import java.util.Set;

public record SignupRequest(
    @NotBlank @Size(min = 3, max = 20) String username,
    @NotBlank @Size(max = 50) @Email String email,
    Set<String> role,
    @NotBlank @Size(min = 6, max = 40) String password) {
  public SignupRequest(String username, String email, Set<String> role, String password) {
    this.username = username;
    this.email = email;
    this.role = role;
    this.password = password;
  }

  @Override
  public String username() {
    return username;
  }

  @Override
  public String email() {
    return email;
  }

  @Override
  public String password() {
    return password;
  }
}
