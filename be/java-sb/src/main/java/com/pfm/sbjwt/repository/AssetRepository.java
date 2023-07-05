package com.pfm.sbjwt.repository;

import com.pfm.sbjwt.models.Asset;
import com.pfm.sbjwt.models.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
  List<Asset> getAssetsByUser(User user);
}
