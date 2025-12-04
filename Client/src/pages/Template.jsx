import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import logo from '../assets/kite-logo.webp'; 
import ipslogo from '../assets/ips.webp';

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

  // Character limits for form fields
  const CHAR_LIMITS = {
    from: 200,      // ~4 lines of text in the FROM box
    to: 200,        // ~4 lines of text in the TO box
    subject: 120,   // Single line subject
    body: 3800,     // ~38 lines of body text (expanded without footer)
    department: 50
  };

  // Handle text input changes with character limits
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Enforce character limits
    if (CHAR_LIMITS[name] && value.length > CHAR_LIMITS[name]) {
      return; // Don't update if over limit
    }
    
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
      // Create PDF with A4 portrait in points (595 × 842)
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = 595;
      const pageHeight = 842;
      
      // ABSOLUTE POSITIONING - All coordinates in points
      // Margins
      const leftMargin = 28;
      const rightMargin = 567; // 595 - 28
      const contentWidth = rightMargin - leftMargin;
      
      // Draw outer page border
      pdf.setLineWidth(1);
      pdf.setDrawColor(0, 0, 0);
      pdf.rect(leftMargin, 28, contentWidth, 786); // 842 - 28 - 28
      
      // ===== HEADER SECTION (ABSOLUTE POSITION) =====
      let yPos = 40;
      
      // Logo - EXACT POSITION (LEFT SIDE)
      const logoWidth = 72;
      const logoHeight = 36;
      try {
        pdf.addImage(logo, 'PNG', leftMargin + 8, yPos, logoWidth, logoHeight);
      } catch (error) {
        console.log('Logo not loaded');
      }
      
      // // IPS Logo - RIGHT SIDE
      // const ipsLogoWidth = 72;
      // const ipsLogoHeight = 36;
      // try {
      //   pdf.addImage(ipslogo, 'PNG', rightMargin - ipsLogoWidth - 8, yPos, ipsLogoWidth, ipsLogoHeight);
      // } catch (error) {
      //   console.log('IPS Logo not loaded');
      // }
      
      // Header text - Institution name (ABSOLUTE POSITION)
      pdf.setFont('times', 'bold');
      pdf.setFontSize(11);
      const institutionText = 'KGISL INSTITUTE OF TECHNOLOGY';
      const instWidth = pdf.getStringUnitWidth(institutionText) * 11 / pdf.internal.scaleFactor;
      pdf.text(institutionText, (pageWidth - instWidth) / 2, yPos + 14);
      
      // Address (ABSOLUTE POSITION)
      pdf.setFont('times', 'normal');
      pdf.setFontSize(9);
      const addressText = 'COIMBATORE -35, TN, INDIA';
      const addrWidth = pdf.getStringUnitWidth(addressText) * 9 / pdf.internal.scaleFactor;
      pdf.text(addressText, (pageWidth - addrWidth) / 2, yPos + 26);
      
      yPos = 92; // ABSOLUTE Y for header table
      
      // ===== HEADER TABLE (3 ROWS, 3 COLUMNS - ABSOLUTE) =====
      const tableX = leftMargin + 8;
      const tableWidth = contentWidth - 16;
      const col1Width = 340;
      const col2Width = 100;
      const col3Width = tableWidth - col1Width - col2Width;
      const rowHeight = 18;
      
      // Column X positions
      const col1X = tableX;
      const col2X = tableX + col1Width;
      const col3X = tableX + col1Width + col2Width;
      
      pdf.setLineWidth(0.5);
      
      // Horizontal lines (4 lines for 3 rows)
      for (let i = 0; i <= 3; i++) {
        pdf.line(tableX, yPos + (i * rowHeight), tableX + tableWidth, yPos + (i * rowHeight));
      }
      
      // Vertical lines
      pdf.line(tableX, yPos, tableX, yPos + (3 * rowHeight)); // Left
      pdf.line(col2X, yPos, col2X, yPos + (3 * rowHeight)); // Middle 1
      pdf.line(col3X, yPos, col3X, yPos + (3 * rowHeight)); // Middle 2
      pdf.line(tableX + tableWidth, yPos, tableX + tableWidth, yPos + (3 * rowHeight)); // Right
      
      // Row 1 content
      pdf.setFont('times', 'bold');
      pdf.setFontSize(8);
      const academicFormsText = 'ACADEMIC - FORMS';
      const academicFormsWidth = pdf.getStringUnitWidth(academicFormsText) * 8 / pdf.internal.scaleFactor;
      pdf.text(academicFormsText, col1X + (col1Width - academicFormsWidth) / 2, yPos + 12);
      pdf.setFont('times', 'normal');
      const issueNoDateText = 'Issue No / Date';
      const issueNoDateWidth = pdf.getStringUnitWidth(issueNoDateText) * 8 / pdf.internal.scaleFactor;
      pdf.text(issueNoDateText, col2X + (col2Width - issueNoDateWidth) / 2, yPos + 12);
      const docRefText = 'Doc. Ref.';
      const docRefWidth = pdf.getStringUnitWidth(docRefText) * 8 / pdf.internal.scaleFactor;
      pdf.text(docRefText, col3X + (col3Width - docRefWidth) / 2, yPos + 12);
      
      // Row 2 content
      pdf.setFont('times', 'bold');
      pdf.setFontSize(8);
      const facultyLetterText = 'FACULTY REQUEST LETTER';
      const facultyLetterWidth = pdf.getStringUnitWidth(facultyLetterText) * 8 / pdf.internal.scaleFactor;
      pdf.text(facultyLetterText, col1X + (col1Width - facultyLetterWidth) / 2, yPos + rowHeight + 12);
      pdf.setFont('times', 'normal');
      const dateText = '01 / 19.08.2024';
      const dateWidth = pdf.getStringUnitWidth(dateText) * 8 / pdf.internal.scaleFactor;
      pdf.text(dateText, col2X + (col2Width - dateWidth) / 2, yPos + rowHeight + 12);
      const kiteRefText = 'KITE/ AC/FRL/ 76';
      const kiteRefWidth = pdf.getStringUnitWidth(kiteRefText) * 8 / pdf.internal.scaleFactor;
      pdf.text(kiteRefText, col3X + (col3Width - kiteRefWidth) / 2, yPos + rowHeight + 12);
      
      // Row 3 content
      pdf.setFont('times', 'bold');
      pdf.setFontSize(8);
      const academicYearText = 'ACADEMIC YEAR: 2024 - 2025';
      const academicYearWidth = pdf.getStringUnitWidth(academicYearText) * 8 / pdf.internal.scaleFactor;
      pdf.text(academicYearText, col1X + (col1Width - academicYearWidth) / 2, yPos + (2 * rowHeight) + 12);
      const departmentLabelText = 'Department';
      const departmentLabelWidth = pdf.getStringUnitWidth(departmentLabelText) * 8 / pdf.internal.scaleFactor;
      pdf.text(departmentLabelText, col2X + (col2Width - departmentLabelWidth) / 2, yPos + (2 * rowHeight) + 12);
      pdf.setFont('times', 'normal');
      const deptText = formData.department || '';
      const truncatedDept = deptText.length > 12 ? deptText.substring(0, 12) + '...' : deptText;
      const deptTextWidth = pdf.getStringUnitWidth(truncatedDept) * 8 / pdf.internal.scaleFactor;
      pdf.text(truncatedDept, col3X + (col3Width - deptTextWidth) / 2, yPos + (2 * rowHeight) + 12);
      
      yPos = 168; // ABSOLUTE Y after header table (moved down for better spacing)
      
      // ===== MAIN TITLE (ABSOLUTE) =====
      pdf.setFont('times', 'bold');
      pdf.setFontSize(11);
      const mainTitle = 'FACULTY REQUEST LETTER';
      const titleWidth = pdf.getStringUnitWidth(mainTitle) * 11 / pdf.internal.scaleFactor;
      pdf.text(mainTitle, (pageWidth - titleWidth) / 2, yPos);
      
      yPos = 188; // ABSOLUTE Y for FROM/TO boxes (adjusted for title position)
      
      // ===== FROM AND TO BOXES (ABSOLUTE, SIDE BY SIDE) =====
      // *** MODIFIED: Increased height from 52pt to 70pt to accommodate 3-4 lines ***
      const fromToHeight = 70;
      const halfWidth = (tableWidth / 2);
      
      // FROM box (left)
      pdf.setLineWidth(0.5);
      pdf.rect(tableX, yPos, halfWidth, fromToHeight);
      
      pdf.setFont('times', 'bold');
      pdf.setFontSize(9);
      pdf.text('From', tableX + 4, yPos + 12);
      
      // FROM content - *** MODIFIED: Allow full text wrapping, no truncation ***
      pdf.setFont('times', 'normal');
      pdf.setFontSize(8);
      const fromText = formData.from || '';
      const fromLines = pdf.splitTextToSize(fromText, halfWidth - 10);
      const maxFromLines = 4; // Allow up to 4 lines
      let fromY = yPos + 24;
      const fromLineHeight = 11;
      
      // Display up to maxFromLines without ellipsis
      for (let i = 0; i < Math.min(fromLines.length, maxFromLines); i++) {
        if (fromY + fromLineHeight <= yPos + fromToHeight - 4) { // Check if line fits
          pdf.text(fromLines[i], tableX + 4, fromY);
          fromY += fromLineHeight;
        }
      }
      
      // TO box (right)
      pdf.rect(tableX + halfWidth, yPos, halfWidth, fromToHeight);
      
      pdf.setFont('times', 'bold');
      pdf.setFontSize(9);
      pdf.text('To', tableX + halfWidth + 4, yPos + 12);
      
      // TO content - *** MODIFIED: Allow full text wrapping, no truncation ***
      pdf.setFont('times', 'normal');
      pdf.setFontSize(8);
      const toText = formData.to || '';
      const toLines = pdf.splitTextToSize(toText, halfWidth - 10);
      const maxToLines = 4; // Allow up to 4 lines
      let toY = yPos + 24;
      const toLineHeight = 11;
      
      // Display up to maxToLines without ellipsis
      for (let i = 0; i < Math.min(toLines.length, maxToLines); i++) {
        if (toY + toLineHeight <= yPos + fromToHeight - 4) { // Check if line fits
          pdf.text(toLines[i], tableX + halfWidth + 4, toY);
          toY += toLineHeight;
        }
      }
      
      yPos = 275; // ABSOLUTE Y after FROM/TO boxes (increased top padding)
      
      // ===== RESPECTED SIR/MADAM (ABSOLUTE) =====
      pdf.setFont('times', 'normal');
      pdf.setFontSize(9);
      pdf.text('Respected Sir/Madam', tableX + 4, yPos);
      
      yPos = 290; // ABSOLUTE Y for subject (adjusted below Respected Sir/Madam)
      
      // ===== SUBJECT LINE (ABSOLUTE, SINGLE LINE WITH TRUNCATION) =====
      pdf.setFont('times', 'bold');
      pdf.setFontSize(9);
      pdf.text('Subject :', tableX + 4, yPos);
      
      pdf.setFont('times', 'normal');
      pdf.setFontSize(8);
      const subjectText = formData.subject || '';
      const subjectWidth = tableWidth - 60;
      const subjectLines = pdf.splitTextToSize(subjectText, subjectWidth);
      let subjectDisplay = subjectLines[0] || '';
      if (subjectLines.length > 1 || subjectDisplay.length > 80) {
        subjectDisplay = subjectDisplay.substring(0, 80) + '...';
      }
      pdf.text(subjectDisplay, tableX + 50, yPos);
      
      yPos = 308; // ABSOLUTE Y for body box (adjusted to maintain spacing)
      
      // ===== BODY CONTENT BOX (ABSOLUTE, FIXED SIZE - EXPANDED TO FILL PAGE) =====
      const bodyHeight = 445; // Reduced to create gap before date box
      pdf.setLineWidth(0.5);
      pdf.rect(tableX, yPos, tableWidth, bodyHeight);
      
      // Body text (multiline with truncation)
      pdf.setFont('times', 'normal');
      pdf.setFontSize(9);
      const bodyText = formData.body || '';
      const bodyLines = pdf.splitTextToSize(bodyText, tableWidth - 12);
      const maxBodyLines = 37; // Adjusted for reduced body height
      let bodyY = yPos + 14;
      const lineHeight = 12;
      
      for (let i = 0; i < Math.min(bodyLines.length, maxBodyLines); i++) {
        if (i === maxBodyLines - 1 && bodyLines.length > maxBodyLines) {
          pdf.text(bodyLines[i].substring(0, bodyLines[i].length - 3) + '...', tableX + 6, bodyY);
        } else {
          pdf.text(bodyLines[i], tableX + 6, bodyY);
        }
        bodyY += lineHeight;
      }
      
      yPos = 768; // ABSOLUTE Y for date box with gap from body box (308 + 445 + 15 gap)
      
      // ===== DATE BOX (ABSOLUTE, LEFT SIDE ONLY) =====
      const dateBoxWidth = 120; // Reduced from halfWidth to fit date content
      const dateBoxHeight = 28;
      pdf.setLineWidth(0.5);
      pdf.rect(tableX, yPos, dateBoxWidth, dateBoxHeight);
      
      // Center align the date text both horizontally and vertically
      pdf.setFont('times', 'bold');
      pdf.setFontSize(9);
      const dateLabel = 'Date:';
      const dateLabelWidth = pdf.getStringUnitWidth(dateLabel) * 9 / pdf.internal.scaleFactor;
      
      pdf.setFont('times', 'normal');
      pdf.setFontSize(8);
      const dateValue = currentDate || formData.date;
      const dateValueWidth = pdf.getStringUnitWidth(dateValue) * 8 / pdf.internal.scaleFactor;
      
      const totalDateWidth = dateLabelWidth + 4 + dateValueWidth; // 4pt spacing
      const startX = tableX + (dateBoxWidth - totalDateWidth) / 2;
      const textY = yPos + (dateBoxHeight / 2) + 3.5; // Vertically center with slight adjustment
      
      pdf.setFont('times', 'bold');
      pdf.setFontSize(9);
      pdf.text(dateLabel, startX, textY);
      
      pdf.setFont('times', 'normal');
      pdf.setFontSize(8);
      pdf.text(dateValue, startX + dateLabelWidth + 4, textY);
      
      // ===== POWERED BY IPS TECH COMMUNITY (RIGHT ALIGNED) =====
      const signatureText = 'Powered by IPS Tech Community';
      
      pdf.setFont('times', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(60, 60, 60); // Dark gray #3C3C3C
      
      // Calculate text width and position it near the right edge
      const signatureWidth = pdf.getStringUnitWidth(signatureText) * 8 / pdf.internal.scaleFactor;
      const signatureX = tableX + tableWidth - signatureWidth - 10; // 10pt padding from right edge
      
      pdf.text(signatureText, signatureX, yPos + 20);
      
      // Reset text color to black
      pdf.setTextColor(0, 0, 0);
      
      // Save PDF
      const fileName = `Faculty_Request_Letter_${currentDate.replace(/\./g, '_')}.pdf`;
      pdf.save(fileName);
      
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
              <img
                  src={ipslogo} 
                  alt="IPS Logo" 
                  className="h-26 w-auto object-contain"
                />
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
                Department <span className="text-red-600">*</span>
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
                  From <span className="text-red-600">*</span> <span className="text-xs text-gray-500">({formData.from.length}/{CHAR_LIMITS.from})</span>
                </label>
                <textarea
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength={CHAR_LIMITS.from}
                  className={`w-full px-4 py-3 border ${errors.from ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                  placeholder="Enter sender information (max 200 characters)"
                  required
                ></textarea>
                {errors.from && (
                  <p className="mt-2 text-sm text-red-600">{errors.from}</p>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  To <span className="text-red-600">*</span> <span className="text-xs text-gray-500">({formData.to.length}/{CHAR_LIMITS.to})</span>
                </label>
                <textarea
                  name="to"
                  value={formData.to}
                  onChange={handleInputChange}
                  rows="3"
                  maxLength={CHAR_LIMITS.to}
                  className={`w-full px-4 py-3 border ${errors.to ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                  placeholder="Enter recipient information (max 200 characters)"
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
                Subject <span className="text-red-600">*</span> <span className="text-xs text-gray-500">({formData.subject.length}/{CHAR_LIMITS.subject})</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                maxLength={CHAR_LIMITS.subject}
                className={`block w-full px-4 py-3 border ${errors.subject ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                placeholder="Enter the subject of your request (max 120 characters)"
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
                  Body <span className="text-red-600">*</span> <span className="text-xs text-gray-500">({formData.body.length}/{CHAR_LIMITS.body})</span>
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  rows="10"
                  maxLength={CHAR_LIMITS.body}
                  className={`w-full px-4 py-3 border ${errors.body ? 'border-red-400' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                  placeholder="Enter the main content of your request letter (max 3800 characters)"
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
            <div className="flex items-center justify-between space-x-6 pt-6 border-t border-gray-200">
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
                <p className="text-gray-500 text-sm flex items-center gap-2">
                <span>Powered by IPS Tech Community</span>
                <img
                  src={ipslogo}
                  alt="IPS Logo"
                  className="h-7 w-auto object-contain"
                />
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
