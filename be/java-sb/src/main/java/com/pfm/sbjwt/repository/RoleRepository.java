package com.pfm.sbjwt.repository;


import com.pfm.sbjwt.models.ERole;
import com.pfm.sbjwt.models.Role;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);
}