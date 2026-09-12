package com.digitallibrary.controller;

import com.digitallibrary.model.Transaction;
import com.digitallibrary.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/issue")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<Transaction> issueBook(@RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        Long bookId = request.get("bookId");

        if (userId == null || bookId == null) {
            throw new IllegalArgumentException("userId and bookId cannot be null");
        }

        return ResponseEntity.ok(transactionService.issueBook(userId, bookId));
    }

    @PostMapping("/return/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Transaction> returnBook(@PathVariable @org.springframework.lang.NonNull Long id) {
        return ResponseEntity.ok(transactionService.returnBook(id));
    }

    @PostMapping("/pay-fine/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Transaction> payFine(@PathVariable @org.springframework.lang.NonNull Long id) {
        return ResponseEntity.ok(transactionService.payFine(id));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<List<Transaction>> getTransactionsByUser(
            @PathVariable @org.springframework.lang.NonNull Long userId) {
        return ResponseEntity.ok(transactionService.getTransactionsByUser(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTransaction(@PathVariable @org.springframework.lang.NonNull Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
