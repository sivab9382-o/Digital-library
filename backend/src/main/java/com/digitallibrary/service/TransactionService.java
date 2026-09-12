package com.digitallibrary.service;

import com.digitallibrary.model.Book;
import com.digitallibrary.model.Transaction;
import com.digitallibrary.model.User;
import com.digitallibrary.repository.BookRepository;
import com.digitallibrary.repository.TransactionRepository;
import com.digitallibrary.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.lang.NonNull;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
            BookRepository bookRepository,
            UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Transaction issueBook(@NonNull Long userId, @NonNull Long bookId) {
        User user = userRepository.findById(userId).orElseThrow();
        Book book = bookRepository.findById(bookId).orElseThrow();

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book not available");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setBook(book);
        transaction.setIssueDate(LocalDateTime.now());
        transaction.setDueDate(LocalDateTime.now().plusDays(30));
        transaction.setStatus("ISSUED");

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction returnBook(@NonNull Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow();

        if ("RETURNED".equals(transaction.getStatus())) {
            throw new RuntimeException("Book already returned");
        }

        Book book = transaction.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        transaction.setReturnDate(LocalDateTime.now());

        if (transaction.getReturnDate().isAfter(transaction.getDueDate())) {
            transaction.setFine(40.0);
            transaction.setFinePaid(false);
        } else {
            transaction.setFine(0.0);
            transaction.setFinePaid(true);
        }

        transaction.setStatus("RETURNED");

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction payFine(@NonNull Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow();
        if (transaction.getFine() > 0) {
            transaction.setFinePaid(true);
        }
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByUser(@NonNull Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return transactionRepository.findByUser(user);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Transactional
    public void deleteTransaction(@NonNull Long id) {
        transactionRepository.deleteById(id);
    }
}
