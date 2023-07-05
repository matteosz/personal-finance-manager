package com.pfm.sbjwt.models;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private ERole name;

  public Role() {
    // Public empty constructor
  }

  public Integer getId() {
    return id;
  }

  public ERole getName() {
    return name;
  }
}
