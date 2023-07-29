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
@Table(name = "wallet_currency_amount")
public class WalletEntry {

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

  public WalletEntry() {
    // Default constructor
  }

  public WalletEntry(LocalDate newDate, WalletEntry entry) {
    this(entry.user, newDate, entry.currencyCode, entry.amount);
  }

  public WalletEntry(User user, LocalDate date, String currencyCode, BigDecimal amount) {
    this.user = user;
    this.date = date;
    this.currencyCode = currencyCode;
    this.amount = amount;
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
