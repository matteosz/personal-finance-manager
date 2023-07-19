package com.pfm.sbjwt.controllers;

import com.pfm.sbjwt.components.ExchangeRateUpdater;
import com.pfm.sbjwt.models.Asset;
import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.models.Expense;
import com.pfm.sbjwt.models.Income;
import com.pfm.sbjwt.models.InitialState;
import com.pfm.sbjwt.models.User;
import com.pfm.sbjwt.payload.request.AddAssetRequest;
import com.pfm.sbjwt.payload.request.AddExpenseRequest;
import com.pfm.sbjwt.payload.request.AddIncomeRequest;
import com.pfm.sbjwt.payload.request.ModifyAssetRequest;
import com.pfm.sbjwt.payload.request.ModifyExpenseRequest;
import com.pfm.sbjwt.payload.request.ModifyIncomeRequest;
import com.pfm.sbjwt.payload.request.SetupRequest;
import com.pfm.sbjwt.payload.response.AssetResponse;
import com.pfm.sbjwt.payload.response.ExpenseResponse;
import com.pfm.sbjwt.payload.response.IncomeResponse;
import com.pfm.sbjwt.payload.response.MessageResponse;
import com.pfm.sbjwt.payload.response.SetupResponse;
import com.pfm.sbjwt.payload.response.UserResponse;
import com.pfm.sbjwt.payload.response.models.AssetNetwork;
import com.pfm.sbjwt.payload.response.models.ExpenseNetwork;
import com.pfm.sbjwt.payload.response.models.IncomeNetwork;
import com.pfm.sbjwt.payload.response.models.InitialStateNetwork;
import com.pfm.sbjwt.repository.AssetRepository;
import com.pfm.sbjwt.repository.ExpenseRepository;
import com.pfm.sbjwt.repository.IncomeRepository;
import com.pfm.sbjwt.repository.InitialStateRepository;
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

  private final InitialStateRepository initialStateRepository;

  private final ExpenseRepository expenseRepository;

  private final IncomeRepository incomeRepository;

  private final AssetRepository assetRepository;

  @Autowired
  public TestController(
      ExchangeRateService exchangeRateService,
      ExchangeRateUpdater exchangeRateUpdater,
      JwtUtils jwtUtils,
      UserRepository userRepository,
      InitialStateRepository initialStateRepository,
      ExpenseRepository expenseRepository,
      IncomeRepository incomeRepository,
      AssetRepository assetRepository) {
    this.exchangeRateService = exchangeRateService;
    this.exchangeRateUpdater = exchangeRateUpdater;
    this.jwtUtils = jwtUtils;
    this.userRepository = userRepository;
    this.initialStateRepository = initialStateRepository;
    this.expenseRepository = expenseRepository;
    this.incomeRepository = incomeRepository;
    this.assetRepository = assetRepository;
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userAccess(HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    List<ExchangeRate> exchangeRates = exchangeRateService.getRates();
    // Force the update of exchange rates if none is present (bootstrapping)
    if (exchangeRates.isEmpty()) {
      exchangeRates = exchangeRateUpdater.updateExchangeRates();
    }

    return ResponseEntity.ok(new UserResponse(exchangeRates, user));
  }

  @PostMapping("/user/setup")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userSetup(
      @Valid @RequestBody SetupRequest setupRequest, HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    BigDecimal amount = setupRequest.getValue();
    LocalDate startDate = setupRequest.getStartDate();
    InitialState initialState = user.getInitialState();
    if (initialState != null) {
      initialStateRepository.modifyInitialStateById(initialState.getId(), startDate, amount);
      initialState.setValues(startDate, amount);
    } else {
      // Set the amount for the username
      initialState = new InitialState(user, amount, startDate);
      initialStateRepository.save(initialState);
    }

    return ResponseEntity.ok(new SetupResponse(new InitialStateNetwork(initialState)));
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

  @PostMapping("/user/asset/add")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userAssetAdd(
      @Valid @RequestBody AddAssetRequest addAssetRequest, HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    Asset asset = addAssetRequest.buildAsset(user);
    assetRepository.save(asset);

    return ResponseEntity.ok(new AssetResponse(new AssetNetwork(asset)));
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

  @PostMapping("/user/asset/modify")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userAssetModify(
      @Valid @RequestBody ModifyAssetRequest modifyAssetRequest) {
    AssetNetwork asset;
    if (modifyAssetRequest.getDelete()) {
      Long id = modifyAssetRequest.getAsset().getId();
      assetRepository.removeAssetById(id);
      asset = new AssetNetwork(id);
    } else {
      asset = modifyAssetRequest.getAsset();
      assetRepository.modifyAssetById(
          asset.getId(),
          asset.getDate(),
          asset.getCurrencyCode(),
          asset.getCategory(),
          asset.getDescription(),
          asset.getIdentifierCode(),
          asset.getAmount());
    }

    return ResponseEntity.ok(new AssetResponse(asset));
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
