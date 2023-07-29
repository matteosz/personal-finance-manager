package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.Expense;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

  Expense getExpenseById(Long id);

  @Modifying
  @Transactional
  void removeExpenseById(Long id);

  @Modifying
  @Transactional
  @Query(
      "UPDATE Expense e SET e.date = :newDate, e.currencyCode = :newCurrencyCode, "
          + "e.category = :newCategory, e.subCategory = :newSubCategory, "
          + "e.description = :newDescription, e.amount = :newAmount "
          + "WHERE e.id = :id")
  void modifyExpenseById(
      Long id,
      LocalDate newDate,
      String newCurrencyCode,
      String newCategory,
      String newSubCategory,
      String newDescription,
      BigDecimal newAmount);
}
