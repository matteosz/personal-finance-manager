package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.Expense;
import com.pfm.sbjwt.models.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
  List<Expense> getExpensesByUser(User user);
}
