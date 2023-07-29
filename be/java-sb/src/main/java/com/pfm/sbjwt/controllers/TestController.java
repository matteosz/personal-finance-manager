package com.pfm.sbjwt.controllers;

import com.pfm.sbjwt.components.ExchangeRateUpdater;
import com.pfm.sbjwt.models.Asset;
import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.models.Expense;
import com.pfm.sbjwt.models.Income;
import com.pfm.sbjwt.models.User;
import com.pfm.sbjwt.models.WalletEntry;
import com.pfm.sbjwt.models.WalletOrigin;
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
import com.pfm.sbjwt.payload.response.models.WalletNetwork;
import com.pfm.sbjwt.repository.AssetRepository;
import com.pfm.sbjwt.repository.ExpenseRepository;
import com.pfm.sbjwt.repository.IncomeRepository;
import com.pfm.sbjwt.repository.UserRepository;
import com.pfm.sbjwt.repository.WalletDetailsRepository;
import com.pfm.sbjwt.repository.WalletOriginRepository;
import com.pfm.sbjwt.security.jwt.JwtUtils;
import com.pfm.sbjwt.services.ExchangeRateService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.antlr.v4.runtime.misc.Pair;
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

  private final WalletDetailsRepository walletDetailsRepository;

  private final WalletOriginRepository walletOriginRepository;

  private final ExpenseRepository expenseRepository;

  private final IncomeRepository incomeRepository;

  private final AssetRepository assetRepository;

  @Autowired
  public TestController(
      ExchangeRateService exchangeRateService,
      ExchangeRateUpdater exchangeRateUpdater,
      JwtUtils jwtUtils,
      UserRepository userRepository,
      WalletDetailsRepository walletDetailsRepository,
      WalletOriginRepository walletOriginRepository,
      ExpenseRepository expenseRepository,
      IncomeRepository incomeRepository,
      AssetRepository assetRepository) {
    this.exchangeRateService = exchangeRateService;
    this.exchangeRateUpdater = exchangeRateUpdater;
    this.jwtUtils = jwtUtils;
    this.userRepository = userRepository;
    this.walletDetailsRepository = walletDetailsRepository;
    this.walletOriginRepository = walletOriginRepository;
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

    // Check if the wallet must be prolonged to a new month
    Optional<LocalDate> latestWalletDate = walletDetailsRepository.getLatestDateByUser(user);
    LocalDate today = LocalDate.now();
    if (latestWalletDate.isPresent() && latestWalletDate.get().getMonth() != today.getMonth()) {
      LocalDate newDate = today.minusDays(today.getDayOfMonth() - 1);
      List<WalletEntry> prolongedEntries =
          walletDetailsRepository.getWalletEntriesByDateEqualsAndUser(latestWalletDate.get(), user);
      prolongedEntries.forEach(
          entry -> walletDetailsRepository.save(new WalletEntry(newDate, entry)));
    }

    return ResponseEntity.ok(new UserResponse(exchangeRates, user));
  }

  @PostMapping("/user/setup")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userSetup(
      @Valid @RequestBody SetupRequest setupRequest, HttpServletRequest request) {
    final User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    final LocalDate newStartDate = setupRequest.getStartDate();
    final List<WalletEntry> newWalletEntries =
        setupRequest.getEntries().entrySet().stream()
            .map(entry -> new WalletEntry(user, newStartDate, entry.getKey(), entry.getValue()))
            .toList();
    final List<WalletEntry> prevWalletEntries = user.getWalletEntries();

    List<WalletEntry> finalWalletEntries;
    if (!prevWalletEntries.isEmpty()) {
      // A wallet was already set, need to modify it, for every timespan affected
      LocalDate prevStartDate =
          prevWalletEntries.stream()
              .map(WalletEntry::getDate)
              .min(LocalDate::compareTo)
              .orElseThrow();

      finalWalletEntries = new ArrayList<>();
      for (LocalDate date = newStartDate; !date.isEqual(prevStartDate); date = date.plusMonths(1)) {
        final LocalDate finalDate = date;
        finalWalletEntries.addAll(
            newWalletEntries.stream().map(entry -> new WalletEntry(finalDate, entry)).toList());
      }
      // Save the new ones
      if (!finalWalletEntries.isEmpty()) {
        walletDetailsRepository.saveAll(finalWalletEntries);
      }

      // Modify the previous ones
      // Compute the offset w.r.t old origin points
      List<WalletOrigin> prevOrigins = user.getWalletOrigin();
      Map<String, BigDecimal> newOrigins =
          WalletNetwork.groupByDate(newWalletEntries).get(newStartDate);
      Map<String, Float> offsets = new HashMap<>();
      for (WalletOrigin origin : prevOrigins) {
        offsets.put(
            origin.getCurrencyCode(),
            newOrigins.get(origin.getCurrencyCode()).floatValue()
                - origin.getAmount().floatValue());
      }

      Map<LocalDate, Map<String, Pair<BigDecimal, Long>>> groupedEntries =
          WalletNetwork.groupByDateWithId(prevWalletEntries);
      for (Map.Entry<LocalDate, Map<String, Pair<BigDecimal, Long>>> entry :
          groupedEntries.entrySet()) {
        entry
            .getValue()
            .forEach(
                (key, value) -> {
                  BigDecimal newValue = BigDecimal.valueOf(value.a.floatValue() + offsets.get(key));
                  walletDetailsRepository.modifyEntryById(value.b, newValue);
                  finalWalletEntries.add(new WalletEntry(user, entry.getKey(), key, newValue));
                });
      }
      walletOriginRepository.deleteAllByUser(user);
    } else {
      // Ensure to fill up until today
      List<WalletEntry> prolongedEntries = new ArrayList<>();
      LocalDate firstOfMonth = LocalDate.now().minusDays(LocalDate.now().getDayOfMonth() - 1);
      for (LocalDate date = newStartDate.plusMonths(1);
          !date.isAfter(firstOfMonth);
          date = date.plusMonths(1)) {
        LocalDate finalDate = date;
        newWalletEntries.forEach(entry -> prolongedEntries.add(new WalletEntry(finalDate, entry)));
      }
      finalWalletEntries = new ArrayList<>(newWalletEntries);
      finalWalletEntries.addAll(prolongedEntries);
      walletDetailsRepository.saveAll(finalWalletEntries);
    }

    walletOriginRepository.saveAll(newWalletEntries.stream().map(WalletOrigin::new).toList());
    return ResponseEntity.ok(
        new SetupResponse(new WalletNetwork(finalWalletEntries, newStartDate)));
  }

  @PostMapping("/user/expense/add")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userExpenseAdd(
      @Valid @RequestBody AddExpenseRequest addExpenseRequest, HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    // Get the expense from the request
    Expense expense = addExpenseRequest.buildExpense(user);
    expenseRepository.save(expense);

    Entry entry =
        new Entry(
            addExpenseRequest.getCurrencyCode(),
            -addExpenseRequest.getAmount(),
            addExpenseRequest.getDate());
    WalletNetwork newWallet = modifyWallet(user, entry);

    return ResponseEntity.ok(new ExpenseResponse(expense, newWallet));
  }

  @PostMapping("/user/income/add")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userIncomeAdd(
      @Valid @RequestBody AddIncomeRequest addIncomeRequest, HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    Income income = addIncomeRequest.buildIncome(user);
    incomeRepository.save(income);

    Entry entry =
        new Entry(
            addIncomeRequest.getCurrencyCode(),
            addIncomeRequest.getAmount(),
            addIncomeRequest.getDate());
    WalletNetwork newWallet = modifyWallet(user, entry);

    return ResponseEntity.ok(new IncomeResponse(income, newWallet));
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

    Float offset = addAssetRequest.getToBePurchased() ? 0.f : asset.getAmount().floatValue();
    // Modify the wallet with the new asset
    WalletNetwork newWallet =
        modifyWallet(user, new Entry(asset.getCurrencyCode(), offset, addAssetRequest.getDate()));

    return ResponseEntity.ok(new AssetResponse(new AssetNetwork(asset), newWallet));
  }

  @PostMapping("/user/expense/modify")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userExpenseModify(
      @Valid @RequestBody ModifyExpenseRequest modifyExpenseRequest, HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    ExpenseNetwork expense = modifyExpenseRequest.getExpense();
    Entry entry;
    if (modifyExpenseRequest.getDelete()) {
      Long id = expense.getId();
      expenseRepository.removeExpenseById(id);
      entry =
          new Entry(expense.getCurrencyCode(), expense.getAmount().floatValue(), expense.getDate());
      expense = new ExpenseNetwork(id);
    } else {
      BigDecimal oldAmount = expenseRepository.getExpenseById(expense.getId()).getAmount();
      expenseRepository.modifyExpenseById(
          expense.getId(),
          expense.getDate(),
          expense.getCurrencyCode(),
          expense.getCategory(),
          expense.getSubCategory(),
          expense.getDescription(),
          expense.getAmount());
      entry =
          new Entry(
              expense.getCurrencyCode(),
              -expense.getAmount().floatValue() + oldAmount.floatValue(),
              expense.getDate());
    }

    WalletNetwork newWallet = modifyWallet(user, entry);

    return ResponseEntity.ok(new ExpenseResponse(expense, newWallet));
  }

  @PostMapping("/user/income/modify")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userIncomeModify(
      @Valid @RequestBody ModifyIncomeRequest modifyIncomeRequest, HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    IncomeNetwork income = modifyIncomeRequest.getIncome();
    Entry entry;
    if (modifyIncomeRequest.getDelete()) {
      Long id = income.getId();
      incomeRepository.removeIncomeById(id);
      entry =
          new Entry(income.getCurrencyCode(), -income.getAmount().floatValue(), income.getDate());
      income = new IncomeNetwork(id);
    } else {
      BigDecimal oldAmount = incomeRepository.getIncomeById(income.getId()).getAmount();
      incomeRepository.modifyIncomeById(
          income.getId(),
          income.getDate(),
          income.getCurrencyCode(),
          income.getCategory(),
          income.getSubCategory(),
          income.getDescription(),
          income.getAmount());
      entry =
          new Entry(
              income.getCurrencyCode(),
              income.getAmount().floatValue() - oldAmount.floatValue(),
              income.getDate());
    }

    WalletNetwork newWallet = modifyWallet(user, entry);

    return ResponseEntity.ok(new IncomeResponse(income, newWallet));
  }

  @PostMapping("/user/asset/modify")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
  public ResponseEntity<?> userAssetModify(
      @Valid @RequestBody ModifyAssetRequest modifyAssetRequest, HttpServletRequest request) {
    User user = getUserFromRequest(request);
    if (user == null) {
      return ResponseEntity.badRequest().body(new MessageResponse("Can't find user data!"));
    }

    AssetNetwork asset = modifyAssetRequest.getAsset();
    Asset oldAsset = assetRepository.getAssetById(asset.getId());
    Entry entry;
    if (modifyAssetRequest.getDelete()) {
      Long id = asset.getId();
      assetRepository.removeAssetById(id);
      entry = new Entry(asset.getCurrencyCode(), -asset.getAmount().floatValue(), asset.getDate());
      asset = new AssetNetwork(id);
    } else {
      // Consider the floating prices later
      BigDecimal oldAmount = oldAsset.getAmount();
      asset = modifyAssetRequest.getAsset();
      assetRepository.modifyAssetById(
          asset.getId(),
          asset.getDate(),
          asset.getCurrencyCode(),
          asset.getCategory(),
          asset.getDescription(),
          asset.getIdentifierCode(),
          asset.getAmount());
      entry =
          new Entry(
              asset.getCurrencyCode(),
              asset.getAmount().floatValue() - oldAmount.floatValue(),
              asset.getDate());
    }

    WalletNetwork newWallet = modifyWallet(user, entry);

    return ResponseEntity.ok(new AssetResponse(asset, newWallet));
  }

  private WalletNetwork modifyWallet(User user, Entry transaction) {
    List<WalletEntry> newWalletEntries = new ArrayList<>();

    Map<LocalDate, Map<String, Pair<BigDecimal, Long>>> oldWalletEntries =
        WalletNetwork.groupByDateWithId(user.getWalletEntries());

    Float currentOffset = transaction.getOffset();

    // Dates are sorted in the map (tree map)
    for (Map.Entry<String, Pair<BigDecimal, Long>> entry :
        oldWalletEntries.get(transaction.getDate()).entrySet()) {
      WalletEntry walletEntry;
      if (entry.getKey().equals(transaction.getCurrency())) {
        BigDecimal newAmount = BigDecimal.valueOf(entry.getValue().a.floatValue() + currentOffset);
        walletDetailsRepository.modifyEntryById(entry.getValue().b, newAmount);
        walletEntry = new WalletEntry(user, transaction.getDate(), entry.getKey(), newAmount);
      } else {
        walletEntry =
            new WalletEntry(user, transaction.getDate(), entry.getKey(), entry.getValue().a);
      }
      newWalletEntries.add(walletEntry);
    }

    return new WalletNetwork(newWalletEntries);
  }

  private User getUserFromRequest(HttpServletRequest request) {
    String username = jwtUtils.getUserNameFromJwtToken(request);

    Optional<User> user = userRepository.findByUsername(username);
    if (user.isEmpty()) {
      return null;
    }
    return user.get();
  }

  private static class Entry {
    private final String currency;
    private final Float offset;

    private final LocalDate date;

    public Entry(String currency, Float offset, LocalDate date) {
      this.currency = currency;
      this.offset = offset;
      this.date = date;
    }

    public String getCurrency() {
      return currency;
    }

    public Float getOffset() {
      return offset;
    }

    public LocalDate getDate() {
      return date;
    }
  }
}
