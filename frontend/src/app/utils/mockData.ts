import { Book, Member, Transaction } from '@/app/types/library';

export const mockBooks: Book[] = [
  {
    id: '1',
    isbn: '978-0-13-468599-1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    genre: 'Computer Science',
    status: 'available',
    qrCode: 'BOOK-978-0-13-468599-1',
    publishYear: 2009,
  },
  {
    id: '2',
    isbn: '978-0-596-52068-7',
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    genre: 'Programming',
    status: 'available',
    qrCode: 'BOOK-978-0-596-52068-7',
    publishYear: 2008,
  },
  {
    id: '3',
    isbn: '978-0-134-68599-8',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Software Engineering',
    status: 'issued',
    qrCode: 'BOOK-978-0-134-68599-8',
    publishYear: 2008,
    issuedTo: '2',
    dueDate: new Date('2026-01-26'),
  },
  {
    id: '4',
    isbn: '978-0-321-12742-6',
    title: 'Design Patterns',
    author: 'Erich Gamma',
    genre: 'Software Engineering',
    status: 'available',
    qrCode: 'BOOK-978-0-321-12742-6',
    publishYear: 1994,
  },
  {
    id: '5',
    isbn: '978-1-449-35573-9',
    title: 'Learning Python',
    author: 'Mark Lutz',
    genre: 'Programming',
    status: 'available',
    qrCode: 'BOOK-978-1-449-35573-9',
    publishYear: 2013,
  },
];

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@library.com',
    studentId: 'ADMIN001',
    password: 'admin123',
    role: 'admin',
    qrCode: 'MEMBER-ADMIN001',
    booksIssued: [],
    maxBooksAllowed: 10,
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@student.com',
    studentId: 'STU001',
    password: 'student123',
    role: 'student',
    qrCode: 'MEMBER-STU001',
    booksIssued: ['3'],
    maxBooksAllowed: 3,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    bookId: '3',
    memberId: '2',
    type: 'issue',
    date: new Date('2026-01-12'),
    dueDate: new Date('2026-01-26'),
  },
];

// Initialize local storage with mock data
export const initializeStorage = () => {
  if (!localStorage.getItem('library_books')) {
    localStorage.setItem('library_books', JSON.stringify(mockBooks));
  }
  if (!localStorage.getItem('library_members')) {
    localStorage.setItem('library_members', JSON.stringify(mockMembers));
  }
  if (!localStorage.getItem('library_transactions')) {
    localStorage.setItem('library_transactions', JSON.stringify(mockTransactions));
  }
};

export const getBooks = (): Book[] => {
  const books = localStorage.getItem('library_books');
  return books ? JSON.parse(books) : mockBooks;
};

export const getMembers = (): Member[] => {
  const members = localStorage.getItem('library_members');
  return members ? JSON.parse(members) : mockMembers;
};

export const getTransactions = (): Transaction[] => {
  const transactions = localStorage.getItem('library_transactions');
  return transactions ? JSON.parse(transactions) : mockTransactions;
};

export const saveBooks = (books: Book[]) => {
  localStorage.setItem('library_books', JSON.stringify(books));
};

export const saveMembers = (members: Member[]) => {
  localStorage.setItem('library_members', JSON.stringify(members));
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem('library_transactions', JSON.stringify(transactions));
};
