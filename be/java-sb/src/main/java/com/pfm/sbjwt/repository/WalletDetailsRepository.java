package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.User;
import com.pfm.sbjwt.models.WalletEntry;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface WalletDetailsRepository extends JpaRepository<WalletEntry, Long> {
  @Query("SELECT MAX(we.date) FROM WalletEntry we WHERE we.user = :user")
  Optional<LocalDate> getLatestDateByUser(@Param("user") User user);

  List<WalletEntry> getWalletEntriesByDateEqualsAndUser(LocalDate date, User user);

  @Modifying
  @Transactional
  @Query("UPDATE WalletEntry we SET we.amount = :newAmount WHERE we.id = :id")
  void modifyEntryById(Long id, BigDecimal newAmount);
}
