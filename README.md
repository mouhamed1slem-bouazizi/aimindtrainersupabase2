# AI Mind Trainer

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0-green.svg)
![Supabase](https://img.shields.io/badge/database-Supabase-3ecf8e.svg)

An intelligent mind training application powered by AI and backed by Supabase for seamless data management and real-time capabilities.

## 🧠 About

AI Mind Trainer is designed to help users enhance their cognitive abilities through personalized AI-driven exercises and training modules. The application leverages modern web technologies and AI algorithms to provide an engaging and effective learning experience.

## ✨ Features

- **AI-Powered Training**: Intelligent algorithms that adapt to user performance
- **Real-time Progress Tracking**: Monitor your cognitive improvement over time
- **Personalized Exercises**: Customized training modules based on individual needs
- **User Authentication**: Secure login and profile management
- **Data Persistence**: All progress and user data stored securely with Supabase
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn package manager
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mouhamed1slem-bouazizi/aimindtrainersupabase2.git
   cd aimindtrainersupabase2
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI/ML**: OpenAI API / Custom AI models
- **Deployment**: Vercel

## 📱 Usage

1. **Sign Up/Login**: Create an account or log in to access your personal training dashboard
2. **Choose Training Module**: Select from various cognitive training exercises
3. **Complete Exercises**: Follow AI-guided instructions to complete training sessions
4. **Track Progress**: View detailed analytics of your performance and improvement
5. **Customize Settings**: Adjust difficulty levels and training preferences

## 🗂️ Project Structure

```
aimindtrainersupabase2/
├── components/          # Reusable UI components
├── pages/              # Next.js pages
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── styles/             # Global styles and Tailwind config
├── public/             # Static assets
├── supabase/           # Database migrations and schemas
└── README.md
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Set up the required tables using the provided SQL schema
3. Configure Row Level Security (RLS) policies
4. Update your environment variables

### Database Schema

The application uses the following main tables:
- `users`: User profiles and preferences
- `training_sessions`: Individual training session records
- `exercises`: Available training exercises
- `user_progress`: Progress tracking and analytics

## 🤝 Contributing

We welcome contributions to improve AI Mind Trainer! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

## 🐛 Bug Reports

If you find a bug, please create an issue with the following information:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Supabase team for the excellent backend-as-a-service platform
- OpenAI for AI capabilities
- The open-source community for inspiration and resources

## 📞 Contact

**Mohamed Islem Bouazizi**
- GitHub: [@mouhamed1slem-bouazizi](https://github.com/mouhamed1slem-bouazizi)
- Email: [your-email@example.com](mailto:mib@programmer.net)

## 🔗 Links

- [Live Demo](https://aimindtrainersupabase2.vercel.app/)
- [Documentation](https://aimindtrainersupabase2.vercel.app/)
- [Report Bug](https://github.com/mouhamed1slem-bouazizi/aimindtrainersupabase2/issues)
- [Request Feature](https://github.com/mouhamed1slem-bouazizi/aimindtrainersupabase2/issues)

---

⭐ **Star this repository if you found it helpful!**
