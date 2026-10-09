// Sample data for the Push Campaign page.
// TODO (backend): replace these lists with the real API response.

// Waba accounts. "name" is the account holder name shown in the dropdown.
export const wabaAccounts = [
  { id: '1', name: 'Reaplift', number: '918951872233' },
  { id: '2', name: 'Kstewd', number: '919071717270' },
]

export const templateTypes = ['Utility', 'Marketing']

// mediaType can be: Text, Image, Video or Document
export const templates = [
  {
    id: '1',
    name: 'order_update',
    type: 'Utility',
    mediaType: 'Text',
    body: 'Hello, your order has been shipped and will reach you soon.',
  },
  {
    id: '2',
    name: 'invoice_copy',
    type: 'Utility',
    mediaType: 'Document',
    body: 'Hello, please find your invoice attached.',
  },
  {
    id: '3',
    name: 'festival_offer',
    type: 'Marketing',
    mediaType: 'Image',
    body: 'Festival offer! Get 20% off on all services this week.',
  },
  {
    id: '4',
    name: 'product_launch',
    type: 'Marketing',
    mediaType: 'Video',
    body: 'Our new product is here. Watch the video to know more.',
  },
]

// Step 2: who should get the message
export const audienceTypes = ['File', 'Group', 'Tag']

export const groups = ['All Customers', 'New Leads', 'Old Customers']

export const tags = ['VIP', 'Follow Up', 'Interested']

export const workflows = ['Welcome Flow', 'Feedback Flow']

export const countries = [
  { code: '91', label: 'IND - 91' },
  { code: '1', label: 'USA - 1' },
  { code: '971', label: 'UAE - 971' },
]
