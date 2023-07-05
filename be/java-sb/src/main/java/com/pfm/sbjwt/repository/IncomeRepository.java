package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.Income;
import com.pfm.sbjwt.models.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
  List<Income> getIncomesByUser(User user);
}
