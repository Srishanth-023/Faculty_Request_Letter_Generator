import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import logo from '../assets/kite-logo.webp'; 

const Template = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    subject: '',
    body: '',
    date: '',
    department: ''
  });
  
  // State for form validation and submission
  const [errors, setErrors] = useState({});
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // References to form elements
  const formRef = useRef(null);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.from) newErrors.from = "From field is required";
    if (!formData.to) newErrors.to = "To field is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.body) newErrors.body = "Body is required";
    if (!formData.department) newErrors.department = "Department is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Auto-fill date when generate button is clicked
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');
      
      setFormData(prev => ({ ...prev, date: formattedDate }));
      
      // Generate PDF with updated date
      setTimeout(() => generatePDF(formattedDate), 100);
    }
  };

  // Generate PDF from form data with exact format from images
  const generatePDF = async (currentDate) => {
    setIsGeneratingPdf(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Border margin - 5mm from page edge
      const borderMargin = 5;
      
      // Draw main border around the page
      pdf.setLineWidth(0.5);
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(borderMargin, borderMargin, pageWidth - (2 * borderMargin), pageHeight - (2 * borderMargin));
      
      // ===== HEADER SECTION =====
      // Header starts at 8mm from top border
      let yPos = borderMargin + 8;
      
      // Add KiTE logo (positioned at top-left inside border)
      const logoWidth = 20;
      const logoHeight = 10;
      const logoX = borderMargin + 8;
      const logoY = yPos;
      
      // Draw logo
      try {
        pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (error) {
        console.log('Logo not loaded');
      }
      
      // Header text - KGISL INSTITUTE OF TECHNOLOGY
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      const headerTitle = 'KGISL INSTITUTE OF TECHNOLOGY,';
      const titleWidth = pdf.getStringUnitWidth(headerTitle) * 12 / pdf.internal.scaleFactor;
      pdf.text(headerTitle, (pageWidth - titleWidth) / 2, yPos + 4);
      
      // Address
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const address = 'COIMBATORE -35, TN, INDIA';
      const addressWidth = pdf.getStringUnitWidth(address) * 10 / pdf.internal.scaleFactor;
      pdf.text(address, (pageWidth - addressWidth) / 2, yPos + 9);
      
      yPos += 13;
      
      // Header table with three columns
      const tableStartX = borderMargin + 8;
      const tableWidth = pageWidth - (2 * borderMargin) - 16;
      const rowHeight = 7;
      
      // Draw top horizontal line
      pdf.setLineWidth(0.4);
      pdf.line(tableStartX, yPos, tableStartX + tableWidth, yPos);
      
      yPos += rowHeight;
      
      // Row 1: ACADEMIC - FORMS | Issue No / Date | Doc Ref
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ACADEMIC - FORMS', tableStartX + 2, yPos - 2);
      
      // Vertical line 1 (after ACADEMIC - FORMS) - positioned at 65%
      const col2X = tableStartX + tableWidth * 0.65;
      pdf.line(col2X, yPos - rowHeight, col2X, yPos + rowHeight * 2);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text('Issue No / Date', col2X + 2, yPos - 2);
      
      // Vertical line 2 (after Issue No / Date) - positioned at 82%
      const col3X = tableStartX + tableWidth * 0.82;
      pdf.line(col3X, yPos - rowHeight, col3X, yPos + rowHeight * 2);
      
      pdf.text('Doc. Ref.', col3X + 2, yPos - 2);
      
      // Horizontal line
      pdf.line(tableStartX, yPos, tableStartX + tableWidth, yPos);
      
      yPos += rowHeight;
      
      // Row 2: FACULTY REQUEST LETTER | 01 / 19.08.2024 | KITE/ AC/FRL/ 76
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FACULTY REQUEST LETTER', tableStartX + 2, yPos - 2);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text('01 / 19.08.2024', col2X + 2, yPos - 2);
      pdf.text('KITE/ AC/FRL/ 76', col3X + 2, yPos - 2);
      
      // Horizontal line
      pdf.line(tableStartX, yPos, tableStartX + tableWidth, yPos);
      
      yPos += rowHeight;
      
      // Row 3: ACADEMIC YEAR: 2024 - 2025 | Department | (value)
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ACADEMIC YEAR: 2024 - 2025', tableStartX + 2, yPos - 2);
      
      pdf.text('Department', col2X + 2, yPos - 2);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(formData.department || '', col3X + 2, yPos - 2);
      
      // Bottom horizontal line
      pdf.line(tableStartX, yPos, tableStartX + tableWidth, yPos);
      
      yPos += 10;
      
      // Title: FACULTY REQUEST LETTER
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      const mainTitle = 'FACULTY REQUEST LETTER';
      const mainTitleWidth = pdf.getStringUnitWidth(mainTitle) * 11 / pdf.internal.scaleFactor;
      pdf.text(mainTitle, (pageWidth - mainTitleWidth) / 2, yPos);
      
      yPos += 8;
      
      // ===== MAIN CONTENT SECTION =====
      const contentStartX = tableStartX;
      const contentWidth = tableWidth;
      
      // FROM and TO boxes
      const boxHeight = 30;
      const boxY = yPos;
      const halfWidth = tableWidth / 2;
      
      // Draw FROM box
      pdf.setLineWidth(0.4);
      pdf.rect(contentStartX, boxY, halfWidth, boxHeight);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('From', contentStartX + 3, boxY + 5);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      const fromLines = pdf.splitTextToSize(formData.from, halfWidth - 8);
      pdf.text(fromLines, contentStartX + 3, boxY + 11);
      
      // Draw TO box
      pdf.rect(contentStartX + halfWidth, boxY, halfWidth, boxHeight);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('To', contentStartX + halfWidth + 3, boxY + 5);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      const toLines = pdf.splitTextToSize(formData.to, halfWidth - 8);
      pdf.text(toLines, contentStartX + halfWidth + 3, boxY + 11);
      
      yPos += boxHeight + 1;
      
      // Respected Sir/Madam
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Respected sir/Madam', contentStartX + 3, yPos);
      
      yPos += 5;
      
      // Subject line
      pdf.setFont('helvetica', 'bold');
      pdf.text('Subject :', contentStartX + 3, yPos);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      const subjectLines = pdf.splitTextToSize(formData.subject, contentWidth - 25);
      pdf.text(subjectLines, contentStartX + 20, yPos);
      
      yPos += 8;
      
      // Body section - Large box for content
      const bodyBoxHeight = 125;
      pdf.setLineWidth(0.4);
      pdf.rect(contentStartX, yPos, contentWidth, bodyBoxHeight);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      const bodyLines = pdf.splitTextToSize(formData.body, contentWidth - 8);
      pdf.text(bodyLines, contentStartX + 4, yPos + 6);
      
      yPos += bodyBoxHeight + 2;
      
      // Date section
      const dateBoxWidth = contentWidth / 2;
      const dateBoxHeight = 8;
      pdf.rect(contentStartX, yPos, dateBoxWidth, dateBoxHeight);
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Date:', contentStartX + 3, yPos + 5.5);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(currentDate || formData.date, contentStartX + 13, yPos + 5.5);
      
      yPos += dateBoxHeight + 1;
      
      // ===== FOOTER SECTION =====
      // Footer boxes for remarks and signatures
      const footerBoxHeight = 18;
      
      // Remarks By HoD and Dean/IQAC boxes
      pdf.setLineWidth(0.4);
      pdf.rect(contentStartX, yPos, halfWidth, footerBoxHeight);
      pdf.rect(contentStartX + halfWidth, yPos, halfWidth, footerBoxHeight);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Remarks By HoD', contentStartX + 3, yPos + 5);
      pdf.text('Dean/IQAC(if applicable)', contentStartX + halfWidth + 3, yPos + 5);
      
      yPos += footerBoxHeight;
      
      // Remarks by Principal and Remarks by Director boxes
      pdf.rect(contentStartX, yPos, halfWidth, footerBoxHeight);
      pdf.rect(contentStartX + halfWidth, yPos, halfWidth, footerBoxHeight);
      
      pdf.text('Remarks by Principal', contentStartX + 3, yPos + 5);
      pdf.text('Remarks by Director(A&A)', contentStartX + halfWidth + 3, yPos + 5);
      
      yPos += footerBoxHeight;
      
      // Office Use/ A.O and CEO boxes
      pdf.rect(contentStartX, yPos, halfWidth, footerBoxHeight);
      pdf.rect(contentStartX + halfWidth, yPos, halfWidth, footerBoxHeight);
      
      pdf.text('Office Use/ A.O', contentStartX + 3, yPos + 5);
      pdf.text('CEO', contentStartX + halfWidth + 3, yPos + 5);
      
      // Save the PDF
      pdf.save(`Faculty_Request_Letter_${currentDate.replace(/\./g, '_')}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      from: '',
      to: '',
      subject: '',
      body: '',
      date: '',
      department: ''
    });
    setErrors({});
    
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-lg mb-8 overflow-hidden">
          <div className="relative">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-800 to-blue-900"></div>
            
            <div className="p-6 flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="bg-white p-3 rounded-lg shadow-md border border-blue-100">
                  <img 
                    src={logo} 
                    alt="KiTE Logo" 
                    className="h-14 w-auto object-contain"
                  />
                </div>
                <div className="pl-2">
                  <h2 className="text-2xl font-bold text-blue-900 tracking-tight">Faculty Request Letter Generator</h2>
                  <div className="flex items-center mt-1">
                    <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mr-2"></div>
                    <p className="text-black-600 text-sm font-medium">KGISL Institute of Technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-sky-900 to-blue-700 px-8 py-6">
            <h1 className="text-white text-3xl font-bold tracking-tight">Faculty Request Letter</h1>
            <p className="text-blue-50 text-sm mt-1">Complete the form below to generate your request letter</p>
          </div>
          
          <form ref={formRef} onSubmit={handleSubmit} className="px-8 py-8 space-y-6 bg-gradient-to-br from-blue-50 to-sky-50">
            
            {/* Department Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Department *
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 border ${errors.department ? 'border-red-400' : 'border-blue-100'} rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-300 transition duration-150`}
                placeholder="Enter your department"
                required
              />
              {errors.department && (
                <p className="mt-2 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            {/* FROM and TO Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  From *
                </label>
                <textarea
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 border ${errors.from ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                  placeholder="Enter sender information"
                  required
                ></textarea>
                {errors.from && (
                  <p className="mt-2 text-sm text-red-600">{errors.from}</p>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  To *
                </label>
                <textarea
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 border ${errors.to ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                  placeholder="Enter recipient information"
                  required
                ></textarea>
                {errors.to && (
                  <p className="mt-2 text-sm text-red-600">{errors.to}</p>
                )}
              </div>
            </div>
            
            {/* Subject Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-blue-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 border ${errors.subject ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                placeholder="Enter the subject of your request"
                required
              />
              {errors.subject && (
                <p className="mt-2 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>
            
            {/* Body Section */}
            <div className="bg-slate-50 rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Letter Content
              </h3>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body *
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  rows="10"
                  className={`w-full px-4 py-3 border ${errors.body ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                  placeholder="Enter the main content of your request letter"
                  required
                ></textarea>
                {errors.body && (
                  <p className="mt-2 text-sm text-red-600">{errors.body}</p>
                )}
              </div>
            </div>
            
            {/* Date Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> The date will be automatically filled with today's date when you generate the PDF.
                </p>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                disabled={isGeneratingPdf}
                className="px-5 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Form
                </div>
              </button>
              <button
                type="submit"
                disabled={isGeneratingPdf}
                className="px-5 py-3 bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:transform-none"
              >
                {isGeneratingPdf ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating PDF...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Generate Letter PDF
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-blue-600 font-mono text-xl mr-2">&lt;/&gt;</span>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">KGISL Institute of Technology</h3>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-600 text-sm mb-4 md:mb-0">
                  © {new Date().getFullYear()} KGISL Institute of Technology. All rights reserved.
                </p>
                <p className="text-gray-500 text-sm">
                  Faculty Request Letter Generator
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Template;
