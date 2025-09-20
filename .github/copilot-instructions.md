Tech Stack

Frontend Framework: Vue 4

Language: TypeScript

Styling: TailwindCSS with DaisyUI

Design Goals: Modern, clean, and responsive UI

Layout Requirements

Admin Dashboard

Sidebar (fixed or collapsible) with navigation links to:

Dashboard/Home

Books

Students

Borrowed Books

Settings

Topbar with:

Search bar (for books and students)

User profile dropdown (profile, settings, logout)

Core Features
Books Management

Admin can:

View list of books (title, author, availability status).

Create new book entries (title, author, category, description, etc.).

Edit or delete existing books.

Add books directly from the borrowing workflow ("create on the fly").

Students Management

Admin can:

View list of students (name, ID, borrowed books).

Create new students.

Edit or delete student records.

Add students directly from the borrowing workflow.

Borrowing Books

Workflow:

Select student from dropdown (or create new student).

Select book from dropdown (or create new book).

Upload before-condition image of book.

Save borrowing record.

Borrowed book appears in the borrowed books list with:

Student name

Book title

Borrow date

Before-condition image

Returning Books

Workflow:

Select borrowed book record from list.

Upload after-condition image of book.

Mark book as returned.

Record should be updated with:

Return date

After-condition image

Condition status

Lists & Views

Books List: Table/grid with filtering and search.

Students List: Table/grid with filtering and search.

Borrowed Books List: Table/grid showing current and past borrowings, searchable and filterable.

UI/UX Requirements

Fully responsive layout for desktop, tablet, and mobile.

Sidebar collapsible for smaller screens.

Clean DaisyUI components for inputs, dropdowns, tables, modals, and forms.

Use modals or side panels for creating/editing books and students without leaving the page.S
