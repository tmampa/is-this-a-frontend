export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  status: "available" | "borrowed";
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  borrowedBooks: string[];
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  studentId: string;
  bookTitle: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  status: "borrowed" | "returned";
  beforeConditionImages: string[];
  afterConditionImages: string[];
  returnDate?: string;
  conditionNotes?: string;
}

export interface BorrowBookData {
  studentId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  beforeConditionImages: File[];
}

export interface ReturnBookData {
  borrowedBookId: string;
  returnDate: string;
  afterConditionImages: File[];
  conditionNotes?: string;
}
