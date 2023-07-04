package com.pfm.sbjwt.controllers;

import com.pfm.sbjwt.components.ExchangeRateUpdater;
import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.payload.response.UserResponse;
import com.pfm.sbjwt.services.ExchangeRateService;
import java.util.List;
import java.util.Optional;
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

  @Autowired
  ExchangeRateService exchangeRateService;

  @Autowired
  ExchangeRateUpdater exchangeRateUpdater;

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userAccess() {
    Optional<List<ExchangeRate>> optionExchangeRates = exchangeRateService.findLatestRates();
    List<ExchangeRate> rates;
    if (optionExchangeRates.isEmpty() || optionExchangeRates.get().isEmpty()) {
      rates = exchangeRateUpdater.updateExchangeRates();
    } else {
      rates = optionExchangeRates.get();
    }
    return ResponseEntity.ok(new UserResponse(rates, 100000));
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
