# Todo Web Application

A modern, feature-rich Todo application built with Next.js 16, TypeScript, and Tailwind CSS. This application provides a seamless user experience for managing tasks with drag-and-drop functionality, user authentication, and a beautiful UI.

## 🚀 Features

### Authentication

- **Signup Page**: Complete user registration with form validation
- **Login Page**: Secure login with email and password
- **Profile Management**: Update user information and view account statistics

### Todo Management

- **Create Todos**: Add new tasks with title and optional description
- **Update Todos**: Edit existing tasks inline
- **Delete Todos**: Remove completed or unwanted tasks
- **Mark as Complete**: Toggle task completion status
- **Drag & Drop Reordering**: Intuitively reorder tasks by priority
- **Filter Tasks**: View all, active, or completed tasks
- **Task Statistics**: Real-time dashboard showing total, active, and completed tasks

### UI/UX

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Elegant loading indicators for better user experience
- **Empty States**: Helpful messages when no data is available

## 📁 Project Structure

```
todo-app/
├── src/
│   ├── app/
│   │   └── [locale]/
│   │       ├── (auth)/
│   │       │   ├── login/
│   │       │   │   └── page.tsx          # Login page
│   │       │   └── signup/
│   │       │       └── page.tsx          # Signup page
│   │       ├── (private)/
│   │       │   ├── todos/
│   │       │   │   └── page.tsx          # Todo management page
│   │       │   └── profile/
│   │       │       └── page.tsx          # Profile page
│   │       ├── (public)/
│   │       │   └── (landing-page)/
│   │       │       └── page.tsx          # Landing page
│   │       └── layout.tsx                # Root layout with Toaster
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx                # Reusable button component
│   │   │   ├── Input.tsx                 # Input with validation
│   │   │   ├── Textarea.tsx              # Textarea component
│   │   │   ├── Card.tsx                  # Card container
│   │   │   ├── Modal.tsx                 # Modal dialog
│   │   │   └── Loading.tsx               # Loading component
│   │   ├── todo/
│   │   │   ├── TodoItem.tsx              # Individual todo item
│   │   │   ├── TodoList.tsx              # List with drag-and-drop
│   │   │   └── TodoModal.tsx             # Add/Edit todo modal
│   │   ├── layout/
│   │   │   └── Header.tsx                # App header with navigation
│   │   └── ProtectedRoute.tsx            # Route protection wrapper
│   ├── hooks/
│   │   └── useAuth.ts                    # Authentication hook
│   ├── types/
│   │   ├── todo.ts                       # Todo type definitions
│   │   └── user.ts                       # User type definitions
│   ├── utils/
│   │   └── context/
│   │       ├── TodoContext.tsx           # Todo state management
│   │       └── AuthContext.tsx           # Auth state management
│   ├── middleware.ts                     # Route protection middleware
│   └── i18n/                            # Internationalization setup
└── package.json
```

## 🛠️ Technologies Used

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **Notifications**: react-hot-toast
- **Icons**: react-icons
- **Utilities**: clsx, tailwind-merge
- **Internationalization**: next-intl

## 📦 Installation

1. **Clone the repository**

   ```bash
   cd todo-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Getting Started

### First Time Users

1. Visit the landing page at `http://localhost:3000`
2. Click "Get Started" or "Sign Up"
3. Create an account with your name, email, and password
4. You'll be automatically redirected to the todos page

### Existing Users

1. Click "Login" on the landing page
2. Enter your email and password
3. Access your todos and profile

## 📝 Usage Guide

### Creating a Todo

1. Navigate to the Todos page
2. Click the "Add Todo" button
3. Enter a title (required) and optional description
4. Click "Add Todo" to save

### Managing Todos

- **Complete a todo**: Click the checkbox next to the todo
- **Edit a todo**: Click the edit icon (pencil)
- **Delete a todo**: Click the delete icon (trash)
- **Reorder todos**: Drag and drop using the grip handle

### Filtering Todos

Use the filter buttons to view:

- **All**: View all todos
- **Active**: View incomplete todos only
- **Completed**: View completed todos only

### Profile Management

1. Click "Profile" in the navigation
2. Update your name or email
3. Click "Save Changes"
4. View your account statistics

## 🎨 Design Features

### Components

All components are built with:

- Type safety (TypeScript)
- Accessibility in mind
- Responsive design
- Smooth animations
- Loading states
- Error handling

### UI Elements

- **Buttons**: Multiple variants (primary, secondary, danger, ghost)
- **Inputs**: Built-in validation and error messages
- **Cards**: Hover effects and shadows
- **Modals**: Backdrop blur and smooth transitions
- **Toast**: Success, error, and info notifications

## 🔒 Authentication

Currently uses localStorage for demo purposes. The authentication system includes:

- User registration with validation
- Login functionality
- Protected routes
- User session management
- Profile updates

**Note**: For production use, integrate with a real backend API for secure authentication.

## 💾 Data Storage

Currently uses localStorage for demo purposes. All todos are:

- Persisted in browser localStorage
- Loaded automatically on page load
- Updated in real-time
- Associated with the logged-in user

**Note**: For production use, integrate with a backend API and database.

## 🌐 Internationalization

The app is set up with next-intl for multi-language support:

- English (en) - Default
- Bengali (bn) - Available

Language can be switched via the URL: `/en/todos` or `/bn/todos`

## 🔐 Route Protection

The middleware automatically handles:

- Redirecting unauthenticated users to login
- Protecting private routes (/todos, /profile)
- Redirecting authenticated users away from auth pages

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- Mobile: 320px and up
- Tablet: 768px and up
- Desktop: 1024px and up
- Large Desktop: 1280px and up

## 🎯 Key Features Implementation

### Drag and Drop

Implemented using @dnd-kit with:

- Smooth animations
- Touch support
- Keyboard navigation
- Visual feedback during drag

### Form Validation

All forms include:

- Real-time validation
- Clear error messages
- Disabled states during submission
- Success feedback

### State Management

- **TodoContext**: Manages all todo operations
- **useAuth Hook**: Manages authentication state
- Local state for UI interactions

## 📄 License

This project is created for assessment purposes.

## 🤝 Contributing

This is an assessment project. For production use, consider:

1. Implementing a real backend
2. Adding proper authentication
3. Adding tests (Jest, React Testing Library)
4. Implementing CI/CD
5. Adding error boundaries
6. Performance optimization

## 📞 Support

For issues or questions about this assessment project, please contact the project maintainer.

---

Built with ❤️ using Next.js and TypeScript
