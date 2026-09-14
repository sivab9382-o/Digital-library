import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/components/AuthContext';
import { Book, Transaction } from '@/app/types/library';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { LogOut, Search, BookOpen, User, QrCode, Smartphone, History, Clock, CheckCircle2, ScanLine } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { QRScanner } from '@/app/components/QRScanner';
import { toast } from 'sonner';
import { getBooks, getTransactions, saveBooks, saveTransactions } from '@/app/utils/mockData';
import { ShareAppQRModal } from '@/app/components/ShareAppQRModal';
import { CollectionShowcaseModal } from '@/app/components/CollectionShowcaseModal';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState('all');
  const [showQR, setShowQR] = useState(false);
  const [showAppQR, setShowAppQR] = useState(false);
  const [showShowcaseModal, setShowShowcaseModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    fetchBooks();
    fetchTransactions();
  }, []);

  const fetchBooks = async () => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
    const token = localStorage.getItem('token');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(`${API_BASE}/books`, {
        signal: controller.signal,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Bypass-Tunnel-Reminder': 'true'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Failed to fetch books from server');
      const data = await response.json();

      const mappedBooks: Book[] = data.map((b: any) => ({
        id: b.id.toString(),
        isbn: b.isbn,
        title: b.title,
        author: b.author,
        genre: b.category,
        publishYear: 2024,
        status: b.availableCopies > 0 ? 'available' : 'issued',
        qrCode: `BOOK-${b.id}`,
        coverImage: b.imageUrl
      }));

      setBooks(mappedBooks);
      setFilteredBooks(mappedBooks);
      saveBooks(mappedBooks);
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn("API books unavailable, using local library storage", error);
      const localBooks = getBooks();
      setBooks(localBooks);
      setFilteredBooks(localBooks);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(`${API_BASE}/transactions/user/${user.id}`, {
        signal: controller.signal,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Bypass-Tunnel-Reminder': 'true'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Failed to fetch transactions from server');
      const data = await response.json();

      const mappedTransactions = data.map((t: any) => ({
        id: t.id,
        bookId: t.book.id.toString(),
        memberId: t.user.id.toString(),
        type: t.status === 'ISSUED' ? 'issue' : 'return',
        date: t.issueDate,
        dueDate: t.dueDate,
        returnDate: t.returnDate,
        status: t.status
      }));

      setTransactions(mappedTransactions.reverse());
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('API transactions unavailable, using local transactions', error);
      const localTrans = getTransactions();
      const userTrans = localTrans.filter(t => t.memberId === user.id.toString());
      setTransactions(userTrans);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = (data: string) => {
    const book = books.find((b: Book) => b.qrCode === data || b.id === data);

    if (book) {
      setShowScanner(false);
      handleIssueBook(book);
    } else {
      toast.error('Invalid book QR code');
    }
  };

  const handleIssueBook = async (book: Book) => {
    if (!user) return;

    if (activeTransactions.some(t => t.bookId === book.id)) {
      toast.error("You already have this book issued");
      return;
    }

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8082/api';
    const token = localStorage.getItem('token');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const response = await fetch(`${API_BASE}/transactions/issue`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Bypass-Tunnel-Reminder': 'true'
        },
        body: JSON.stringify({
          userId: parseInt(user.id) || 1,
          bookId: parseInt(book.id) || 1
        })
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        toast.success(`Book "${book.title}" issued successfully`);
        fetchBooks();
        fetchTransactions();
        return;
      }
    } catch {
      clearTimeout(timeoutId);
    }

    // Local fallback issuance
    const newTrans: Transaction = {
      id: Date.now().toString(),
      bookId: book.id,
      memberId: user.id.toString(),
      type: 'issue',
      date: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    };
    const allTrans = getTransactions();
    saveTransactions([newTrans, ...allTrans]);
    const updatedBooks = books.map(b => b.id === book.id ? { ...b, status: 'issued' as const } : b);
    saveBooks(updatedBooks);
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    setTransactions([newTrans, ...transactions]);
    toast.success(`Book "${book.title}" issued successfully`);
  };

  useEffect(() => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.isbn.includes(searchQuery)
      );
    }

    if (filterGenre !== 'all') {
      filtered = filtered.filter((book) => book.genre === filterGenre);
    }

    setFilteredBooks(filtered);
  }, [searchQuery, filterGenre, books]);

  const genres = Array.from(new Set(books.map((b) => b.genre)));
  const activeTransactions = transactions.filter(t => t.type === 'issue' && !t.returnDate);
  const myBooks = books.filter((b) => activeTransactions.some(t => t.bookId === b.id));

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
                <p className="text-sm text-muted-foreground">Student Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShowcaseModal(true)}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                <BookOpen className="mr-1.5 h-4 w-4" />
                Collections Showcase ({genres.length})
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAppQR(true)} className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                <Smartphone className="mr-1.5 h-4 w-4" />
                Share App QR
              </Button>
              <Button onClick={() => setShowScanner(true)}>
                <ScanLine className="mr-2 h-4 w-4" />
                Scan & Borrow
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowQR(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                My QR Code
              </Button>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTransactions.length}</div>
              <p className="text-xs text-muted-foreground">
                Limit: {user?.maxBooksAllowed} books
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Borrows</CardTitle>
              <History className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">Lifetime activity</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Favorite Genre</CardTitle>
              <Search className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold truncate">
                {(() => {
                  const genreCounts: Record<string, number> = {};
                  transactions.forEach(t => {
                    const book = books.find(b => b.id === t.bookId);
                    if (book) {
                      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
                    }
                  });
                  const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
                  return topGenre ? topGenre[0] : 'None';
                })()}
              </div>
              <p className="text-xs text-muted-foreground">Most borrowed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Library Quality</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{books.length}</div>
              <p className="text-xs text-muted-foreground">Total books available</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="books" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
            <TabsTrigger value="books">
              <BookOpen className="mr-2 h-4 w-4" />
              Books
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-6">
            {/* My Books */}
            {myBooks.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">My Books</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myBooks.map((book) => (
                    <Card key={book.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{book.title}</CardTitle>
                        <CardDescription>{book.author}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {book.coverImage && (
                          <div className="mb-4 flex justify-center group">
                            <div className="relative w-28 h-40 bg-muted rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gray-100">
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
                                    img.nextElementSibling?.classList.remove('hidden');
                                    img.src = 'https://images.unsplash.com/photo-1543005157-865a5d63e9f?w=200&h=300&auto=format&fit=crop&q=60';
                                  }
                                }}
                              />
                              <BookOpen className="h-12 w-12 text-primary/20 absolute inset-0 m-auto z-0" />
                            </div>
                          </div>
                        )}
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-semibold">ISBN:</span> {book.isbn}
                          </p>
                          <p>
                            <span className="font-semibold">Genre:</span> {book.genre}
                          </p>
                          {book.dueDate && (
                            <p>
                              <span className="font-semibold">Due:</span>{' '}
                              {new Date(book.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4"
                          onClick={() => setSelectedBook(book)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or ISBN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterGenre} onValueChange={setFilterGenre}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Books List */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Available Books</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBooks.map((book) => (
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
                        <Badge
                          variant={book.status === 'available' ? 'default' : 'secondary'}
                        >
                          {book.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-semibold">ISBN:</span> {book.isbn}
                        </p>
                        <p>
                          <span className="font-semibold">Genre:</span> {book.genre}
                        </p>
                        <p>
                          <span className="font-semibold">Year:</span> {book.publishYear}
                        </p>
                        {book.status === 'issued' && book.dueDate && (
                          <p className="text-xs text-muted-foreground">
                            Expected return: {new Date(book.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => setSelectedBook(book)}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>My Borrowing History</CardTitle>
                <CardDescription>View your recent book issues and returns</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => {
                      const book = books.find((b) => b.id === transaction.bookId);
                      const isReturned = transaction.status === 'RETURNED';
                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${!isReturned ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                              }`}>
                              {!isReturned ? (
                                <Clock className="h-5 w-5" />
                              ) : (
                                <CheckCircle2 className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold">{book?.title || 'Unknown Book'}</p>
                              <p className="text-sm text-muted-foreground">
                                Borrowed on {new Date(transaction.date).toLocaleDateString()}
                                {isReturned && transaction.returnDate && ` • Returned on ${new Date(transaction.returnDate).toLocaleDateString()}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            {!isReturned && transaction.dueDate && (
                              <p className="text-orange-600 font-medium">
                                Due: {new Date(transaction.dueDate).toLocaleDateString()}
                              </p>
                            )}
                            <Badge variant={!isReturned ? 'default' : 'secondary'}>
                              {!isReturned ? 'Currently Borrowed' : 'Returned'}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No transactions found. Start borrowing!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>My QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-lg">
              {user && <QRCode value={user.qrCode} size={200} />}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.studentId}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Book Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-primary/5 p-6 rounded-xl flex flex-col sm:flex-row items-center gap-6 border border-primary/10 shadow-inner">
              <div className="relative w-32 h-48 bg-white p-2 rounded-lg shadow-xl shrink-0 group">
                {selectedBook?.coverImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={selectedBook.coverImage}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover rounded-sm transition-transform duration-500 group-hover:scale-105"
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.nextElementSibling?.classList.add('hidden');
                      }}
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (img.src.includes('openlibrary.org') && selectedBook) {
                          img.src = `https://books.google.com/books/content?vid=ISBN${selectedBook.isbn}&printsec=frontcover&img=1&zoom=2`;
                        } else {
                          img.nextElementSibling?.classList.remove('hidden');
                          img.src = 'https://images.unsplash.com/photo-1543005157-865a5d63e9f?w=200&h=300&auto=format&fit=crop&q=60';
                        }
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-sm z-0">
                      <BookOpen className="h-12 w-12 text-primary/20" />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted rounded-sm">
                    <BookOpen className="h-12 w-12 text-primary/20" />
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-primary mb-1">{selectedBook?.title}</h3>
                <p className="text-lg font-medium text-gray-700">{selectedBook?.author}</p>
                <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                  <Badge variant="outline" className="bg-white/50">{selectedBook?.genre}</Badge>
                  <Badge variant={selectedBook?.status === 'available' ? 'default' : 'secondary'}>{selectedBook?.status}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">ISBN</p>
                <p className="font-medium">{selectedBook?.isbn}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Published Year</p>
                <p className="font-medium">{selectedBook?.publishYear}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Status</p>
                <Badge variant={selectedBook?.status === 'available' ? 'default' : 'secondary'}>
                  {selectedBook?.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">Physical Book</p>
              </div>
            </div>

            {selectedBook?.qrCode && (
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-white mt-4">
                <QRCode value={selectedBook.qrCode} size={150} />
                <p className="text-xs text-muted-foreground mt-2">Scan to Borrow</p>
              </div>
            )}

            {selectedBook?.status === 'available' && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  To borrow this book, please visit the librarian counter and scan the book's QR code or your member ID.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Scanner Dialog */}
      {showScanner && (
        <Dialog open={showScanner} onOpenChange={setShowScanner}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Scan Book to Borrow</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              <div className="bg-primary/10 p-4 rounded-lg mb-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Scan the QR code of the book you want to borrow.
                </p>
              </div>
              <QRScanner
                onScan={handleScan}
                onClose={() => setShowScanner(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Share Library Link QR Dialog */}
      <ShareAppQRModal
        isOpen={showAppQR}
        onClose={() => setShowAppQR(false)}
      />

      {/* Collections Showcase Modal */}
      <CollectionShowcaseModal
        isOpen={showShowcaseModal}
        onClose={() => setShowShowcaseModal(false)}
      />
    </div>
  );
};
