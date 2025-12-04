# Faculty Request Letter Generator

A professional web application to generate faculty request letters in PDF format following the official KGISL Institute of Technology format.

## Features

- 📝 **Form-based Input**: Easy-to-use form with fields for FROM, TO, SUBJECT, BODY, and DEPARTMENT
- 📅 **Auto Date**: Automatically fills in the current date when generating the PDF
- 🎨 **Official Format**: Generates PDFs in the exact official format with proper header and footer sections
- 📄 **Single Page PDF**: Ensures all content fits perfectly within a single page
- 🏫 **Institutional Branding**: Includes KITE logo and institutional details

## Input Fields

1. **Department**: Your department name
2. **From**: Sender information
3. **To**: Recipient information
4. **Subject**: Subject of the request letter
5. **Body**: Main content of the request letter
6. **Date**: Auto-filled with current date when PDF is generated

## PDF Layout

The generated PDF includes:

### Header
- KITE Logo
- KGISL Institute of Technology branding
- Document reference table (Doc. Ref: KITE/AC/FRL/76)
- Issue date and academic year information

### Content
- FROM and TO boxes (side by side)
- "Respected sir/Madam" salutation
- Subject line
- Body content (large text area)
- Date field

### Footer
- Remarks By HoD
- Dean/IQAC (if applicable)
- Remarks by Principal
- Remarks by Director (A&A)
- Office Use/ A.O
- CEO

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Faculty_Request_Letter_Generator
```

2. Install dependencies:
```bash
cd Client
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

## Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **jsPDF** - PDF generation
- **JavaScript** - Core functionality

## Usage

1. Fill in all the required fields in the form
2. Click the "Generate Letter PDF" button
3. The PDF will be automatically downloaded with the filename format: `Faculty_Request_Letter_DD.MM.YYYY.pdf`

## Project Structure

```
Faculty_Request_Letter_Generator/
├── Client/
│   ├── src/
│   │   ├── assets/       # Images and logos
│   │   ├── pages/        # React components
│   │   │   └── Template.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## License

© 2024 KGISL Institute of Technology. All rights reserved.
