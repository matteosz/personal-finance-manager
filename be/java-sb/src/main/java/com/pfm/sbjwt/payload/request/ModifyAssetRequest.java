package com.pfm.sbjwt.payload.request;

import com.pfm.sbjwt.payload.response.models.AssetNetwork;
import jakarta.validation.constraints.NotNull;

public class ModifyAssetRequest {
  @NotNull private Boolean delete;

  @NotNull private AssetNetwork asset;

  public ModifyAssetRequest() {
    // Public empty constructor
  }

  public Boolean getDelete() {
    return delete;
  }

  public AssetNetwork getAsset() {
    return asset;
  }
}
