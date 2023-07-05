package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.ExchangeRate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
  @Query(
      "SELECT er FROM ExchangeRate er WHERE er.timestamp = (SELECT MAX(er2.timestamp) FROM ExchangeRate er2)")
  List<ExchangeRate> findLatestExchangeRates();

  @Query("SELECT MAX(er.timestamp) FROM ExchangeRate er")
  Optional<LocalDateTime> findLatestTimestamp();

  @Modifying
  @Transactional
  @Query("DELETE FROM ExchangeRate er WHERE er.timestamp = :timestamp")
  void deleteExchangeRatesByTimestamp(@Param("timestamp") LocalDateTime timestamp);
}
