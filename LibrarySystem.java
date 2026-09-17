import java.util.ArrayList;
import java.util.Scanner;

 
class Book {
    private int id;
    private String title;
    private String author;
    private boolean isIssued;

     public Book(int id, String title, String author) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isIssued = false;  
    }
 
    public int getId() { return id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public boolean getIsIssued() { return isIssued; }
    public void setIssued(boolean status) { this.isIssued = status; }
}

 public class LibrarySystem {
     private static ArrayList<Book> library = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
         library.add(new Book(101, "Java Programming", "James Gosling"));
        library.add(new Book(102, "Clean Code", "Robert C. Martin"));

        int choice;

        do {
            System.out.println("\n=== Library Management System ===");
            System.out.println("1. Add a New Book");
            System.out.println("2. Display All Books");
            System.out.println("3. Issue/Borrow a Book");
            System.out.println("4. Return a Book");
            System.out.println("5. Exit");
            System.out.print("Enter your choice: ");
            
            choice = scanner.nextInt();
            scanner.nextLine(); 

            switch (choice) {
                case 1:
                    addBook();
                    break;
                case 2:
                    displayBooks();
                    break;
                case 3:
                    issueBook();
                    break;
                case 4:
                    returnBook();
                    break;
                case 5:
                    System.out.println("Thank you for using the Library System! Goodbye.");
                    break;
                default:
                    System.out.println("Invalid option. Please select between 1 and 5.");
            }
        } while (choice != 5);
    }

     private static void addBook() {
        System.out.print("Enter Book ID (integer): ");
        int id = scanner.nextInt();
        scanner.nextLine();  

        System.out.print("Enter Book Title: ");
        String title = scanner.nextLine();

        System.out.print("Enter Author Name: ");
        String author = scanner.nextLine();

        library.add(new Book(id, title, author));
        System.out.println("Success: Book added to the library!");
    }

     private static void displayBooks() {
        if (library.isEmpty()) {
            System.out.println("The library is currently empty.");
            return;
        }

        System.out.println("\n-----------------------------------------------------------");
        System.out.printf("%-10s %-25s %-20s %-10s\n", "Book ID", "Title", "Author", "Status");
        System.out.println("-----------------------------------------------------------");
        
        for (Book book : library) {
            String status = book.getIsIssued() ? "Issued" : "Available";
            System.out.printf("%-10d %-25s %-20s %-10s\n", book.getId(), book.getTitle(), book.getAuthor(), status);
        }
        System.out.println("-----------------------------------------------------------");
    }

    // Operation 3: Issue a book by ID
    private static void issueBook() {
        System.out.print("Enter Book ID to borrow: ");
        int id = scanner.nextInt();

        for (Book book : library) {
            if (book.getId() == id) {
                if (book.getIsIssued()) {
                    System.out.println("Sorry, this book is already issued to someone else.");
                } else {
                    book.setIssued(true);
                    System.out.println("Success: You have borrowed '" + book.getTitle() + "'.");
                }
                return;
            }
        }
        System.out.println("Error: Book with ID " + id + " was not found.");
    }

     private static void returnBook() {
        System.out.print("Enter Book ID to return: ");
        int id = scanner.nextInt();

        for (Book book : library) {
            if (book.getId() == id) {
                if (!book.getIsIssued()) {
                    System.out.println("This book is already sitting in the library.");
                } else {
                    book.setIssued(false);
                    System.out.println("Success: You have returned '" + book.getTitle() + "'.");
                }
                return;
            }
        }
        System.out.println("Error: Book with ID " + id + " was not found.");
    }
}
