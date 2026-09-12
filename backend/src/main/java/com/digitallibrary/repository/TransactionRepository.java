package com.digitallibrary.repository;

import com.digitallibrary.model.Transaction;
import com.digitallibrary.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUser(User user);

    List<Transaction> findByStatus(String status);

    void deleteByUser(User user);
}
