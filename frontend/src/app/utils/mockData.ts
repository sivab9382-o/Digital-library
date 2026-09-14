import { Book, Member, Transaction } from '@/app/types/library';

export interface CollectionInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  color: string;
}

export const LIBRARY_COLLECTIONS: CollectionInfo[] = [
  { id: 'cs-prog', name: 'Computer Science & Software', category: 'Computer Science', description: 'Algorithms, design patterns, clean code and software engineering principles.', color: 'from-blue-600 to-indigo-700' },
  { id: 'fullstack-java', name: 'Java Full Stack Collection', category: 'Java Full Stack', description: 'Spring Boot 3, Microservices, React full stack development.', color: 'from-amber-600 to-red-600' },
  { id: 'fullstack-python', name: 'Python Full Stack Collection', category: 'Python Full Stack', description: 'Django, Flask, and scalable Python architecture patterns.', color: 'from-emerald-600 to-teal-700' },
  { id: 'ai-tools', name: 'Artificial Intelligence & Deep Learning', category: 'AI Tools', description: 'Generative AI, modern AI principles, and deep learning foundations.', color: 'from-purple-600 to-indigo-800' },
  { id: 'data-science', name: 'Data Science & Machine Learning', category: 'Data Science', description: 'Hands-on ML, data analysis with Python, and data science fundamentals.', color: 'from-cyan-600 to-blue-700' },
  { id: 'award-winners', name: 'Prestigious Award Winners', category: 'Award Winners', description: 'Hugo, Nebula, Newbery, and Caldecott award-winning literary masterpieces.', color: 'from-yellow-500 to-amber-600' },
  { id: 'sci-fi-series', name: 'Science Fiction & Epic Series', category: 'Science Fiction', description: 'Tolkien, Star Wars, Warhammer 40k, Star Trek, and Brandon Sanderson.', color: 'from-violet-600 to-purple-700' },
  { id: 'horror', name: 'Haunted Library & Horror', category: 'Horror', description: 'Classic and modern horror tales by Stephen King, Bram Stoker, and Diane Hoh.', color: 'from-red-800 to-slate-900' },
  { id: 'romance', name: 'Romance & Love Stories', category: 'Romance', description: 'Timeless classics and emotional journeys from Jane Austen and Nicholas Sparks.', color: 'from-pink-500 to-rose-600' },
  { id: 'history', name: 'World History & Civilizations', category: 'History', description: 'Sapiens, Pulitzer-prize winning histories, and pivotal historical epochs.', color: 'from-stone-600 to-stone-800' },
  { id: 'banned', name: 'Challenged & Banned Books', category: 'Banned Books', description: 'Thought-provoking, culturally significant, and celebrated literary works.', color: 'from-orange-600 to-rose-700' },
  { id: 'education', name: 'Education & Curriculum', category: 'Education', description: 'Foundational learning, mathematics, and English literature curriculum.', color: 'from-teal-600 to-cyan-700' }
];

