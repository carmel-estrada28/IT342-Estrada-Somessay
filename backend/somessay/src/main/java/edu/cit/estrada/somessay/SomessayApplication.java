package edu.cit.estrada.somessay;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SomessayApplication {
	public static void main(String[] args) {
		SpringApplication.run(SomessayApplication.class, args);
	}
}