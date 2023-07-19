package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.InitialState;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InitialStateRepository extends JpaRepository<InitialState, Long> {
  @Modifying
  @Transactional
  @Query(
      "UPDATE InitialState is SET is.startDate = :newDate, is.value = :newAmount "
          + "WHERE is.id = :id")
  void modifyInitialStateById(Long id, LocalDate newDate, BigDecimal newAmount);
}
