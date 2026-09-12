package com.digitallibrary.config;

import com.digitallibrary.model.User;

import com.digitallibrary.model.Book;
import com.digitallibrary.repository.UserRepository;
import com.digitallibrary.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final BookRepository bookRepository;
        private final PasswordEncoder passwordEncoder;

        public DataSeeder(UserRepository userRepository, BookRepository bookRepository,
                        PasswordEncoder passwordEncoder) {
                this.userRepository = userRepository;
                this.bookRepository = bookRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @Override
        public void run(String... args) throws Exception {
                if (userRepository.findByUsername("admin@library.com").isEmpty()) {
                        User admin = new User();
                        admin.setUsername("admin@library.com");
                        admin.setEmail("admin@library.com");
                        admin.setPassword(passwordEncoder.encode("admin123"));
                        admin.setRole("ROLE_ADMIN");
                        userRepository.save(admin);
                        System.out.println("Admin user seeded: admin@library.com");
                }

                if (userRepository.findByUsername("john.doe@student.com").isEmpty()) {
                        User student = new User();
                        student.setUsername("john.doe@student.com");
                        student.setEmail("john.doe@student.com");
                        student.setPassword(passwordEncoder.encode("student123"));
                        student.setRole("ROLE_STUDENT");
                        userRepository.save(student);
                        System.out.println("Student user seeded: john.doe@student.com");
                }

                if (bookRepository.findByIsbn("9781617293986").isEmpty()) { // Check for a new book from the Java Full
                                                                            // Stack collection
                        // CS & Programming
                        createBook("Introduction to Algorithms", "Thomas H. Cormen", "9780262046305",
                                        "Computer Science");
                        createBook("Clean Code", "Robert C. Martin", "9780132350884", "Software Engineering");
                        createBook("The Pragmatic Programmer", "Andrew Hunt", "9780201616224", "Programming");
                        createBook("Head First Java", "Kathy Sierra", "9780596009205", "Programming");
                        createBook("Effective Java", "Joshua Bloch", "9780134685991", "Programming");
                        createBook("Design Patterns", "Erich Gamma", "9780201633610", "Software Engineering");

                        // Romance & Love Stories
                        createBook("Pride and Prejudice", "Jane Austen", "9780141439518", "Romance");
                        createBook("The Notebook", "Nicholas Sparks", "9781455582877", "Romance");

                        // Horror & The Haunted Library
                        createBook("The Shining", "Stephen King", "9780307743657", "Horror");
                        createBook("Dracula", "Bram Stoker", "9780486411095", "Horror");
                        createBook("Nightmare Hall: The Silent Scream", "Diane Hoh", "9780590467148", "Nightmare Hall");
                        createBook("Goosebumps: Welcome to Dead House", "R.L. Stine", "9780439568456", "Goosebumps");

                        // Education & Curriculum
                        createBook("Eloquent JavaScript", "Marijn Haverbeke", "9781593279509", "Education");
                        createBook("A Mind for Numbers", "Barbara Oakley", "9780399165245", "Education");
                        createBook("Methods for Euclidean Geometry", "Owen Byer", "9780883857632", "Learning Math");
                        createBook("The Great Gatsby", "F. Scott Fitzgerald", "9780684830421", "English Curriculum");
                        createBook("The Bridge on the Drina", "Ivo Andrić", "9780226020457", "Croatian Library");

                        // Drama
                        createBook("Hamlet", "William Shakespeare", "9780743477123", "Drama");
                        createBook("Death of a Salesman", "Arthur Miller", "9780140481341", "Drama");

                        // Award Winners
                        createBook("Dune", "Frank Herbert", "9780441013593", "Hugo Awards");
                        createBook("Neuromancer", "William Gibson", "9780441569595", "Nebula Awards");
                        createBook("The Giver", "Lois Lowry", "9780544336261", "Newbery Medal");
                        createBook("Holes", "Louis Sachar", "9780440414803", "Newbery Medal");
                        createBook("Where the Wild Things Are", "Maurice Sendak", "9780060254926", "Caldecott Medal");
                        createBook("The Snowy Day", "Ezra Jack Keats", "9780670653003", "Ezra Jack Keats Award");
                        createBook("The Cat in the Hat", "Dr. Seuss", "9780394800011", "Theodore Seuss Geisel Award");
                        createBook("Her Body and Other Parties", "Carmen Maria Machado", "9781555977887",
                                        "Bisexual Book Awards");
                        createBook("The Marrow Thieves", "Cherie Dimaline", "9781770864863", "Canada Reads");
                        createBook("The Mathematical Universe", "William Dunham", "9781118835876", "Euler Book Prize");
                        createBook("Less", "Andrew Sean Greer", "9780316316125", "Lambda Literary Awards");

                        // Banned & Challenged
                        createBook("Looking for Alaska", "John Green", "9780142402511", "Banned Books");
                        createBook("The Bluest Eye", "Toni Morrison", "9780307278449", "Challenged Books");
                        createBook("Gender Queer", "Maia Kobabe", "9781534312029", "Top 10 Most Challenged");

                        // Series
                        createBook("The Fellowship of the Ring", "J.R.R. Tolkien", "9780547928219",
                                        "Tolkien Collection");
                        createBook("Star Wars: Heir to the Empire", "Timothy Zahn", "9780345528292", "Star Wars");
                        createBook("Into the Void", "Tim Lebbon", "9780345541932", "Science Fiction");
                        createBook("The Way of Kings", "Brandon Sanderson", "9780765365279", "Science Fiction");
                        createBook("Animorphs #1: The Invasion", "K.A. Applegate", "9780545291514", "Animorphs");
                        createBook("Nancy Drew: The Secret of the Old Clock", "Carolyn Keene", "9780448095011",
                                        "Nancy Drew");
                        createBook("Star Trek: Federation", "Judith Reeves-Stevens", "9780671894221", "Star Trek");
                        createBook("Eisenhorn", "Dan Abnett", "9781844161560", "Warhammer 40k");

                        // Author Collections
                        createBook("The Da Vinci Code", "Dan Brown", "9780307474278", "Dan Brown Collection");
                        createBook("Along Came a Spider", "James Patterson", "9780446364195", "James Patterson");
                        createBook("Flowers in the Attic", "V.C. Andrews", "9780671729417", "V.C. Andrews");

                        // Special Collections
                        createBook("The Holy Bible", "Various", "9780310941484", "Bible Collection");
                        createBook("Peanuts Treasury", "Charles M. Schulz", "9781586630683", "Peanuts Collection");
                        createBook("Batman: The Dark Knight Returns", "Frank Miller", "9781563893421",
                                        "Read the Movie");

                        // Java Full Stack
                        createBook("Spring Microservices in Action", "John Carnell", "9781617293986",
                                        "Java Full Stack");
                        createBook("Full Stack Development with Spring Boot 3 and React", "Juha Hinkula",
                                        "9781803233307", "Java Full Stack");
                        createBook("Spring Boot in Action", "Craig Walls", "9781617292545", "Java Full Stack");

                        // Python Full Stack
                        createBook("Flask Web Development", "Miguel Grinberg", "9781491991732", "Python Full Stack");
                        createBook("Django for Beginners", "William S. Vincent", "9781735467719", "Python Full Stack");
                        createBook("Architecture Patterns with Python", "Harry Percival", "9781492052203",
                                        "Python Full Stack");

                        // Data Science
                        createBook("Python for Data Analysis", "Wes McKinney", "9781491957660", "Data Science");
                        createBook("Hands-On Machine Learning", "Aurélien Géron", "9781492032649", "Data Science");
                        createBook("Data Science from Scratch", "Joel Grus", "9781492041139", "Data Science");

                        // AI Tools & Methods
                        createBook("Generative AI on AWS", "Chris Fregly", "9781098145910", "AI Tools");
                        createBook("Artificial Intelligence: A Modern Approach", "Stuart Russell", "9780134610993",
                                        "AI Tools");
                        createBook("Deep Learning", "Ian Goodfellow", "9780262035613", "AI Tools");

                        // History
                        createBook("Sapiens: A Brief History of Humankind", "Yuval Noah Harari", "9780062316097",
                                        "History");
                        createBook("The Guns of August", "Barbara W. Tuchman", "9780345476098", "History");
                        createBook("1776", "David McCullough", "9780743226714", "History");
                        createBook("The Silk Roads", "Peter Frankopan", "9781101912379", "History");

                        System.out.println("Massive library collection seeded successfully!");
                }
        }

        private void createBook(String title, String author, String isbn, String category) {
                Book book = new Book();
                book.setTitle(title);
                book.setAuthor(author);
                book.setIsbn(isbn);
                book.setCategory(category);
                book.setTotalCopies(5);
                book.setAvailableCopies(5);
                // Use Open Library Large covers for high resolution
                book.setImageUrl("https://covers.openlibrary.org/b/isbn/" + isbn + "-L.jpg");
                bookRepository.save(book);
        }
}
