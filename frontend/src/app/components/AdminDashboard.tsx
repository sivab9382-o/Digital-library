import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/components/AuthContext';
import { Book, Member, Transaction } from '@/app/types/library';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { QRScanner } from '@/app/components/QRScanner';
import { LogOut, BookOpen, Users, PlusCircle, ScanLine, RefreshCw, History } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<'issue' | 'return' | null>(null);
  const [scannedMemberId, setScannedMemberId] = useState<string | null>(null);
  const [scannedBookId, setScannedBookId] = useState<string | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showBookQR, setShowBookQR] = useState<Book | null>(null);
  const [showManualIssue, setShowManualIssue] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberForBooks, setSelectedMemberForBooks] = useState<Member | null>(null);


  const [newBook, setNewBook] = useState({
    isbn: '',
    title: '',
    author: '',
    genre: '',
    publishYear: new Date().getFullYear(),
    imageUrl: ''
  });

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch Books
      const booksRes = await fetch(`${API_BASE}/books`, { headers });
      const booksData = await booksRes.json();

      // Fetch Users (Members)
      const usersRes = await fetch(`${API_BASE}/users`, { headers });
      const usersData = await usersRes.json();

      // Fetch Transactions
      const transactionsRes = await fetch(`${API_BASE}/transactions`, { headers });
      const transactionsData = await transactionsRes.json();

      // Map Transactions & Calculate Issued Books
      const mappedTransactions: Transaction[] = (transactionsData || []).map((t: any) => ({
        id: t.id.toString(),
        bookId: t.book?.id?.toString() || '',
        memberId: t.user?.id?.toString() || '',
        type: t.status === 'ISSUED' ? 'issue' : 'return',
        date: new Date(t.issueDate),
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        returnDate: t.returnDate ? new Date(t.returnDate) : undefined,
        fine: t.fine,
        finePaid: t.finePaid
      })).filter((t: Transaction) => t.bookId && t.memberId);
      setTransactions(mappedTransactions);

      // Map Books and link to transactions
      const mappedBooks: Book[] = (booksData || []).map((b: any) => {
        const activeTransaction = mappedTransactions.find(t => t.bookId === b.id.toString() && !t.returnDate);
        return {
          id: b.id.toString(),
          isbn: b.isbn,
          title: b.title,
          author: b.author,
          genre: b.category,
          publishYear: 2024,
          status: b.availableCopies > 0 ? 'available' : 'issued',
          qrCode: `BOOK-${b.id}`,
          coverImage: b.imageUrl,
          issuedTo: activeTransaction?.memberId
        };
      });
      setBooks(mappedBooks);

      // Map Members
      const mappedMembers: Member[] = (usersData || []).map((u: any) => {
        const activeLoans = mappedTransactions
          .filter((t: Transaction) => t.memberId === u.id.toString() && !t.returnDate)
          .map((t: Transaction) => t.bookId);

        return {
          id: u.id.toString(),
          name: u.username,
          email: u.email,
          studentId: u.id.toString(),
          password: '',
          role: u.role === 'ROLE_ADMIN' ? 'admin' : 'student',
          qrCode: `MEMBER-${u.id}`,
          booksIssued: activeLoans,
          maxBooksAllowed: 5
        };
      });
      setMembers(mappedMembers);

    } catch (error) {
      console.error("Failed to load data", error);
      toast.error("Failed to load library data");
    }
  };

  const handleAddBook = async () => {
    if (!newBook.isbn || !newBook.title || !newBook.author || !newBook.genre) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newBook.title,
          author: newBook.author,
          isbn: newBook.isbn,
          category: newBook.genre,
          totalCopies: 5, // Default
          availableCopies: 5,
          imageUrl: newBook.imageUrl
        })
      });

      if (response.ok) {
        toast.success('Book created');
        setShowAddBook(false);
        setNewBook({ isbn: '', title: '', author: '', genre: '', publishYear: new Date().getFullYear(), imageUrl: '' });
        loadData();
      } else {
        toast.error('Failed to create book');
      }
    } catch (e) {
      toast.error('Error creating book');
    }
  };

  const handleScan = (data: string) => {
    if (!scanMode) return;

    // Identify what was scanned
    const member = members.find((m: Member) =>
      m.qrCode === data || m.id === data || m.studentId === data || m.name === data || data === `MEMBER-${m.id}`
    );
    const book = books.find((b: Book) => b.qrCode === data || b.id === data || data === `BOOK-${b.id}`);

    if (scanMode === 'return') {
      if (book) {
        // Direct return by book scan
        const transaction = transactions.find(t => t.bookId === book.id && !t.returnDate);
        if (transaction) {
          const borrower = members.find(m => m.id === transaction.memberId);
          if (borrower) {
            handleReturnBook(book, borrower);
            closeScanner();
            return;
          }
        }
        toast.error('This book is not currently issued to anyone.');
      } else if (member) {
        setScannedMemberId(member.id);
        toast.info(`Member identified: ${member.name}. Now scan the book to return.`);
      } else {
        toast.error('Invalid QR code. Please scan a book or member QR.');
      }
    } else if (scanMode === 'issue') {
      if (member) {
        if (scannedBookId) {
          const targetBook = books.find(b => b.id === scannedBookId);
          if (targetBook) {
            handleIssueBook(targetBook, member);
            closeScanner();
          }
        } else {
          setScannedMemberId(member.id);
          toast.info(`Member identified: ${member.name}. Now scan the book to issue.`);
        }
      } else if (book) {
        if (book.status !== 'available') {
          toast.error('This book is already issued.');
          return;
        }

        if (scannedMemberId) {
          const targetMember = members.find(m => m.id === scannedMemberId);
          if (targetMember) {
            handleIssueBook(book, targetMember);
            closeScanner();
          }
        } else {
          setScannedBookId(book.id);
          toast.info(`Book identified: ${book.title}. Now scan the member QR to issue.`);
        }
      } else {
        toast.error('Invalid QR code. Please scan a book or member QR.');
      }
    }
  };

  const closeScanner = () => {
    setShowScanner(false);
    setScanMode(null);
    setScannedMemberId(null);
    setScannedBookId(null);
  };

  const handleIssueBook = async (book: Book, member: Member) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/transactions/issue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: parseInt(member.id),
          bookId: parseInt(book.id)
        })
      });

      if (response.ok) {
        toast.success(`Book "${book.title}" issued to ${member.name}`);
        loadData();
      } else {
        toast.error('Failed to issue book');
      }
    } catch (e) {
      toast.error('Error issuing book');
    }
  };

  const handleReturnBook = async (book: Book, member: Member) => {
    // Find active transaction
    // Frontend mapped transactions contain memberId and bookId
    // We need the ACTUAL backend Transaction ID
    // Our mapped transactions store backend ID as `id`
    const transaction = transactions.find((t: Transaction) =>
      t.bookId === book.id && t.memberId === member.id && !t.returnDate
    );

    if (!transaction) {
      toast.error("No active transaction found for this book and user");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/transactions/return/${transaction.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedTransaction = await response.json();
        if (updatedTransaction.fine > 0 && !updatedTransaction.finePaid) {
          if (confirm(`Fine of ${updatedTransaction.fine} incurred. Mark as paid now?`)) {
            await fetch(`${API_BASE}/transactions/pay-fine/${updatedTransaction.id}`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Book returned and fine of ${updatedTransaction.fine} paid`);
          } else {
            toast.warning(`Book returned. Fine of ${updatedTransaction.fine} is pending.`);
          }
        } else {
          toast.success(`Book "${book.title}" returned`);
        }
        loadData();
      } else {
        toast.error('Failed to return book');
      }
    } catch (e) {
      toast.error('Error returning book');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to remove this book?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/books/${bookId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Book removed successfully');
        loadData();
      } else {
        toast.error('Failed to remove book');
      }
    } catch (e) {
      toast.error('Error removing book');
    }
  };


  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member? This will also remove all their transaction history.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/users/${memberId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Member removed successfully');
        loadData();
      } else {
        toast.error('Failed to remove member');
      }
    } catch (e) {
      toast.error('Error removing member');
    }
  };

  const startIssue = () => {
    setScanMode('issue');
    setScannedMemberId(null);
    setScannedBookId(null);
    setShowScanner(true);
  };

  const startReturn = () => {
    setScanMode('return');
    setScannedMemberId(null);
    setScannedBookId(null);
    setShowScanner(true);
  };

  const activeLoansCount = transactions.filter(t => t.type === 'issue' && !t.returnDate).length;
  const stats = {
    totalBooks: books.length,
    availableBooks: books.length - activeLoansCount,
    issuedBooks: activeLoansCount,
    totalMembers: members.filter((m: Member) => m.role === 'student').length,
    totalTransactions: transactions.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Digital Library</h1>
                <p className="text-sm text-muted-foreground">Admin Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{user?.role}</Badge>
              <span className="text-sm font-medium">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBooks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <BookOpen className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableBooks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Issued</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.issuedBooks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Scan QR codes to issue or return books</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={startIssue}>
              <ScanLine className="mr-2 h-4 w-4" />
              Issue Book
            </Button>
            <Button variant="secondary" onClick={startReturn}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Return Book
            </Button>
            <Dialog open={showManualIssue} onOpenChange={setShowManualIssue}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manual Issue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manual Book Issue</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Select Student</Label>
                    <select
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedMemberId}
                      onChange={(e) => setSelectedMemberId(e.target.value)}
                    >
                      <option value="">Select a student...</option>
                      {members.filter(m => m.role === 'student').map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.studentId})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Select Book</Label>
                    <select
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={selectedBookId}
                      onChange={(e) => setSelectedBookId(e.target.value)}
                    >
                      <option value="">Select a book...</option>
                      {books.filter(b => b.status === 'available').map(b => (
                        <option key={b.id} value={b.id}>{b.title} - {b.isbn}</option>
                      ))}
                    </select>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      const book = books.find(b => b.id === selectedBookId);
                      const member = members.find(m => m.id === selectedMemberId);
                      if (book && member) {
                        handleIssueBook(book, member);
                        setShowManualIssue(false);
                        setSelectedBookId('');
                        setSelectedMemberId('');
                      } else {
                        toast.error('Please select both a student and a book');
                      }
                    }}
                  >
                    Confirm Issue
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showAddBook} onOpenChange={setShowAddBook}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Book
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={newBook.isbn}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBook({ ...newBook, isbn: e.target.value })}
                      placeholder="978-0-13-468599-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newBook.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBook({ ...newBook, title: e.target.value })}
                      placeholder="Book Title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={newBook.author}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBook({ ...newBook, author: e.target.value })}
                      placeholder="Author Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={newBook.genre}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBook({ ...newBook, genre: e.target.value })}
                      placeholder="Genre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Publish Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newBook.publishYear}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBook({ ...newBook, publishYear: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={newBook.imageUrl}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewBook({ ...newBook, imageUrl: e.target.value })}
                      placeholder="https://example.com/book-cover.jpg"
                    />
                  </div>
                  <Button onClick={handleAddBook} className="w-full">Add Book</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="books" className="space-y-4">
          <TabsList>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search books by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.filter(b =>
                b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.isbn.includes(searchQuery)
              ).map((book: Book) => (
                <Card key={book.id} className="group hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base line-clamp-2">{book.title}</CardTitle>
                        <CardDescription className="line-clamp-1">{book.author}</CardDescription>
                      </div>
                      <div className="relative w-20 h-28 bg-muted rounded-md overflow-hidden flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 border border-gray-100 shrink-0">
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onLoad={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.nextElementSibling?.classList.add('hidden');
                            }}
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              if (img.src.includes('openlibrary.org')) {
                                img.src = `https://books.google.com/books/content?vid=ISBN${book.isbn}&printsec=frontcover&img=1&zoom=2`;
                              } else {
                                img.style.display = 'none';
                                img.nextElementSibling?.classList.remove('hidden');
                                img.parentElement?.classList.add('bg-gradient-to-br', 'from-primary/10', 'to-primary/20');
                              }
                            }}
                          />
                        ) : null}
                        <BookOpen className="h-8 w-8 text-primary/20 absolute z-0" />
                      </div>
                      <Badge variant={book.status === 'available' ? 'default' : 'secondary'}>
                        {book.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-3">
                      <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
                      <p><span className="font-semibold">Genre:</span> {book.genre}</p>
                      {book.issuedTo && (
                        <p className="text-xs text-muted-foreground">
                          Issued to: {members.find((m: Member) => m.id === book.issuedTo)?.name}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setShowBookQR(book)}
                      >
                        QR Code
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.filter((m: Member) => m.role === 'student').map((member: Member) => (
                <Card key={member.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <CardDescription>{member.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p><span className="font-semibold">Student ID:</span> {member.studentId}</p>
                    <p><span className="font-semibold">Books Issued:</span> {member.booksIssued.length}</p>
                    <p><span className="font-semibold">Max Allowed:</span> {member.maxBooksAllowed}</p>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedMemberForBooks(member)}
                      >
                        Books Issued
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {transactions.slice().reverse().map((transaction: Transaction) => {
                const book = books.find((b: Book) => b.id === transaction.bookId);
                const member = members.find((m: Member) => m.id === transaction.memberId);
                return (
                  <Card key={transaction.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{book?.title}</p>
                          <p className="text-sm text-muted-foreground">{member?.name}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge variant={transaction.type === 'issue' ? 'default' : 'secondary'}>
                            {transaction.type}
                          </Badge>
                          {transaction.fine && transaction.fine > 0 && (
                            <div className="mt-1">
                              <Badge variant={transaction.finePaid ? "outline" : "destructive"}>
                                Fine: {transaction.fine} {transaction.finePaid ? '(Paid)' : '(Unpaid)'}
                              </Badge>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(transaction.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>


        </Tabs>
      </div>

      {/* QR Scanner Dialog */}
      {
        showScanner && (
          <Dialog open={showScanner} onOpenChange={(open: boolean) => {
            setShowScanner(open);
            if (!open) {
              closeScanner();
            }
          }}>
            <DialogContent>
              <div className="mb-4">
                <div className="bg-primary/10 p-4 rounded-lg mb-4 text-center">
                  <p className="font-bold text-lg text-primary">
                    {scanMode === 'issue' ? 'Issuing Book' : 'Returning Book'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {!scannedMemberId ? 'Step 1: Scan Member QR' : 'Step 2: Scan Book QR'}
                  </p>
                  {scannedMemberId && (
                    <p className="text-xs font-semibold mt-1 text-green-600">
                      Member: {members.find((m: Member) => m.id === scannedMemberId)?.name}
                    </p>
                  )}
                </div>
                <QRScanner
                  onScan={handleScan}
                  onClose={closeScanner}
                />
              </div>
            </DialogContent>
          </Dialog>
        )
      }

      {/* Book QR Dialog */}
      {
        showBookQR && (
          <Dialog open={!!showBookQR} onOpenChange={() => setShowBookQR(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{showBookQR.title}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <QRCode value={showBookQR.qrCode} size={200} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">ISBN: {showBookQR.isbn}</p>
                  <p className="text-xs text-muted-foreground">{showBookQR.author}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      }

      {/* Issued Books Detail Dialog */}
      {
        selectedMemberForBooks && (
          <Dialog open={!!selectedMemberForBooks} onOpenChange={() => setSelectedMemberForBooks(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Books Issued to {selectedMemberForBooks.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedMemberForBooks.booksIssued.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {selectedMemberForBooks.booksIssued.map((bookId) => {
                      const book = books.find((b) => b.id === bookId);
                      const transaction = transactions.find(
                        (t) => t.bookId === bookId && t.memberId === selectedMemberForBooks.id && !t.returnDate
                      );
                      return (
                        <div key={bookId} className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/5 p-2 rounded">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{book?.title || 'Unknown Book'}</p>
                              <p className="text-xs text-muted-foreground">{book?.author}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-[10px]">
                              Due: {transaction?.dueDate ? new Date(transaction.dueDate).toLocaleDateString() : 'N/A'}
                            </Badge>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Issued: {transaction?.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No books currently issued to this member.</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )
      }
    </div >
  );
};
