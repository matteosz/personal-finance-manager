package com.pfm.sbjwt.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContentRequest(@NotBlank @Size(min = 3, max = 20) String username) {
  public ContentRequest(String username) {
    this.username = username;
  }

  @Override
  public String username() {
    return username;
  }
}
