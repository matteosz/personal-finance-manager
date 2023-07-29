package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.payload.response.models.WalletNetwork;

public class SetupResponse {
  private final WalletNetwork wallet;

  public SetupResponse(WalletNetwork wallet) {
    this.wallet = wallet;
  }

  public WalletNetwork getWallet() {
    return wallet;
  }
}
