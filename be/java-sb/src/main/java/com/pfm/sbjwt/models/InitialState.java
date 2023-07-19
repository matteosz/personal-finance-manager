package com.pfm.sbjwt.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "initial_state")
public class InitialState {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "user_id")
  private User user;

  @Column(nullable = false)
  private BigDecimal value;

  @Column(nullable = false)
  private LocalDate startDate;

  public InitialState() {
    // Public empty constructor
  }

  public InitialState(User user, BigDecimal value, LocalDate startDate) {
    this.user = user;
    this.value = value;
    this.startDate = startDate;
  }

  public Long getId() {
    return id;
  }

  public User getUser() {
    return user;
  }

  public BigDecimal getValue() {
    return value;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public void setValues(LocalDate startDate, BigDecimal value) {
    this.startDate = startDate;
    this.value = value;
  }
}
