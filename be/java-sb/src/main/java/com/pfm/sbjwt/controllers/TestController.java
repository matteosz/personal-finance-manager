package com.pfm.sbjwt.controllers;

import static com.pfm.sbjwt.security.jwt.AuthTokenFilter.parseJwt;

import com.pfm.sbjwt.components.ExchangeRateUpdater;
import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.models.User;
import com.pfm.sbjwt.payload.response.MessageResponse;
import com.pfm.sbjwt.payload.response.UserResponse;
import com.pfm.sbjwt.repository.UserRepository;
import com.pfm.sbjwt.security.jwt.JwtUtils;
import com.pfm.sbjwt.services.ExchangeRateService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {

  @Autowired ExchangeRateService exchangeRateService;

  @Autowired ExchangeRateUpdater exchangeRateUpdater;

  @Autowired JwtUtils jwtUtils;

  @Autowired UserRepository userRepository;

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userAccess(HttpServletRequest request) {
    String username = jwtUtils.getUserNameFromJwtToken(parseJwt(request));
    Optional<List<ExchangeRate>> optionExchangeRates = exchangeRateService.findLatestRates();
    List<ExchangeRate> rates;
    // Force the update of exchange rates if none is present (bootstrapping)
    if (optionExchangeRates.isEmpty() || optionExchangeRates.get().isEmpty()) {
      rates = exchangeRateUpdater.updateExchangeRates();
    } else {
      rates = optionExchangeRates.get();
    }
    // Find the user content
    Optional<User> user = userRepository.findByUsername(username);
    if (user.isEmpty()) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find any data!"));
    }
    return ResponseEntity.ok(new UserResponse(rates, user.get()));
  }

  @PostMapping("/user/setup")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userSetup(HttpServletRequest request) {
    String username = jwtUtils.getUserNameFromJwtToken(parseJwt(request));
    return null;
  }

  @PostMapping("/user/expense/add")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userExpense() {
    return null;
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
