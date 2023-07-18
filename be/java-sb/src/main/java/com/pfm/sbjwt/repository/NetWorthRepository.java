package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.NetWorth;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface NetWorthRepository extends JpaRepository<NetWorth, Long> {
  @Modifying
  @Transactional
  @Query(
      "UPDATE NetWorth nw SET nw.startDate = :newDate, nw.value = :newAmount "
          + "WHERE nw.id = :id")
  void modifyNetWorthById(Long id, LocalDate newDate, BigDecimal newAmount);
}
