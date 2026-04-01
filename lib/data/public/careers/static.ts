export type JobItem = {
  id: string;
  title: string;
  department: string;
  type: 'Full-time' | 'Contract' | 'Internship';
  location: string;
  closingDate: string;
  pdfUrl: string;
};

export const CAREER_PDF_URL =
  'https://res.cloudinary.com/dwtcilinl/image/upload/v1735475457/Tenders/g8dmlsiuo7okjds0j3b6.pdf';

export const jobFilters = {
  departments: ['All', 'Engineering', 'Customer Care', 'Finance', 'Operations'],
  types: ['All', 'Full-time', 'Contract', 'Internship'],
};

export const jobs: JobItem[] = [
  {
    id: 'job-001',
    title: 'Water Quality Officer',
    department: 'Operations',
    type: 'Full-time',
    location: 'Mbale',
    closingDate: '15 Mar 2026',
    pdfUrl: CAREER_PDF_URL,
  },
  {
    id: 'job-002',
    title: 'Customer Service Representative',
    department: 'Customer Care',
    type: 'Full-time',
    location: 'Mbale',
    closingDate: '22 Mar 2026',
    pdfUrl: CAREER_PDF_URL,
  },
  {
    id: 'job-003',
    title: 'Network Maintenance Technician',
    department: 'Engineering',
    type: 'Contract',
    location: 'Mbale',
    closingDate: '05 Apr 2026',
    pdfUrl: CAREER_PDF_URL,
  },
  {
    id: 'job-004',
    title: 'Graduate Internship — Engineering',
    department: 'Engineering',
    type: 'Internship',
    location: 'Mbale',
    closingDate: '30 Apr 2026',
    pdfUrl: CAREER_PDF_URL,
  },
  {
    id: 'job-005',
    title: 'Accounts Assistant',
    department: 'Finance',
    type: 'Full-time',
    location: 'Mbale',
    closingDate: '10 Apr 2026',
    pdfUrl: CAREER_PDF_URL,
  },
  {
    id: 'job-006',
    title: 'Operations Analyst',
    department: 'Operations',
    type: 'Contract',
    location: 'Mbale',
    closingDate: '18 Apr 2026',
    pdfUrl: CAREER_PDF_URL,
  },
];
