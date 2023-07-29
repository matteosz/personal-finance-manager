package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.payload.response.models.AssetNetwork;
import com.pfm.sbjwt.payload.response.models.WalletNetwork;

public class AssetResponse {
  private final AssetNetwork asset;

  private final WalletNetwork wallet;

  public AssetResponse(AssetNetwork asset, WalletNetwork wallet) {
    this.asset = asset;
    this.wallet = wallet;
  }

  public AssetNetwork getAsset() {
    return asset;
  }

  public WalletNetwork getWallet() {
    return wallet;
  }
}
