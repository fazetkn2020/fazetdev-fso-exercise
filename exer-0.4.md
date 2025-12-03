sequenceDiagram
    participant User
    participant Browser
    participant Server
    participant Database

    User->>Browser: Type new note and click "Save"
    Browser->>Server: POST /notes {content}
    Server->>Database: Save note
    Database-->>Server: Note saved
    Server-->>Browser: Return saved note
    Browser->>User: Update UI with new note
