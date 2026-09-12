package com.digitallibrary.service;

import com.digitallibrary.model.User;
import com.digitallibrary.repository.TransactionRepository;
import com.digitallibrary.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public UserService(UserRepository userRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Delete all transactions for this user first
        transactionRepository.deleteByUser(Objects.requireNonNull(user));
        userRepository.delete(Objects.requireNonNull(user));
    }
}
