export const mockJobData = {
  id: "Job-00652",
  title: "Website Re-design for BrightTech",
  client: {
    name: "Brighten Solution",
    id: "CLT-001",
    email: "contact@brightensolution.com",
    phone: "+1 234 567 8900",
  },
  jobType: "One-Time",
  createdFrom: {
    type: "quote",
    id: "QT-00048",
  },
  issueDate: "May 22, 2025",
  startDate: "May 23, 2025",
  endDate: "May 24, 2025",
  totalAmount: "$760",
  duration: "2 Weeks",
  status: "scheduled",
  priority: "high",
  instructions:
    "Key actions include researching competitors, creating a mobile-first user experience, updating content, and conducting thorough SEO, design, and functionality testing before launch.",
  notes: "Client requested weekly updates. Prefers communication via email.",

  // Traditional tasks with checkboxes
  tasks: [
    {
      id: 1,
      name: "Research competitors",
      completed: true,
      dueDate: "May 20, 2025",
    },
    {
      id: 2,
      name: "Create mobile-first user experience",
      completed: true,
      dueDate: "May 21, 2025",
    },
    {
      id: 3,
      name: "Update content",
      completed: false,
      dueDate: "May 22, 2025",
    },
    {
      id: 4,
      name: "SEO optimization",
      completed: false,
      dueDate: "May 23, 2025",
    },
    {
      id: 5,
      name: "Design testing",
      completed: false,
      dueDate: "May 23, 2025",
    },
    {
      id: 6,
      name: "Functionality testing",
      completed: false,
      dueDate: "May 24, 2025",
    },
  ],


  attachments: [
    {
      id: 1,
      name: "Brand Guidelines.pdf",
      date: "April 9, 2025",
      size: "1.2 MB",
      type: "pdf",
    },
    {
      id: 2,
      name: "Content Assets.zip",
      date: "April 8, 2025",
      size: "4.8 MB",
      type: "zip",
    },
    {
      id: 3,
      name: "Client Requirements.docx",
      date: "April 7, 2025",
      size: "856 KB",
      type: "docx",
    },
    {
      id: 3,
      name: "Client Requirements.jpeg",
      date: "April 7, 2025",
      size: "856 KB",
      type: "jpeg",
    },
    {
      id: 3,
      name: "Client Requirements.png",
      date: "April 7, 2025",
      size: "856 KB",
      type: "png",
    },
    {
      id: 3,
      name: "Client Requirements.xlsx",
      date: "April 7, 2025",
      size: "856 KB",
      type: "xlsx",
    },
    {
      id: 3,
      name: "Client Requirements.ppt",
      date: "April 7, 2025",
      size: "856 KB",
      type: "ppt",
    },
  ],
};
