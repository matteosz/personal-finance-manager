package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.NetWorth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NetWorthRepository extends JpaRepository<NetWorth, Long> {}
