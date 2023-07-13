package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.models.NetWorth;

public class SetupResponse {
  private final NetWorth netWorth;

  public SetupResponse(NetWorth netWorth) {
    this.netWorth = netWorth;
  }

  public NetWorth getNetWorth() {
    return netWorth;
  }
}
