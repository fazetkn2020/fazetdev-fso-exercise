sequenceDiagram
  participant Browser
  participant Server

  Browser->>Server: GET https://studies.cs.helsinki.fi/exampleapp/spa
  Server-->>Browser: HTML file

  Browser->>Server: GET /exampleapp/main.css
  Server-->>Browser: CSS

  Browser->>Server: GET /exampleapp/spa.js
  Server-->>Browser: JS

  Browser->>Server: GET /exampleapp/data.json
  Server-->>Browser: JSON data

  Note right of Browser: Browser renders the SPA using JS
