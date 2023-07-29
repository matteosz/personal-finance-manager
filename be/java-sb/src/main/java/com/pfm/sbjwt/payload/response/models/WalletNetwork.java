package com.pfm.sbjwt.payload.response.models;

import com.pfm.sbjwt.models.WalletEntry;
import jakarta.validation.constraints.NotEmpty;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import org.antlr.v4.runtime.misc.Pair;

public class WalletNetwork {

  private final LocalDate startDate;

  private final Map<LocalDate, Map<String, BigDecimal>> keyPoints;

  public WalletNetwork(@NotEmpty List<WalletEntry> entries) {
    this(
        entries,
        entries.stream().map(WalletEntry::getDate).min(LocalDate::compareTo).orElseThrow());
  }

  public WalletNetwork(@NotEmpty List<WalletEntry> entries, LocalDate startDate) {
    this.startDate = startDate;
    this.keyPoints = groupByDate(entries);
  }

  public static Map<LocalDate, Map<String, BigDecimal>> groupByDate(
      @NotEmpty List<WalletEntry> entries) {
    Map<LocalDate, Map<String, BigDecimal>> points = new TreeMap<>(LocalDate::compareTo);
    for (WalletEntry entry : entries) {
      // Create or retrieve the inner map for the current date
      Map<String, BigDecimal> currencyAmountMap =
          points.computeIfAbsent(entry.getDate(), k -> new HashMap<>());

      // Put the currency code and amount in the inner map
      currencyAmountMap.put(entry.getCurrencyCode(), entry.getAmount());
    }
    return points;
  }

  public static Map<LocalDate, Map<String, Pair<BigDecimal, Long>>> groupByDateWithId(
      @NotEmpty List<WalletEntry> entries) {
    Map<LocalDate, Map<String, Pair<BigDecimal, Long>>> points =
        new TreeMap<>(LocalDate::compareTo);
    for (WalletEntry entry : entries) {
      // Create or retrieve the inner map for the current date
      Map<String, Pair<BigDecimal, Long>> currencyAmountMap =
          points.computeIfAbsent(entry.getDate(), k -> new HashMap<>());

      // Put the currency code and amount in the inner map
      currencyAmountMap.put(entry.getCurrencyCode(), new Pair<>(entry.getAmount(), entry.getId()));
    }
    return points;
  }

  public LocalDate getStartDate() {
    return startDate;
  }

  public Map<LocalDate, Map<String, BigDecimal>> getKeyPoints() {
    return keyPoints;
  }
}
