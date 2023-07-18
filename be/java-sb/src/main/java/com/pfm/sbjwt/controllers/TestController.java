package com.pfm.sbjwt.controllers;

import com.pfm.sbjwt.components.ExchangeRateUpdater;
import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.models.Expense;
import com.pfm.sbjwt.models.Income;
import com.pfm.sbjwt.models.NetWorth;
import com.pfm.sbjwt.models.User;
import com.pfm.sbjwt.payload.request.AddExpenseRequest;
import com.pfm.sbjwt.payload.request.AddIncomeRequest;
import com.pfm.sbjwt.payload.request.ModifyExpenseRequest;
import com.pfm.sbjwt.payload.request.ModifyIncomeRequest;
import com.pfm.sbjwt.payload.request.SetupRequest;
import com.pfm.sbjwt.payload.response.ExpenseResponse;
import com.pfm.sbjwt.payload.response.IncomeResponse;
import com.pfm.sbjwt.payload.response.MessageResponse;
import com.pfm.sbjwt.payload.response.SetupResponse;
import com.pfm.sbjwt.payload.response.UserResponse;
import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;
import com.pfm.sbjwt.payload.response.models.IncomeNetwork;
import com.pfm.sbjwt.payload.response.models.NetWorthNetwork;
import com.pfm.sbjwt.repository.ExpenseRepository;
import com.pfm.sbjwt.repository.IncomeRepository;
import com.pfm.sbjwt.repository.NetWorthRepository;
import com.pfm.sbjwt.repository.UserRepository;
import com.pfm.sbjwt.security.jwt.JwtUtils;
import com.pfm.sbjwt.services.ExchangeRateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
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

  private final ExchangeRateService exchangeRateService;

  private final ExchangeRateUpdater exchangeRateUpdater;

  private final JwtUtils jwtUtils;

  private final UserRepository userRepository;

  private final NetWorthRepository netWorthRepository;

  private final ExpenseRepository expenseRepository;

  private final IncomeRepository incomeRepository;

  @Autowired
  public TestController(
      ExchangeRateService exchangeRateService,
      ExchangeRateUpdater exchangeRateUpdater,
      JwtUtils jwtUtils,
      UserRepository userRepository,
      NetWorthRepository netWorthRepository,
      ExpenseRepository expenseRepository,
      IncomeRepository incomeRepository) {
    this.exchangeRateService = exchangeRateService;
    this.exchangeRateUpdater = exchangeRateUpdater;
    this.jwtUtils = jwtUtils;
    this.userRepository = userRepository;
    this.netWorthRepository = netWorthRepository;
    this.expenseRepository = expenseRepository;
    this.incomeRepository = incomeRepository;
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userAccess(HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

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
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    BigDecimal amount = BigDecimal.valueOf(setupRequest.getAmount());
    NetWorth netWorth = user.getNetWorth();
    if (netWorth != null) {
      // Delete old net worth
      netWorthRepository.modifyNetWorthById(netWorth.getId(), netWorth.getStartDate(), amount);
      netWorth.setValue(amount);
    } else {
      // Set the amount for the username
      LocalDate date = LocalDate.now();
      netWorth = new NetWorth(user, amount, date);
      netWorthRepository.save(netWorth);
    }

    return ResponseEntity.ok(new SetupResponse(new NetWorthNetwork(netWorth)));
  }

  @PostMapping("/user/expense/add")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userExpenseAdd(
      @Valid @RequestBody AddExpenseRequest[] addExpenseRequests, HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    // Get the expense from the request
    List<Expense> expenses =
        Arrays.stream(addExpenseRequests)
            .map(addExpenseRequest -> addExpenseRequest.buildExpense(user))
            .toList();
    expenseRepository.saveAll(expenses);

    return ResponseEntity.ok(new ExpenseResponse(expenses));
  }

  @PostMapping("/user/income/add")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userIncomeAdd(
      @Valid @RequestBody AddIncomeRequest[] addIncomeRequests, HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    List<Income> incomes =
        Arrays.stream(addIncomeRequests)
            .map(addIncomeRequest -> addIncomeRequest.buildIncome(user))
            .toList();
    incomeRepository.saveAll(incomes);

    return ResponseEntity.ok(new IncomeResponse(incomes));
  }

  @PostMapping("/user/expense/modify")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userExpenseModify(
      @Valid @RequestBody ModifyExpenseRequest modifyExpenseRequest) {
    ExpenseNetwork expense;
    if (modifyExpenseRequest.getDelete()) {
      Long id = modifyExpenseRequest.getExpense().getId();
      expenseRepository.removeExpenseById(id);
      expense = new ExpenseNetwork(id);
    } else {
      expense = modifyExpenseRequest.getExpense();
      expenseRepository.modifyExpenseById(
          expense.getId(),
          expense.getDate(),
          expense.getCurrencyCode(),
          expense.getCategory(),
          expense.getSubCategory(),
          expense.getDescription(),
          expense.getAmount());
    }

    return ResponseEntity.ok(new ExpenseResponse(expense));
  }

  @PostMapping("/user/income/modify")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userIncomeModify(
      @Valid @RequestBody ModifyIncomeRequest modifyIncomeRequest) {
    IncomeNetwork income;
    if (modifyIncomeRequest.getDelete()) {
      Long id = modifyIncomeRequest.getIncome().getId();
      incomeRepository.removeIncomeById(id);
      income = new IncomeNetwork(id);
    } else {
      income = modifyIncomeRequest.getIncome();
      incomeRepository.modifyIncomeById(
          income.getId(),
          income.getDate(),
          income.getCurrencyCode(),
          income.getCategory(),
          income.getSubCategory(),
          income.getDescription(),
          income.getAmount());
    }

    return ResponseEntity.ok(new IncomeResponse(income));
  }

  private User getUserFromRequest(HttpServletRequest request) {
    String username = jwtUtils.getUserNameFromJwtToken(request);

    Optional<User> user = userRepository.findByUsername(username);
    if (user.isEmpty()) {
      return null;
    }
    return user.get();
  }
}
