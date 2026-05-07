/** Mirrors server/models/User.js enums for forms and validation UX. */

export const ROLE_CATEGORIES = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'data', label: 'Data & analytics' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
  { value: 'hr', label: 'HR / people' },
  { value: 'finance', label: 'Finance' },
  { value: 'other', label: 'Other' },
]

export const INDUSTRIES = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Education' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'media', label: 'Media' },
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'government', label: 'Government' },
  { value: 'other', label: 'Other' },
]

export const WORK_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'In person' },
]

export const NOTIFY_CHANNELS = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'Text message' },
  { value: 'site', label: 'In app only' },
]

export const NOTIFY_FREQUENCIES = [
  { value: 'realtime', label: 'As soon as there are matches' },
  { value: 'daily', label: 'Daily digest' },
  { value: 'weekly', label: 'Weekly summary' },
]

export const APPLICATION_STATUSES = [
  { value: 'interested', label: 'Interested' },
  { value: 'applied', label: 'Applied' },
  { value: 'interviewed', label: 'Interviewed' },
  { value: 'second_round', label: 'Second round' },
  { value: 'follow_up', label: 'Follow up required' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'archived', label: 'Archived' },
]
