export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  publisher: string;
  pages: number;
  language: string;
  price: number;
  grade: number;
  status: "available" | "borrowed";
  category: string;
  description?: string;
}

export interface Email {
  name: string;
  relationship: string;
  email: string;
}

export interface Student {
  id: string;
  fullName: string;
  firstNames?: string;
  lastName?: string;
  studentNumber: number;
  email: string;
  address?: string;
  parents?: { name: string; email: string; relationship: string }[];
  borrowedBooks: string[];
  outstandingFines?: number; // in ZAR
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  studentId: string;
  studentNumber: number;
  bookTitle: string;
  studentName: string;
  borrowDate: string;
  dueDate: string; // Due date for the borrowed book
  returnDate?: string;
  status: "borrowed" | "returned";
  initialConditions: string[];
  images: string[];
  afterConditionImages: string[];
  returnConditions?: string[];
  conditionNotes?: string;
  barcode?: string; // Barcode scanned when book was issued to student
  returnTags?: string[];
}

export interface BorrowBookData {
  fullName: string;
  studentNumber: number;
  emails: Email[];
  address: string;
  bookConditions: string[];
  beforeConditionImages: File[];
  dueDate: string;
  barcode: string; // Barcode scanned during book borrowing
}

export interface ReturnBookData {
  borrowedBookId: number;
  studentNumber: number;
  returnConditions: string[];
  afterConditionImages: File[];
  bookTitle: string;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "librarian";
}

export interface AuthResponse {
  user: User;
  access_token: string;
  expiresIn: number;
}
