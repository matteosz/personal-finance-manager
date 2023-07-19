package com.pfm.sbjwt.payload.response;

import com.pfm.sbjwt.payload.response.models.InitialStateNetwork;

public class SetupResponse {
  private final InitialStateNetwork initialState;

  public SetupResponse(InitialStateNetwork initialState) {
    this.initialState = initialState;
  }

  public InitialStateNetwork getInitialState() {
    return initialState;
  }
}
