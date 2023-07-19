package com.pfm.sbjwt.services;

import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.repository.ExchangeRateRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

@Service
public class ExchangeRateService {
  private final ExchangeRateRepository exchangeRateRepository;

  @Autowired
  public ExchangeRateService(ExchangeRateRepository exchangeRateRepository) {
    this.exchangeRateRepository = exchangeRateRepository;
  }

  /**
   * This function save the new fetched exchange rates and delete the old ones, unless they're the
   * final rates of the month (keep them in that case)
   *
   * @param exchangeRates new fetched exchange rates
   * @param timestamp current timestamp (around 23:59 of each day)
   */
  public void saveOrUpdateExchangeRates(
      List<ExchangeRate> exchangeRates, @NonNull LocalDate timestamp) {
    if (timestamp.getDayOfMonth() != 1) {
      deleteLatestExchangeRates();
    }
    // Save the new exchange rates
    exchangeRates.forEach(this::saveExchangeRate);
  }

  public List<ExchangeRate> getRates() {
    return exchangeRateRepository.getRates();
  }

  @NotNull
  private ExchangeRate saveExchangeRate(ExchangeRate exchangeRate) {
    return exchangeRateRepository.save(exchangeRate);
  }

  public void deleteLatestExchangeRates() {
    Optional<LocalDate> latestTimestamp = exchangeRateRepository.findLatestTimestamp();
    latestTimestamp.ifPresent(exchangeRateRepository::deleteExchangeRatesByTimestamp);
  }
}
