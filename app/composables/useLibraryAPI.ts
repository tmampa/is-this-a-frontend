// API service for library management
import type {
  Book,
  Student,
  BorrowedBook,
  BorrowBookData,
  ReturnBookData,
} from "~/types/books";

const API_BASE = "http://localhost:8080/api/admin";

export const LibraryAPI = {
  // Books API
  async getBooks(): Promise<Book[]> {
    try {
      return await $fetch<Book[]>(`${API_BASE}/books`);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      throw error;
    }
  },

  async getAvailableBooks(): Promise<Book[]> {
    try {
      const books = await this.getBooks();
      return books;
    } catch (error) {
      console.error("Failed to fetch available books:", error);
      throw error;
    }
  },

  // Students API
  async getStudents(): Promise<Student[]> {
    try {
      const students = await $fetch<Student[]>(`${API_BASE}/students`);
      console.log("API response - students:", students);
      return students;
    } catch (error) {
      console.error("Failed to fetch students:", error);
      throw error;
    }
  },

  async createStudent(studentData: {
    firstNames: string;
    lastName: string;
    email: string;
    address: string;
    parents: { name: string; email: string; relationship: string }[];
  }): Promise<Student> {
    try {
      const response = await $fetch<Student>(`${API_BASE}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      });
      console.log("Student created:", response);
      return response;
    } catch (error) {
      console.error("Failed to create student:", error);
      throw error;
    }
  },

  async updateStudent(
    studentId: string,
    studentData: {
      firstNames: string;
      lastName: string;
      email: string;
      address: string;
      parents: { name: string; email: string; relationship: string }[];
    }
  ): Promise<Student> {
    try {
      const response = await $fetch<Student>(
        `${API_BASE}/students/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );
      console.log("Student updated:", response);
      return response;
    } catch (error) {
      console.error("Failed to update student:", error);
      throw error;
    }
  },

  // Borrow Records API
  async getBorrowRecords(): Promise<BorrowedBook[]> {
    try {
      return await $fetch<BorrowedBook[]>(`${API_BASE}/borrow-records`);
    } catch (error) {
      console.error("Failed to fetch borrow records:", error);
      throw error;
    }
  },

  // Create Borrow Record
  async createBorrowRecord(
    bookTitle: string,
    data: BorrowBookData
  ): Promise<number> {
    try {
      const requestPayload = {
        fullName: data.fullName,
        studentNumber: data.studentNumber,
        emails: data.emails,
        address: data.address,
        bookCondition: data.bookCondition,
      };

      const response = await $fetch<{ id: number }>(
        `${API_BASE}/books/borrow/${encodeURIComponent(bookTitle)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );

      console.log("borrow record created: ", response);

      return response.id;
    } catch (error) {
      console.error("Failed to create borrow record:", error);
      throw error;
    }
  },

  // Upload Images for Borrow Record
  async uploadImages(recordId: number, images: File[]): Promise<void> {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append("images", image);
      });

      await $fetch(`${API_BASE}/books/upload-images/${recordId}`, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Failed to upload images:", error);
      throw error;
    }
  },

  // Return Book (if API exists)
  async returnBook(data: ReturnBookData): Promise<void> {
    try {
      // This endpoint may need to be created on the backend
      await $fetch(`${API_BASE}/books/return/${data.borrowedBookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnDate: data.returnDate,
          conditionNotes: data.conditionNotes,
          afterConditionImages: data.afterConditionImages.map(
            (file) => file.name
          ),
        }),
      });
    } catch (error) {
      console.error("Failed to return book:", error);
      throw error;
    }
  },
};
