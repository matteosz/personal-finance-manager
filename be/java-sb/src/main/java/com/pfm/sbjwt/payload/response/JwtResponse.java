package com.pfm.sbjwt.payload.response;

import java.util.List;

public class JwtResponse {
  private final List<String> roles;
  private final String token;
  private final Long id;
  private final String username;
  private final String email;

  public JwtResponse(String accessToken, Long id, String username, String email, List<String> roles) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.email = email;
    this.roles = roles;
  }

  public String getAccessToken() {
    return token;
  }

  public static String getTokenType() {
    return "Bearer";
  }

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  public String getUsername() {
    return username;
  }

  public List<String> getRoles() {
    return roles;
  }
}