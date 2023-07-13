package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.payload.response.models.NetWorthNetwork;

public class SetupResponse {
  private final NetWorthNetwork netWorth;

  public SetupResponse(NetWorthNetwork netWorth) {
    this.netWorth = netWorth;
  }

  public NetWorthNetwork getNetWorth() {
    return netWorth;
  }
}
