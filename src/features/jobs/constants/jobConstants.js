export const JOB_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

export const JOB_TYPE_OPTIONS = [
  { value: 'one_time', label: 'One-Time' },
  { value: 'recurring', label: 'Recurring' },
  { value: 'emergency', label: 'Emergency' }
];

export const JOB_PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'info' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'error' },
  { value: 'urgent', label: 'Urgent', color: 'error' }
];

export const INITIAL_JOB_VALUES = {
  title: '',
  client_id: '',
  job_type: 'one_time',
  priority: 'medium',
  status: 'draft',
  description: '',
  instructions: '',
  notes: '',
  issue_date: '',
  start_date: '',
  end_date: '',
  created_from_type: '',
  created_from_id: '',
  tasks: [],
  attachments: []
};