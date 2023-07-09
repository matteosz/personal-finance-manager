package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.NetWorth;
import com.pfm.sbjwt.models.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NetWorthRepository extends JpaRepository<NetWorth, Long> {
  Optional<NetWorth> getNetWorthByUser(User user);
}
