package com.digitallibrary.service;

import com.digitallibrary.model.Book;
import com.digitallibrary.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(@NonNull Long id) {
        return bookRepository.findById(id).orElseThrow();
    }

    public Book addBook(@NonNull Book book) {
        return bookRepository.save(book);
    }

    public Book updateBook(@NonNull Long id, @NonNull Book bookDetails) {
        Book book = getBookById(id);
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setIsbn(bookDetails.getIsbn());
        book.setCategory(bookDetails.getCategory());
        book.setTotalCopies(bookDetails.getTotalCopies());
        book.setAvailableCopies(bookDetails.getAvailableCopies());
        return bookRepository.save(book);
    }

    public void deleteBook(@NonNull Long id) {
        bookRepository.deleteById(id);
    }
}
