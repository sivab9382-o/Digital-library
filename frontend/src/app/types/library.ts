export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  genre: string;
  status: 'available' | 'issued' | 'reserved';
  qrCode: string;
  coverImage?: string;
  publishYear: number;
  issuedTo?: string;
  dueDate?: Date;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  studentId: string;
  password: string;
  role: 'student' | 'admin';
  qrCode: string;
  booksIssued: string[];
  maxBooksAllowed: number;
}

export interface Transaction {
  id: string;
  bookId: string;
  memberId: string;
  type: 'issue' | 'return' | 'renew';
  date: Date;
  dueDate?: Date;
  returnDate?: Date;
  fine?: number;
  finePaid?: boolean;
}

export interface AuthState {
  user: Member | null;
  isAuthenticated: boolean;
}
