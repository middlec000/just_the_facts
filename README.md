# Social Media App

This is a social media web application that allows users to post statements, manage evidence, and interact with other users. 

## Features

- **User Authentication**: Users can log in to their accounts to manage their posts and profile.
- **Post Management**: Users can create, edit, and delete their posts.
- **Evidence Display**: Users can attach and view evidence related to their posts.
- **Profile Management**: Users can view and edit their profile information and see their posts.
- **Home Page**: A landing page that displays all user posts and evidence.

## Project Structure

```
social-media-app
├── src
│   ├── components
│   │   ├── Post.tsx
│   │   ├── Evidence.tsx
│   │   └── ManageStatements.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── Profile.tsx
│   │   └── Login.tsx
│   ├── services
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── styles
│   │   └── main.css
│   ├── App.tsx
│   └── index.tsx
├── public
│   ├── index.html
│   └── favicon.ico
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install the necessary dependencies.
4. Start the development server with `npm start`.

## Usage Guidelines

- Users must log in to create or manage posts.
- Posts can include text content and associated evidence.
- Evidence can be linked to external resources for verification.

## License

This project is licensed under the MIT License.