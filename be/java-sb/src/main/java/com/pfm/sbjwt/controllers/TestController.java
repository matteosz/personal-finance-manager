package com.pfm.sbjwt.controllers;

import static com.pfm.sbjwt.security.jwt.AuthTokenFilter.parseJwt;

import com.pfm.sbjwt.components.ExchangeRateUpdater;
import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.models.Expense;
import com.pfm.sbjwt.models.NetWorth;
import com.pfm.sbjwt.models.User;
import com.pfm.sbjwt.payload.request.AddExpenseRequest;
import com.pfm.sbjwt.payload.request.SetupRequest;
import com.pfm.sbjwt.payload.response.AddExpenseResponse;
import com.pfm.sbjwt.payload.response.MessageResponse;
import com.pfm.sbjwt.payload.response.SetupResponse;
import com.pfm.sbjwt.payload.response.UserResponse;
import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;
import com.pfm.sbjwt.payload.response.models.NetWorthNetwork;
import com.pfm.sbjwt.repository.ExpenseRepository;
import com.pfm.sbjwt.repository.NetWorthRepository;
import com.pfm.sbjwt.repository.UserRepository;
import com.pfm.sbjwt.security.jwt.JwtUtils;
import com.pfm.sbjwt.services.ExchangeRateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @Autowired NetWorthRepository netWorthRepository;

  @Autowired ExpenseRepository expenseRepository;

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userAccess(HttpServletRequest request) {
    String username = jwtUtils.getUserNameFromJwtToken(parseJwt(request));
    // Find the user content
    Optional<User> optUser = userRepository.findByUsername(username);
    if (optUser.isEmpty()) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find any data!"));
    }
    User user = optUser.get();

    NetWorth netWorth = user.getNetWorth();
    LocalDate startDate = netWorth == null ? LocalDate.of(2000, 1, 1) : netWorth.getStartDate();

    Optional<List<ExchangeRate>> optionExchangeRates =
        exchangeRateService.getRatesAfterDate(startDate);
    List<ExchangeRate> rates;
    // Force the update of exchange rates if none is present (bootstrapping)
    if (optionExchangeRates.isEmpty() || optionExchangeRates.get().isEmpty()) {
      rates = exchangeRateUpdater.updateExchangeRates();
    } else {
      rates = optionExchangeRates.get();
    }

    return ResponseEntity.ok(new UserResponse(rates, user));
  }

  @PostMapping("/user/setup")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userSetup(
      @Valid @RequestBody SetupRequest setupRequest, HttpServletRequest request) {
    String username = jwtUtils.getUserNameFromJwtToken(parseJwt(request));
    BigDecimal amount = BigDecimal.valueOf(setupRequest.getAmount());

    Optional<User> user = userRepository.findByUsername(username);
    if (user.isEmpty()) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user!"));
    }

    // Set the amount for the username
    LocalDate date = LocalDate.now();
    NetWorth netWorth = new NetWorth(user.get(), amount, date);
    netWorthRepository.save(netWorth);

    return ResponseEntity.ok(new SetupResponse(new NetWorthNetwork(netWorth)));
  }

  @PostMapping("/user/expense/add")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userExpense(
      @Valid @RequestBody AddExpenseRequest addExpenseRequest, HttpServletRequest request) {
    String username = jwtUtils.getUserNameFromJwtToken(parseJwt(request));

    Optional<User> user = userRepository.findByUsername(username);
    if (user.isEmpty()) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user!"));
    }

    // Get the expense from the request
    Expense expense = addExpenseRequest.buildExpense(user.get());
    expenseRepository.save(expense);

    return ResponseEntity.ok(new AddExpenseResponse(new ExpenseNetwork(expense)));
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
