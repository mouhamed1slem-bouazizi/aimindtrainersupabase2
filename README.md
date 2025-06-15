AI Mind Trainer App
Description
The AI Mind Trainer App is designed to help users enhance their cognitive abilities through various AI-powered exercises and training modules. This application aims to provide a personalized learning experience, adapting to individual progress and focusing on areas that require improvement. It leverages artificial intelligence to create dynamic challenges and track performance, making mind training engaging and effective.
Features
Personalized Training: AI algorithms adapt exercises based on user performance and learning patterns.
Diverse Modules: A variety of cognitive training exercises targeting memory, problem-solving, attention, and more.
Progress Tracking: Detailed analytics and visualizations to monitor your improvement over time.
Interactive UI: A clean and intuitive user interface for a seamless training experience.
Supabase Integration: Secure and efficient data management for user profiles, progress, and settings.
Technologies Used
Frontend: (Next.js)
Backend/Database: Supabase (for authentication, real-time database, and potentially storage/functions).
AI/ML: (Implicit, describe specific libraries or models if used, e.g., TensorFlow.js, custom AI models).
Setup
To get a local copy up and running, follow these simple steps.
Prerequisites
Node.js (if using a JavaScript frontend)
npm or yarn
A Supabase account and project
Git
Installation
Clone the repository:
git clone https://github.com/mouhamed1slem-bouazizi/aimindtrainersupabase2.git
cd aimindtrainersupabase2


Install dependencies:
npm install
# or
yarn install


Set up Supabase:
Create a new project on Supabase.
Go to Project Settings -> API and copy your Project URL and Anon Public Key.
Create a .env file in the root of your project and add the following:
VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_PUBLIC_KEY"

(Note: The VITE_ prefix is common for Vite projects. Adjust prefix if using a different build tool like REACT_APP_ for Create React App.)
Run the application:
npm run dev
# or
yarn dev

The application should now be running on http://localhost:5173 (or a similar port).
Usage
Once the application is running, you can:
Sign Up/Log In: Create a new account or log in with existing credentials.
Explore Training Modules: Navigate through various mind training exercises.
Start Training: Engage with the interactive exercises.
View Progress: Check your performance metrics and track your cognitive improvements over time.
Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
License
Distributed under the MIT License. See LICENSE for more information.
Contact
Mouhamed Islem Bouazizi - https://github.com/mouhamed1slem-bouazizi
Project Link: https://github.com/mouhamed1slem-bouazizi/aimindtrainersupabase2