export const mockBooks: Book[] = [
  // Computer Science & Programming
  {
    id: '1',
    isbn: '9780262046305',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    genre: 'Computer Science',
    status: 'available',
    qrCode: 'BOOK-9780262046305',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780262046305-L.jpg',
    publishYear: 2009,
  },
  {
    id: '2',
    isbn: '9780132350884',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Software Engineering',
    status: 'issued',
    qrCode: 'BOOK-9780132350884',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
    publishYear: 2008,
    issuedTo: '2',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    isbn: '9780201616224',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    genre: 'Programming',
    status: 'available',
    qrCode: 'BOOK-9780201616224',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg',
    publishYear: 1999,
  },
  {
    id: '4',
    isbn: '9780596009205',
    title: 'Head First Java',
    author: 'Kathy Sierra',
    genre: 'Programming',
    status: 'available',
    qrCode: 'BOOK-9780596009205',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780596009205-L.jpg',
    publishYear: 2005,
  },
  {
    id: '5',
    isbn: '9780134685991',
    title: 'Effective Java',
    author: 'Joshua Bloch',
    genre: 'Programming',
    status: 'available',
    qrCode: 'BOOK-9780134685991',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780134685991-L.jpg',
    publishYear: 2017,
  },
  {
    id: '6',
    isbn: '9780201633610',
    title: 'Design Patterns',
    author: 'Erich Gamma',
    genre: 'Software Engineering',
    status: 'available',
    qrCode: 'BOOK-9780201633610',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg',
    publishYear: 1994,
  },

  // Romance & Love Stories
  {
    id: '7',
    isbn: '9780141439518',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    status: 'available',
    qrCode: 'BOOK-9780141439518',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    publishYear: 1813,
  },
  {
    id: '8',
    isbn: '9781455582877',
    title: 'The Notebook',
    author: 'Nicholas Sparks',
    genre: 'Romance',
    status: 'available',
    qrCode: 'BOOK-9781455582877',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781455582877-L.jpg',
    publishYear: 1996,
  },

  // Horror & The Haunted Library
  {
    id: '9',
    isbn: '9780307743657',
    title: 'The Shining',
    author: 'Stephen King',
    genre: 'Horror',
    status: 'available',
    qrCode: 'BOOK-9780307743657',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg',
    publishYear: 1977,
  },
  {
    id: '10',
    isbn: '9780486411095',
    title: 'Dracula',
    author: 'Bram Stoker',
    genre: 'Horror',
    status: 'available',
    qrCode: 'BOOK-9780486411095',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780486411095-L.jpg',
    publishYear: 1897,
  },
  {
    id: '11',
    isbn: '9780590467148',
    title: 'Nightmare Hall: The Silent Scream',
    author: 'Diane Hoh',
    genre: 'Nightmare Hall',
    status: 'available',
    qrCode: 'BOOK-9780590467148',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780590467148-L.jpg',
    publishYear: 1993,
  },
  {
    id: '12',
    isbn: '9780439568456',
    title: 'Goosebumps: Welcome to Dead House',
    author: 'R.L. Stine',
    genre: 'Goosebumps',
    status: 'available',
    qrCode: 'BOOK-9780439568456',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780439568456-L.jpg',
    publishYear: 1992,
  },

  // Education & Curriculum
  {
    id: '13',
    isbn: '9781593279509',
    title: 'Eloquent JavaScript',
    author: 'Marijn Haverbeke',
    genre: 'Education',
    status: 'available',
    qrCode: 'BOOK-9781593279509',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781593279509-L.jpg',
    publishYear: 2018,
  },
  {
    id: '14',
    isbn: '9780399165245',
    title: 'A Mind for Numbers',
    author: 'Barbara Oakley',
    genre: 'Education',
    status: 'available',
    qrCode: 'BOOK-9780399165245',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780399165245-L.jpg',
    publishYear: 2014,
  },
  {
    id: '15',
    isbn: '9780883857632',
    title: 'Methods for Euclidean Geometry',
    author: 'Owen Byer',
    genre: 'Learning Math',
    status: 'available',
    qrCode: 'BOOK-9780883857632',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780883857632-L.jpg',
    publishYear: 2010,
  },
  {
    id: '16',
    isbn: '9780684830421',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'English Curriculum',
    status: 'available',
    qrCode: 'BOOK-9780684830421',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780684830421-L.jpg',
    publishYear: 1925,
  },
  {
    id: '17',
    isbn: '9780226020457',
    title: 'The Bridge on the Drina',
    author: 'Ivo Andrić',
    genre: 'Croatian Library',
    status: 'available',
    qrCode: 'BOOK-9780226020457',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780226020457-L.jpg',
    publishYear: 1945,
  },

  // Drama
  {
    id: '18',
    isbn: '9780743477123',
    title: 'Hamlet',
    author: 'William Shakespeare',
    genre: 'Drama',
    status: 'available',
    qrCode: 'BOOK-9780743477123',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780743477123-L.jpg',
    publishYear: 1603,
  },
  {
    id: '19',
    isbn: '9780140481341',
    title: 'Death of a Salesman',
    author: 'Arthur Miller',
    genre: 'Drama',
    status: 'available',
    qrCode: 'BOOK-9780140481341',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780140481341-L.jpg',
    publishYear: 1949,
  },

  // Award Winners
  {
    id: '20',
    isbn: '9780441013593',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Hugo Awards',
    status: 'available',
    qrCode: 'BOOK-9780441013593',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780441013593-L.jpg',
    publishYear: 1965,
  },
  {
    id: '21',
    isbn: '9780441569595',
    title: 'Neuromancer',
    author: 'William Gibson',
    genre: 'Nebula Awards',
    status: 'available',
    qrCode: 'BOOK-9780441569595',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780441569595-L.jpg',
    publishYear: 1984,
  },
  {
    id: '22',
    isbn: '9780544336261',
    title: 'The Giver',
    author: 'Lois Lowry',
    genre: 'Newbery Medal',
    status: 'available',
    qrCode: 'BOOK-9780544336261',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780544336261-L.jpg',
    publishYear: 1993,
  },
  {
    id: '23',
    isbn: '9780440414803',
    title: 'Holes',
    author: 'Louis Sachar',
    genre: 'Newbery Medal',
    status: 'available',
    qrCode: 'BOOK-9780440414803',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780440414803-L.jpg',
    publishYear: 1998,
  },
  {
    id: '24',
    isbn: '9780060254926',
    title: 'Where the Wild Things Are',
    author: 'Maurice Sendak',
    genre: 'Caldecott Medal',
    status: 'available',
    qrCode: 'BOOK-9780060254926',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780060254926-L.jpg',
    publishYear: 1963,
  },
  {
    id: '25',
    isbn: '9780670653003',
    title: 'The Snowy Day',
    author: 'Ezra Jack Keats',
    genre: 'Ezra Jack Keats Award',
    status: 'available',
    qrCode: 'BOOK-9780670653003',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780670653003-L.jpg',
    publishYear: 1962,
  },
  {
    id: '26',
    isbn: '9780394800011',
    title: 'The Cat in the Hat',
    author: 'Dr. Seuss',
    genre: 'Theodore Seuss Geisel Award',
    status: 'available',
    qrCode: 'BOOK-9780394800011',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780394800011-L.jpg',
    publishYear: 1957,
  },
  {
    id: '27',
    isbn: '9781555977887',
    title: 'Her Body and Other Parties',
    author: 'Carmen Maria Machado',
    genre: 'Bisexual Book Awards',
    status: 'available',
    qrCode: 'BOOK-9781555977887',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781555977887-L.jpg',
    publishYear: 2017,
  },
  {
    id: '28',
    isbn: '9781770864863',
    title: 'The Marrow Thieves',
    author: 'Cherie Dimaline',
    genre: 'Canada Reads',
    status: 'available',
    qrCode: 'BOOK-9781770864863',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781770864863-L.jpg',
    publishYear: 2017,
  },
  {
    id: '29',
    isbn: '9781118835876',
    title: 'The Mathematical Universe',
    author: 'William Dunham',
    genre: 'Euler Book Prize',
    status: 'available',
    qrCode: 'BOOK-9781118835876',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781118835876-L.jpg',
    publishYear: 1994,
  },
  {
    id: '30',
    isbn: '9780316316125',
    title: 'Less',
    author: 'Andrew Sean Greer',
    genre: 'Lambda Literary Awards',
    status: 'available',
    qrCode: 'BOOK-9780316316125',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780316316125-L.jpg',
    publishYear: 2017,
  },

  // Banned & Challenged Books
  {
    id: '31',
    isbn: '9780142402511',
    title: 'Looking for Alaska',
    author: 'John Green',
    genre: 'Banned Books',
    status: 'available',
    qrCode: 'BOOK-9780142402511',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780142402511-L.jpg',
    publishYear: 2005,
  },
  {
    id: '32',
    isbn: '9780307278449',
    title: 'The Bluest Eye',
    author: 'Toni Morrison',
    genre: 'Challenged Books',
    status: 'available',
    qrCode: 'BOOK-9780307278449',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307278449-L.jpg',
    publishYear: 1970,
  },
  {
    id: '33',
    isbn: '9781534312029',
    title: 'Gender Queer',
    author: 'Maia Kobabe',
    genre: 'Top 10 Most Challenged',
    status: 'available',
    qrCode: 'BOOK-9781534312029',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781534312029-L.jpg',
    publishYear: 2019,
  },

  // Series & Science Fiction
  {
    id: '34',
    isbn: '9780547928219',
    title: 'The Fellowship of the Ring',
    author: 'J.R.R. Tolkien',
    genre: 'Tolkien Collection',
    status: 'available',
    qrCode: 'BOOK-9780547928219',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780547928219-L.jpg',
    publishYear: 1954,
  },
  {
    id: '35',
    isbn: '9780345528292',
    title: 'Star Wars: Heir to the Empire',
    author: 'Timothy Zahn',
    genre: 'Star Wars',
    status: 'available',
    qrCode: 'BOOK-9780345528292',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780345528292-L.jpg',
    publishYear: 1991,
  },
  {
    id: '36',
    isbn: '9780345541932',
    title: 'Into the Void',
    author: 'Tim Lebbon',
    genre: 'Science Fiction',
    status: 'available',
    qrCode: 'BOOK-9780345541932',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780345541932-L.jpg',
    publishYear: 2013,
  },
  {
    id: '37',
    isbn: '9780765365279',
    title: 'The Way of Kings',
    author: 'Brandon Sanderson',
    genre: 'Science Fiction',
    status: 'available',
    qrCode: 'BOOK-9780765365279',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780765365279-L.jpg',
    publishYear: 2010,
  },
  {
    id: '38',
    isbn: '9780545291514',
    title: 'Animorphs #1: The Invasion',
    author: 'K.A. Applegate',
    genre: 'Animorphs',
    status: 'available',
    qrCode: 'BOOK-9780545291514',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780545291514-L.jpg',
    publishYear: 1996,
  },
  {
    id: '39',
    isbn: '9780448095011',
    title: 'Nancy Drew: The Secret of the Old Clock',
    author: 'Carolyn Keene',
    genre: 'Nancy Drew',
    status: 'available',
    qrCode: 'BOOK-9780448095011',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780448095011-L.jpg',
    publishYear: 1930,
  },
  {
    id: '40',
    isbn: '9780671894221',
    title: 'Star Trek: Federation',
    author: 'Judith Reeves-Stevens',
    genre: 'Star Trek',
    status: 'available',
    qrCode: 'BOOK-9780671894221',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780671894221-L.jpg',
    publishYear: 1994,
  },
  {
    id: '41',
    isbn: '9781844161560',
    title: 'Eisenhorn',
    author: 'Dan Abnett',
    genre: 'Warhammer 40k',
    status: 'available',
    qrCode: 'BOOK-9781844161560',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781844161560-L.jpg',
    publishYear: 2004,
  },

  // Author Collections
  {
    id: '42',
    isbn: '9780307474278',
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    genre: 'Dan Brown Collection',
    status: 'available',
    qrCode: 'BOOK-9780307474278',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
    publishYear: 2003,
  },
  {
    id: '43',
    isbn: '9780446364195',
    title: 'Along Came a Spider',
    author: 'James Patterson',
    genre: 'James Patterson',
    status: 'available',
    qrCode: 'BOOK-9780446364195',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780446364195-L.jpg',
    publishYear: 1993,
  },
  {
    id: '44',
    isbn: '9780671729417',
    title: 'Flowers in the Attic',
    author: 'V.C. Andrews',
    genre: 'V.C. Andrews',
    status: 'available',
    qrCode: 'BOOK-9780671729417',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780671729417-L.jpg',
    publishYear: 1979,
  },

  // Special Collections
  {
    id: '45',
    isbn: '9780310941484',
    title: 'The Holy Bible',
    author: 'Various',
    genre: 'Bible Collection',
    status: 'available',
    qrCode: 'BOOK-9780310941484',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780310941484-L.jpg',
    publishYear: 1611,
  },
  {
    id: '46',
    isbn: '9781586630683',
    title: 'Peanuts Treasury',
    author: 'Charles M. Schulz',
    genre: 'Peanuts Collection',
    status: 'available',
    qrCode: 'BOOK-9781586630683',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781586630683-L.jpg',
    publishYear: 2000,
  },
  {
    id: '47',
    isbn: '9781563893421',
    title: 'Batman: The Dark Knight Returns',
    author: 'Frank Miller',
    genre: 'Read the Movie',
    status: 'available',
    qrCode: 'BOOK-9781563893421',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781563893421-L.jpg',
    publishYear: 1986,
  },

  // Java Full Stack
  {
    id: '48',
    isbn: '9781617293986',
    title: 'Spring Microservices in Action',
    author: 'John Carnell',
    genre: 'Java Full Stack',
    status: 'available',
    qrCode: 'BOOK-9781617293986',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781617293986-L.jpg',
    publishYear: 2017,
  },
  {
    id: '49',
    isbn: '9781803233307',
    title: 'Full Stack Development with Spring Boot 3 and React',
    author: 'Juha Hinkula',
    genre: 'Java Full Stack',
    status: 'available',
    qrCode: 'BOOK-9781803233307',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781803233307-L.jpg',
    publishYear: 2023,
  },
  {
    id: '50',
    isbn: '9781617292545',
    title: 'Spring Boot in Action',
    author: 'Craig Walls',
    genre: 'Java Full Stack',
    status: 'available',
    qrCode: 'BOOK-9781617292545',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781617292545-L.jpg',
    publishYear: 2016,
  },

  // Python Full Stack
  {
    id: '51',
    isbn: '9781491991732',
    title: 'Flask Web Development',
    author: 'Miguel Grinberg',
    genre: 'Python Full Stack',
    status: 'available',
    qrCode: 'BOOK-9781491991732',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781491991732-L.jpg',
    publishYear: 2018,
  },
  {
    id: '52',
    isbn: '9781735467719',
    title: 'Django for Beginners',
    author: 'William S. Vincent',
    genre: 'Python Full Stack',
    status: 'available',
    qrCode: 'BOOK-9781735467719',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781735467719-L.jpg',
    publishYear: 2020,
  },
  {
    id: '53',
    isbn: '9781492052203',
    title: 'Architecture Patterns with Python',
    author: 'Harry Percival',
    genre: 'Python Full Stack',
    status: 'available',
    qrCode: 'BOOK-9781492052203',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781492052203-L.jpg',
    publishYear: 2020,
  },

  // Data Science
  {
    id: '54',
    isbn: '9781491957660',
    title: 'Python for Data Analysis',
    author: 'Wes McKinney',
    genre: 'Data Science',
    status: 'available',
    qrCode: 'BOOK-9781491957660',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781491957660-L.jpg',
    publishYear: 2022,
  },
  {
    id: '55',
    isbn: '9781492032649',
    title: 'Hands-On Machine Learning',
    author: 'Aurélien Géron',
    genre: 'Data Science',
    status: 'available',
    qrCode: 'BOOK-9781492032649',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781492032649-L.jpg',
    publishYear: 2022,
  },
  {
    id: '56',
    isbn: '9781492041139',
    title: 'Data Science from Scratch',
    author: 'Joel Grus',
    genre: 'Data Science',
    status: 'available',
    qrCode: 'BOOK-9781492041139',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781492041139-L.jpg',
    publishYear: 2019,
  },

  // AI Tools & Modern AI
  {
    id: '57',
    isbn: '9781098145910',
    title: 'Generative AI on AWS',
    author: 'Chris Fregly',
    genre: 'AI Tools',
    status: 'available',
    qrCode: 'BOOK-9781098145910',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781098145910-L.jpg',
    publishYear: 2023,
  },
  {
    id: '58',
    isbn: '9780134610993',
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell',
    genre: 'AI Tools',
    status: 'available',
    qrCode: 'BOOK-9780134610993',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780134610993-L.jpg',
    publishYear: 2020,
  },
  {
    id: '59',
    isbn: '9780262035613',
    title: 'Deep Learning',
    author: 'Ian Goodfellow',
    genre: 'AI Tools',
    status: 'available',
    qrCode: 'BOOK-9780262035613',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780262035613-L.jpg',
    publishYear: 2016,
  },

  // History & Civilizations
  {
    id: '60',
    isbn: '9780062316097',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'History',
    status: 'available',
    qrCode: 'BOOK-9780062316097',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    publishYear: 2014,
  },
  {
    id: '61',
    isbn: '9780345476098',
    title: 'The Guns of August',
    author: 'Barbara W. Tuchman',
    genre: 'History',
    status: 'available',
    qrCode: 'BOOK-9780345476098',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780345476098-L.jpg',
    publishYear: 1962,
  },
  {
    id: '62',
    isbn: '9780743226714',
    title: '1776',
    author: 'David McCullough',
    genre: 'History',
    status: 'available',
    qrCode: 'BOOK-9780743226714',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9780743226714-L.jpg',
    publishYear: 2005,
  },
  {
    id: '63',
    isbn: '9781101912379',
    title: 'The Silk Roads',
    author: 'Peter Frankopan',
    genre: 'History',
    status: 'available',
    qrCode: 'BOOK-9781101912379',
    coverImage: 'https://covers.openlibrary.org/b/isbn/9781101912379-L.jpg',
    publishYear: 2015,
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
    booksIssued: ['2'],
    maxBooksAllowed: 5,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    bookId: '2',
    memberId: '2',
    type: 'issue',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
];

// Initialize local storage with full collection
export const initializeStorage = (forceReset: boolean = false) => {
  const currentBooks = localStorage.getItem('library_books');
  
  // Auto-upgrade if previous storage had fewer books than full collection (e.g. old 5-book mock)
  if (forceReset || !currentBooks || JSON.parse(currentBooks).length < mockBooks.length) {
    localStorage.setItem('library_books', JSON.stringify(mockBooks));
  }

  if (forceReset || !localStorage.getItem('library_members')) {
    localStorage.setItem('library_members', JSON.stringify(mockMembers));
  }

  if (forceReset || !localStorage.getItem('library_transactions')) {
    localStorage.setItem('library_transactions', JSON.stringify(mockTransactions));
  }
};

export const resetToFullCollection = () => {
  localStorage.setItem('library_books', JSON.stringify(mockBooks));
  return mockBooks;
};

export const getBooks = (): Book[] => {
  const books = localStorage.getItem('library_books');
  if (!books) {
    localStorage.setItem('library_books', JSON.stringify(mockBooks));
    return mockBooks;
  }
  const parsed = JSON.parse(books);
  if (parsed.length < mockBooks.length) {
    localStorage.setItem('library_books', JSON.stringify(mockBooks));
    return mockBooks;
  }
  return parsed;
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
