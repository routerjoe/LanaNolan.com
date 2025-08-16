// Note: This is a simplified PDF generation utility
// In a production environment, you might want to use a more robust solution
// or generate PDFs server-side for better performance and security

export interface RecruitingPacketData {
  personalInfo: {
    name: string;
    graduationYear: number;
    email: string;
    phone?: string;
    hometown: string;
  };
  athletics: {
    primaryPosition: string;
    secondaryPositions: string[];
    battingThrows: string;
    highSchool: {
      name: string;
      coach: string;
      contact: string;
    };
    travelTeam: {
      name: string;
      coach: string;
      contact: string;
    };
  };
  academics: {
    gpa?: number;
    classRank?: string;
    honors: string[];
    awards: string[];
  };
  measurables: Array<{
    metric: string;
    value: string;
    date: string;
    notes?: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
    type: string;
  }>;
  references: Array<{
    name: string;
    title: string;
    organization: string;
    phone: string;
    email: string;
    relationship: string;
  }>;
}

export const generateRecruitingPacketPDF = async (data: RecruitingPacketData): Promise<void> => {
  try {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import('jspdf')).default;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;
    
    // Helper function to add text with automatic line breaks
    const addText = (text: string, x: number, y: number) => {
      const lines = doc.splitTextToSize(text, pageWidth - 40);
      doc.text(lines as unknown as string[], x, y);
      return y + (lines.length * 6);
    };
    
    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
    };
    
    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    yPosition = addText(`${data.personalInfo.name} - Recruiting Packet`, 20, yPosition);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Class of ${data.personalInfo.graduationYear} Softball Recruit`, 20, yPosition + 5);
    
    // Add a line separator
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yPosition + 5, pageWidth - 20, yPosition + 5);
    yPosition += 15;
    
    // Personal Information Section
    checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Personal Information', 20, yPosition);
    yPosition += 5;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Name: ${data.personalInfo.name}`, 25, yPosition);
    yPosition = addText(`Graduation Year: ${data.personalInfo.graduationYear}`, 25, yPosition);
    yPosition = addText(`Email: ${data.personalInfo.email}`, 25, yPosition);
    if (data.personalInfo.phone) {
      yPosition = addText(`Phone: ${data.personalInfo.phone}`, 25, yPosition);
    }
    yPosition = addText(`Hometown: ${data.personalInfo.hometown}`, 25, yPosition);
    yPosition += 10;
    
    // Athletic Information Section
    checkNewPage(60);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Athletic Information', 20, yPosition);
    yPosition += 5;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Primary Position: ${data.athletics.primaryPosition}`, 25, yPosition);
    if (data.athletics.secondaryPositions.length > 0) {
      yPosition = addText(`Secondary Positions: ${data.athletics.secondaryPositions.join(', ')}`, 25, yPosition);
    }
    yPosition = addText(`Bats/Throws: ${data.athletics.battingThrows}`, 25, yPosition);
    yPosition += 5;
    
    yPosition = addText(`High School: ${data.athletics.highSchool.name}`, 25, yPosition);
    yPosition = addText(`HS Coach: ${data.athletics.highSchool.coach} (${data.athletics.highSchool.contact})`, 25, yPosition);
    yPosition += 5;
    
    yPosition = addText(`Travel Team: ${data.athletics.travelTeam.name}`, 25, yPosition);
    yPosition = addText(`Travel Coach: ${data.athletics.travelTeam.coach} (${data.athletics.travelTeam.contact})`, 25, yPosition);
    yPosition += 10;
    
    // Academic Information Section
    checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Academic Information', 20, yPosition);
    yPosition += 5;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    if (data.academics.gpa) {
      yPosition = addText(`GPA: ${data.academics.gpa.toFixed(2)}`, 25, yPosition);
    }
    if (data.academics.classRank) {
      yPosition = addText(`Class Rank: ${data.academics.classRank}`, 25, yPosition);
    }
    if (data.academics.honors.length > 0) {
      yPosition = addText(`Honors: ${data.academics.honors.join(', ')}`, 25, yPosition);
    }
    if (data.academics.awards.length > 0) {
      yPosition = addText(`Awards: ${data.academics.awards.join(', ')}`, 25, yPosition);
    }
    yPosition += 10;
    
    // Performance Measurables Section
    checkNewPage(60);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('Performance Measurables', 20, yPosition);
    yPosition += 5;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    data.measurables.forEach((measurable) => {
      checkNewPage(15);
      yPosition = addText(`${measurable.metric}: ${measurable.value} (${new Date(measurable.date).toLocaleDateString()})`, 25, yPosition);
      if (measurable.notes) {
        yPosition = addText(`  Notes: ${measurable.notes}`, 30, yPosition);
      }
    });
    yPosition += 10;
    
    // Recent Achievements Section
    if (data.achievements.length > 0) {
      checkNewPage(40);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      yPosition = addText('Recent Achievements', 20, yPosition);
      yPosition += 5;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      data.achievements.forEach((achievement) => {
        checkNewPage(20);
        yPosition = addText(`${achievement.title} (${new Date(achievement.date).toLocaleDateString()})`, 25, yPosition);
        yPosition = addText(`  ${achievement.description}`, 30, yPosition);
      });
      yPosition += 10;
    }
    
    // References Section
    if (data.references.length > 0) {
      checkNewPage(60);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      yPosition = addText('Coach References', 20, yPosition);
      yPosition += 5;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      data.references.forEach((reference) => {
        checkNewPage(25);
        yPosition = addText(`${reference.name} - ${reference.title}`, 25, yPosition);
        yPosition = addText(`${reference.organization}`, 25, yPosition);
        yPosition = addText(`Phone: ${reference.phone} | Email: ${reference.email}`, 25, yPosition);
        yPosition = addText(`Relationship: ${reference.relationship}`, 25, yPosition);
        yPosition += 5;
      });
    }
    
    // Footer on last page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${data.personalInfo.name} - Recruiting Packet | Page ${i} of ${totalPages}`, 20, pageHeight - 10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 80, pageHeight - 10);
    }
    
    // Save the PDF
    doc.save(`${data.personalInfo.name.replace(/\s+/g, '_')}_Recruiting_Packet.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate recruiting packet PDF');
  }
};

// Sample data for testing
export const getSampleRecruitingData = (): RecruitingPacketData => ({
  personalInfo: {
    name: 'Lana Nolan',
    graduationYear: 2027,
    email: 'lananolan08@gmail.com',
    hometown: 'South Carolina',
  },
  athletics: {
    primaryPosition: 'Multi-Position',
    secondaryPositions: ['Outfield', 'Infield'],
    battingThrows: 'R/R',
    highSchool: {
      name: 'To be updated',
      coach: 'To be updated',
      contact: 'To be updated',
    },
    travelTeam: {
      name: 'To be updated',
      coach: 'To be updated',
      contact: 'To be updated',
    },
  },
  academics: {
    honors: ['Honor Roll', 'Academic Excellence'],
    awards: ['Student of the Month'],
  },
  measurables: [
    { metric: 'Exit Velocity', value: 'TBD mph', date: '2024-01-01', notes: 'To be updated with latest measurements' },
    { metric: 'Throwing Velocity', value: 'TBD mph', date: '2024-01-01', notes: 'To be updated with latest measurements' },
    { metric: '60-Yard Dash', value: 'TBD sec', date: '2024-01-01', notes: 'To be updated with latest measurements' },
  ],
  achievements: [
    {
      title: 'Tournament MVP',
      description: 'Outstanding performance in spring tournament',
      date: '2024-03-15',
      type: 'tournament',
    },
  ],
  references: [
    {
      name: 'Coach Name',
      title: 'Head Coach',
      organization: 'High School Team',
      phone: 'To be updated',
      email: 'To be updated',
      relationship: 'High School Coach',
    },
  ],
});