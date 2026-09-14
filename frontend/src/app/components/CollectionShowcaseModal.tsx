import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Search, BookOpen, Layers, Sparkles, QrCode } from 'lucide-react';
import { Book } from '@/app/types/library';
import { mockBooks, LIBRARY_COLLECTIONS } from '@/app/utils/mockData';
import QRCode from 'react-qr-code';

interface CollectionShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBookToLogin?: (book: Book) => void;
}

export const CollectionShowcaseModal: React.FC<CollectionShowcaseModalProps> = ({
  isOpen,
  onClose,
  onSelectBookToLogin,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [inspectBook, setInspectBook] = useState<Book | null>(null);

  const categories = ['all', ...Array.from(new Set(mockBooks.map((b) => b.genre)))];

  const filteredBooks = mockBooks.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search) ||
      b.genre.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' ||
      b.genre.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 p-6 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-md mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Live Digital Catalog • {mockBooks.length} Curated Books</span>
              </div>
              <DialogTitle className="text-2xl font-bold text-white tracking-tight">
                Digital Library Collections Showcase
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-sm mt-1">
                Explore our full academic, technical, award-winning, and classic book collections with QR code integration.
              </DialogDescription>
            </div>
            <div className="hidden sm:flex flex-col items-end text-right">
              <div className="text-2xl font-extrabold text-white">{LIBRARY_COLLECTIONS.length}</div>
              <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Special Collections</div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all 60+ books by title, author, category, or ISBN..."
              className="pl-10 bg-white/95 text-slate-900 placeholder:text-slate-500 border-none shadow-md h-10 focus-visible:ring-2 focus-visible:ring-white"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="p-3 border-b bg-slate-50 overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                : 'bg-white text-slate-700 border hover:bg-slate-100'
            }`}
          >
            All Collections ({mockBooks.length})
          </button>
          {categories.filter(c => c !== 'all').map((cat) => {
            const count = mockBooks.filter((b) => b.genre === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'bg-white text-slate-700 border hover:bg-slate-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Scrollable Books Grid */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold">No books found matching your query.</p>
              <p className="text-xs text-slate-400 mt-1">Try clearing filters or searching for different keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setInspectBook(book)}
                  className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <Badge variant="outline" className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border-indigo-200">
                        {book.genre}
                      </Badge>
                      <span className="text-[11px] text-slate-400">{book.publishYear}</span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className="relative w-16 h-22 bg-slate-100 rounded-md overflow-hidden shrink-0 shadow-xs group-hover:shadow-sm transition-all border border-slate-200">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (img.src.includes('openlibrary.org')) {
                              img.src = `https://books.google.com/books/content?vid=ISBN${book.isbn}&printsec=frontcover&img=1&zoom=2`;
                            } else {
                              img.style.display = 'none';
                              img.nextElementSibling?.classList.remove('hidden');
                            }
                          }}
                        />
                        <BookOpen className="h-6 w-6 text-slate-300 absolute inset-0 m-auto hidden" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-xs text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {book.author}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                          ISBN: {book.isbn}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 font-medium flex items-center">
                      ● Available (5 copies)
                    </span>
                    <span className="text-indigo-600 font-semibold group-hover:underline flex items-center">
                      <QrCode className="w-3 h-3 mr-0.5" /> Details
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-white border-t flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Showing <b>{filteredBooks.length}</b> of <b>{mockBooks.length}</b> books across <b>{categories.length - 1}</b> collections.</span>
          </div>
          <Button size="sm" onClick={onClose} variant="default" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Done Browsing
          </Button>
        </div>

        {/* Book Inspect Dialog */}
        {inspectBook && (
          <Dialog open={!!inspectBook} onOpenChange={() => setInspectBook(null)}>
            <DialogContent className="max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-900">{inspectBook.title}</DialogTitle>
                <DialogDescription className="text-xs text-slate-500">{inspectBook.author} • {inspectBook.publishYear}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-36 bg-slate-100 rounded-lg overflow-hidden shrink-0 shadow-md border">
                    <img
                      src={inspectBook.coverImage}
                      alt={inspectBook.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = `https://books.google.com/books/content?vid=ISBN${inspectBook.isbn}&printsec=frontcover&img=1&zoom=2`;
                      }}
                    />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">Collection / Genre:</span>
                      <Badge className="ml-1.5 bg-indigo-100 text-indigo-700 border-none font-medium text-[11px]">
                        {inspectBook.genre}
                      </Badge>
                    </div>
                    <p><span className="font-semibold text-slate-700">ISBN-13:</span> <code className="bg-slate-100 px-1 py-0.5 rounded">{inspectBook.isbn}</code></p>
                    <p><span className="font-semibold text-slate-700">Copies Available:</span> <span className="text-emerald-600 font-bold">5 / 5</span></p>
                    <p><span className="font-semibold text-slate-700">Status:</span> Available for immediate borrow</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border flex flex-col items-center justify-center">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Book Issue QR Code</p>
                  <div className="bg-white p-2.5 rounded-lg shadow-xs border">
                    <QRCode value={inspectBook.qrCode} size={130} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">{inspectBook.qrCode}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                    onClick={() => {
                      setInspectBook(null);
                      if (onSelectBookToLogin) {
                        onSelectBookToLogin(inspectBook);
                      }
                      onClose();
                    }}
                  >
                    Login to Borrow Book
                  </Button>
                  <Button variant="outline" className="text-xs" onClick={() => setInspectBook(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};
