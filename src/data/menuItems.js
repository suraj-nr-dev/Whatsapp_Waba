// Sidebar menu list.
// "icon" is a name from components/Icon.jsx.
// If an item has "children", it becomes a dropdown.
export const menuItems = [
  { label: 'Home', icon: 'home' },
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Push Campaign', icon: 'send' },
  { label: 'Reports', icon: 'file' },
  {
    label: 'Templates',
    icon: 'fileText',
    children: ['Create Template', 'Template List'],
  },
  {
    label: 'Extra Report',
    icon: 'filePlus',
    children: ['Summary Report', 'Detailed Report'],
  },
  {
    label: 'Settings',
    icon: 'settings',
    children: ['Profile', 'Change Password'],
  },
  {
    label: 'Chat Settings',
    icon: 'chat',
    children: ['Quick Replies', 'Chat Assign'],
  },
  {
    label: 'Automation',
    icon: 'automation',
    children: ['Chatbot', 'Auto Reply'],
  },
  { label: 'API Information', icon: 'info' },
]
