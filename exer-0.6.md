sequenceDiagram
  participant Browser
  participant Server

  Browser->>Server: POST /exampleapp/new_note_spa<br/>{"content": "note text", "date": "..."}
  Server-->>Browser: 201 Created

  Note right of Browser: JS updates notes list without reloading
