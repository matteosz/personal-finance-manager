package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.Asset;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
  @Modifying
  @Transactional
  void removeAssetById(Long id);

  @Modifying
  @Transactional
  @Query(
      "UPDATE Asset a SET a.date = :newDate, a.currencyCode = :newCurrencyCode, "
          + "a.category = :newCategory, a.description = :newDescription, "
          + "a.identifierCode = :newIdentifierCode, a.isTracked = :isTracked,"
          + "a.purchasedAmount = :newAmount WHERE a.id = :id")
  void modifyAssetById(
      Long id,
      LocalDate newDate,
      String newCurrencyCode,
      String newCategory,
      String newDescription,
      String newIdentifierCode,
      Boolean isTracked,
      BigDecimal newAmount);
}
