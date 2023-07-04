package com.pfm.sbjwt.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "rates")
public class ExchangeRate {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 3)
  private String currencyCode;
  private Float rate;
  private LocalDateTime timestamp;

  public ExchangeRate() {
    // Empty constructor
  }

  public ExchangeRate(String currencyCode, Float rate, LocalDateTime timestamp) {
    this.currencyCode = currencyCode;
    this.rate = rate;
    this.timestamp = timestamp;
  }

  public String getCurrencyCode() {
    return currencyCode;
  }
  public Float getRate() {
    return rate;
  }

  public Long getId() {
    return id;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public void setCurrencyCode(String currencyCode) {
    this.currencyCode = currencyCode;
  }

  public void setRate(Float rate) {
    this.rate = rate;
  }

  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }
}
