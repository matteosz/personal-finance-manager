package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.User;
import com.pfm.sbjwt.models.WalletOrigin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface WalletOriginRepository extends JpaRepository<WalletOrigin, Long> {
  @Modifying
  @Transactional
  void deleteAllByUser(User user);
}
