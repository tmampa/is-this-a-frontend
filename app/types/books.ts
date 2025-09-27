export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  status: "available" | "borrowed";
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
  initialConditions: string[];
  beforeConditionImages: string[];
  afterConditionImages: string[];
  returnDate?: string;
  conditionNotes?: string;
}

export interface BorrowBookData {
  fullName: string;
  studentNumber: number;
  emails: Email[];
  address: string;
  bookConditions: string[];
  beforeConditionImages: File[];
}

export interface ReturnBookData {
  borrowedBookId: string;
  returnDate: string;
  afterConditionImages: File[];
  conditionNotes?: string;
}
