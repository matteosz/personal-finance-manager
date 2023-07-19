package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.payload.response.models.AssetNetwork;

public class AssetResponse {
  private final AssetNetwork asset;

  public AssetResponse(AssetNetwork asset) {
    this.asset = asset;
  }

  public AssetNetwork getAsset() {
    return asset;
  }
}
