package com.pfm.sbjwt.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "wallet_origin")
public class WalletOrigin {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @Column(nullable = false)
  private LocalDate date;

  @Column(nullable = false)
  private String currencyCode;

  @Column(nullable = false)
  private BigDecimal amount;

  public WalletOrigin() {
    // Default constructor
  }

  public WalletOrigin(WalletEntry entry) {
    user = entry.getUser();
    date = entry.getDate();
    currencyCode = entry.getCurrencyCode();
    amount = entry.getAmount();
  }

  public Long getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public LocalDate getDate() {
    return date;
  }

  public String getCurrencyCode() {
    return currencyCode;
  }

  public BigDecimal getAmount() {
    return amount;
  }
}
