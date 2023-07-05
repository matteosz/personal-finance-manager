package com.pfm.sbjwt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SPSecurityJWTApp {
  public static void main(String[] args) {
    SpringApplication.run(SPSecurityJWTApp.class, args);
  }
}
