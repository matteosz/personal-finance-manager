package com.pfm.sbjwt.controllers;

import com.pfm.sbjwt.components.ExchangeRateUpdater;
import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.payload.response.UserResponse;
import com.pfm.sbjwt.services.ExchangeRateService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

  @Autowired ExchangeRateService exchangeRateService;

  @Autowired ExchangeRateUpdater exchangeRateUpdater;

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userAccess() {
    List<ExchangeRate> rates = exchangeRateService.findLatestRates();
    if (rates.isEmpty()) {
      rates = exchangeRateUpdater.updateExchangeRates();
    }

    return ResponseEntity.ok(new UserResponse(rates));
  }

  @GetMapping("/mod")
  @PreAuthorize("hasRole('MODERATOR')")
  public String moderatorAccess() {
    return null;
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public String adminAccess() {
    return null;
  }
}
