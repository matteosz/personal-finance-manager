package com.pfm.sbjwt.models;

import com.pfm.sbjwt.payload.response.models.AssetNetwork;
import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;
import com.pfm.sbjwt.payload.response.models.IncomeNetwork;
import com.pfm.sbjwt.payload.response.models.NetWorthNetwork;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(
    name = "users",
    uniqueConstraints = {
      @UniqueConstraint(columnNames = "username"),
      @UniqueConstraint(columnNames = "email")
    })
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(max = 120)
  private String password;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(
      name = "user_roles",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private final List<Expense> expenses = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private final List<Income> income = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private final List<Asset> assets = new ArrayList<>();

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
  private NetWorth netWorth;

  public User() {
    // public empty constructor
  }

  public User(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  public Long getId() {
    return id;
  }

  public String getUsername() {
    return username;
  }

  public String getEmail() {
    return email;
  }

  public String getPassword() {
    return password;
  }

  public Set<Role> getRoles() {
    return roles;
  }

  public List<Expense> getExpenses() {
    return expenses;
  }

  public List<Income> getIncome() {
    return income;
  }

  public List<Asset> getAssets() {
    return assets;
  }

  public NetWorth getNetWorth() {
    return netWorth;
  }

  public List<ExpenseNetwork> getExpensesNetwork() {
    return expenses.stream().map(ExpenseNetwork::new).collect(Collectors.toList());
  }

  public List<IncomeNetwork> getIncomeNetwork() {
    return income.stream().map(IncomeNetwork::new).collect(Collectors.toList());
  }

  public List<AssetNetwork> getAssetsNetwork() {
    return assets.stream().map(AssetNetwork::new).collect(Collectors.toList());
  }

  public NetWorthNetwork getNetWorthNetwork() {
    return netWorth == null ? null : new NetWorthNetwork(netWorth);
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }
}
