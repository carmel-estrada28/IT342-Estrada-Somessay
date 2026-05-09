package edu.cit.estrada.somessay.feature.quote;

import edu.cit.estrada.somessay.shared.dto.ApiResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class QuoteService {

    private final RestTemplate restTemplate = new RestTemplate();

    public ApiResponse getRandomQuote() {
        try {
            String url = "https://zenquotes.io/api/random";
            List response = restTemplate.getForObject(url, List.class);

            if (response != null && !response.isEmpty()) {
                Map quote = (Map) response.get(0);
                return new ApiResponse("success", null, Map.of(
                        "content", quote.get("q"),
                        "author", quote.get("a")
                ));
            }
            return new ApiResponse("error", "Could not fetch quote.", null);
        } catch (Exception e) {
            System.err.println("Quote API error: " + e.getMessage());
            return new ApiResponse("error", "Quote service unavailable.", null);
        }
    }
}