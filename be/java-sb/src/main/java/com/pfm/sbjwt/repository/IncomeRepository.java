package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.Income;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
  @Modifying
  @Transactional
  void removeIncomeById(Long id);

  @Modifying
  @Transactional
  @Query(
      "UPDATE Income i SET i.date = :newDate, i.currencyCode = :newCurrencyCode, "
          + "i.category = :newCategory, i.subCategory = :newSubCategory, "
          + "i.description = :newDescription, i.amount = :newAmount "
          + "WHERE i.id = :id")
  void modifyIncomeById(
      Long id,
      LocalDate newDate,
      String newCurrencyCode,
      String newCategory,
      String newSubCategory,
      String newDescription,
      BigDecimal newAmount);
}
