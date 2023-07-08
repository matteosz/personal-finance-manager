package com.pfm.sbjwt.constants;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class Constants {
  /** Supported currencies */
  public static final Set<String> FILTER = Set.of("EUR", "CHF", "USD", "GBP");

  /** Supported categories and sub-categories */
  public static final Map<String, List<String>> EXPENSE_CATEGORIES =
      Map.of(
          "Education",
          List.of("Tuition fees", "Books", "Services"),
          "Health",
          List.of("Medicines", "Visit"),
          "Personal expenses",
          List.of("Clothes", "Tech hardware"),
          "Sport",
          List.of("Gym"),
          "Transportation",
          List.of("Fuel", "Public transportation"),
          "Travelling",
          List.of("Transportation", "Accommodation", "Food", "Activities", "Tickets"),
          "Housing",
          List.of("Rent"),
          "Insurance",
          List.of(""),
          "Bank",
          List.of("CC fees", "Investment fees", "Operational fees"),
          "Other",
          List.of());

  public static final Map<String, List<String>> INCOME_CATEGORIES = Map.of();

  public static final Map<String, List<String>> ASSET_CATEGORIES = Map.of();
}
