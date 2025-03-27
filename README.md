# NsbmMathMaster

NsbmMathMaster is a web application designed to provide an interactive platform for learning and practicing mathematics. It offers various features for students, admins, and super admins to enhance the learning experience and manage the system effectively.

## Features

-   **User Roles:** Different roles with specific functionalities:
    -   **Students:** Take quizzes, view leaderboards, and track progress.
    -   **Admins:** Manage questions, monitor student progress, and generate reports.
    -   **Super Admins:** Manage users, control quiz settings, and oversee system settings.
-   **Interactive Quizzes:** Engaging quizzes with timers and real-time feedback.
-   **User Management:** User registration, login, and profile management.
-   **Admin Panel:** Comprehensive admin interface for managing questions, users, and system settings.
-   **Super Admin Panel:** Advanced control panel for user management, quiz controls, and system settings.
-   **Leaderboard:** Display of top-performing students.
-   **Progress Monitoring:** Admins can monitor student progress and identify areas for improvement.
-   **Login Activity Tracking:** Super admins can track user login activity for security purposes.
-   **Customizable UI:** Utilizes Tailwind CSS and Radix UI components for a modern and responsive user interface.

## Technologies Used

-   **Frontend:**
    -   React
    -   TypeScript
    -   Tailwind CSS
    -   Radix UI
    -   Vite
-   **Backend:**
    -   Node.js
    -   Express
    -   Drizzle ORM
-   **Database:**
    -   Placeholder (Replace with actual database details)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd NsbmMathMaster
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the database:**

    -   Configure the database connection in `drizzle.config.ts`.
    -   Run database migrations:

        ```bash
        drizzle-kit generate:mysql
        drizzle-kit push:mysql
        ```

4.  **Configure environment variables:**

    -   Create a `.env` file in the project root.
    -   Add the following environment variables:

        ```
        DATABASE_URL=<your-database-url>
        ```

5.  **Start the development server:**

    ```bash
    npm run dev
    ```

## Usage

1.  **Access the application:**

    -   Open your browser and navigate to `http://localhost:5173`.

2.  **Login:**

    -   Use the appropriate login form based on your role (student, admin, or super admin).

3.  **Explore the features:**

    -   Students can take quizzes and view their leaderboard position.
    -   Admins can manage questions, monitor student progress, and generate reports.
    -   Super Admins can manage users, control quiz settings, and oversee system settings.

## Folder Structure

```
NsbmMathMaster/
├── .gitignore
├── .replit
├── cookies.txt
├── drizzle.config.ts
├── generated-icon.png
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── student_cookies.txt
├── superadmin_cookies.txt
├── tailwind.config.ts
├── theme.json
├── tsconfig.json
├── vite.config.ts
├── client/
│   ├── index.html
│   ├── public/
│   │   ├── images/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── login/
│   │   │   ├── quiz/
│   │   │   ├── super-admin/
│   │   │   └── ui/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── superadmin/
│   │   └── styles/
├── server/
└── shared/
    └── schema.ts
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with clear, concise messages.
4.  Submit a pull request.

## License
[Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
