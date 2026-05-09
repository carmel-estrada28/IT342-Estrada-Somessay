package edu.cit.estrada.somessay.feature.quote;

import edu.cit.estrada.somessay.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/quotes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class QuoteController {

    private final QuoteService quoteService;

    @GetMapping("/random")
    public ResponseEntity<ApiResponse> getRandomQuote() {
        return ResponseEntity.ok(quoteService.getRandomQuote());
    }
}