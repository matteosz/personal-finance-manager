package com.pfm.sbjwt.components;

import static com.pfm.sbjwt.constants.Constants.FILTER;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.pfm.sbjwt.models.ExchangeRate;
import com.pfm.sbjwt.services.ExchangeRateService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ExchangeRateUpdater {
  private final ExchangeRateService exchangeRateService;

  @Value("${pfm.app.apiRatesId}")
  private String apiID;

  @Autowired
  public ExchangeRateUpdater(ExchangeRateService exchangeRateService) {
    this.exchangeRateService = exchangeRateService;
  }

  @Scheduled(cron = "20 20 * * * ?") // Runs every day at 20:20
  public List<ExchangeRate> updateExchangeRates() {
    LocalDateTime timestamp = LocalDateTime.now();
    List<ExchangeRate> exchangeRates = fetchExchangeRatesFromExternalAPI(timestamp);
    exchangeRateService.saveOrUpdateExchangeRates(exchangeRates, timestamp);
    return exchangeRates;
  }

  @NonNull
  private List<ExchangeRate> fetchExchangeRatesFromExternalAPI(LocalDateTime timestamp) {
    String apiUrl = String.format("https://openexchangerates.org/api/latest.json?app_id=%s", apiID);
    List<ExchangeRate> rates = new ArrayList<>();

    // Make the HTTP request to the API
    RestTemplate restTemplate = new RestTemplate();
    ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);

    if (response.getStatusCode().is2xxSuccessful()) {
      // Extract exchange rates from the JSON response
      JsonObject jsonObject =
          JsonParser.parseString(Objects.requireNonNull(response.getBody())).getAsJsonObject();
      JsonObject ratesObject = jsonObject.getAsJsonObject("rates");

      // Filter the currency of interest and populate the list
      ratesObject.keySet().stream()
          .filter(FILTER::contains)
          .forEach(
              currency ->
                  rates.add(
                      new ExchangeRate(
                          currency, ratesObject.get(currency).getAsFloat(), timestamp)));
    }

    return rates;
  }
}
