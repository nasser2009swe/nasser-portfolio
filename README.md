# Portfolio | Nasser Mondey Hagag

> Business software engineering portfolio — invoice systems, POS billing, PDF generators, thermal printer integrations, and Flutter applications.

![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)

A premium portfolio website built with **Next.js 16**, **Tailwind CSS v4**, **Framer Motion**, and **Firebase**. Features a SaaS-style dark UI, project showcases with video embeds, and a secure admin dashboard.

## ✨ Features

- **SaaS-Style Dark UI** — Gradients, glassmorphism, scroll animations, micro-interactions
- **Project Showcase** — Detail pages with video embeds (YouTube, Facebook, local), image lightbox galleries, tech stack, features, challenges, and solutions
- **Admin Dashboard** — Firebase Auth login, full CRUD for projects, drag-and-drop image upload to Firebase Storage
- **Contact Form** — Submissions stored in Firebase Firestore with success/error feedback
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop
- **SEO Optimized** — Open Graph metadata, semantic HTML, fast loading
- **Smooth Animations** — Framer Motion scroll reveals, hover effects, page transitions
- **Error Handling** — Error boundaries, loading skeletons, graceful fallbacks

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Backend & Auth** | Firebase (Auth, Firestore, Storage) |
| **Icons** | react-icons (Feather, Simple Icons) |
| **Utilities** | clsx, tailwind-merge |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or 20+
- **Firebase** project with Authentication (Email/Password), Firestore, and Storage enabled

### Setup

```bash
# Clone the repository
git clone https://github.com/nouramondey-wq/portfolio-site.git
cd portfolio-site

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project credentials (from Firebase Console > Project Settings > Your apps > Web app):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site will auto-update as you edit.

### Admin Access

Navigate to `/admin/login` and sign in with your Firebase Authentication email and password.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard and login
│   ├── projects/[id]/      # Dynamic project detail pages
│   └── page.tsx            # Homepage
├── components/
│   ├── admin/              # Admin dashboard components
│   ├── home/               # Homepage section components
│   ├── layout/             # Header and Footer
│   ├── projects/           # Project display components
│   └── ui/                 # Reusable UI primitives
├── context/                # React context providers
├── lib/                    # Firebase config and utilities
└── types/                  # TypeScript type definitions
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push the repository to GitHub
2. Import the project into [Vercel](https://vercel.com)
3. Add your Firebase environment variables in Vercel's dashboard
4. Deploy — your site will be live in seconds

### Manual Build

```bash
npm run build
npm start
```

## 📜 Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 📄 License

MIT
