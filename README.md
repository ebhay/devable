# Devable 🚀

**Devable** is a premium, distraction-free learning platform that transforms YouTube playlists into structured, trackable developer-grade courses. It features a built-in code compiler, progress tracking, and a high-performance UI designed for compounding skills.

![Devable Hero Image](https://image2url.com/r2/default/images/1769284812145-7a6ef516-f452-445c-a038-4d2f5a1e90a9.png)

## ✨ Features

- **📺 YouTube Integration**: Instantly import any public or unlisted YouTube playlist as a structured course.
- **💻 Built-in Compiler**: Practice coding directly within the platform with support for multiple languages.
- **📊 Progress Tracking**: Automatically track watched lessons and visualize your progress with real-time statistics.
- **🎯 Distraction-Free**: No recommendations, no ads, and no algorithm traps. Just focused learning.
- **🛡️ Secure Auth**: seamless login with Credentials or Google OAuth 2.0.
- **🎨 Premium UI**: Modern aesthetics using Inter font, Magic UI components, and perfect Dark Mode support.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Prisma](https://www.prisma.io/))
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Components**: [Magic UI](https://magicui.design/), [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm / npm / yarn
- A MongoDB database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/devable.git
   cd devable
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory based on the `.env.example` provided.

4. **Initialize Prisma:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**
   ```bash
   pnpm dev
   ```

6. **Open in browser:**
   Go to [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```env
# Database
DATABASE_URL=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# External APIs
YOUTUBE_API_KEY=your_youtube_data_v3_api_key
OPEN_ROUTER_KEY=your_open_router_key_for_ai_features
MODEL=nvidia/nemotron-3-nano-30b-a3b:free

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ for developers who want to learn faster.
