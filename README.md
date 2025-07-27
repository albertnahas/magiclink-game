# MagicLink - AI-Powered Word Connection Game

An interactive word connection game where players bridge two words using exactly 5 intermediate steps, powered by OpenAI's GPT-4o-mini for intelligent validation and hints.

## ✨ Features

- **AI-Powered Gameplay**: OpenAI integration for word validation and intelligent hints
- **Interactive 3D Visualization**: Three.js animated progress visualization
- **Mobile-Responsive Design**: Drawer navigation and optimized mobile layout
- **Real-Time Validation**: Immediate feedback on word connections
- **Hint System**: Get the next word without revealing the entire solution
- **Undo Functionality**: Step back through your progress
- **Visual Progress**: Colored progress indicators showing completion status

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js with react-three-fiber
- **AI Integration**: OpenAI GPT-4o-mini
- **Deployment**: Vercel

## 🛠️ Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/albertnahas/magiclink-game.git
cd magiclink-game
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Play

1. **Start**: The game presents you with two words - a start word and a target word
2. **Connect**: Find 5 intermediate words that logically connect the start to the target
3. **Validate**: Each word is validated by AI to ensure it makes sense
4. **Progress**: Watch the 3D visualization update as you make connections
5. **Win**: Complete all 5 steps to successfully bridge the words!

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Mobile Features

- **Responsive Layout**: Optimized for mobile devices
- **Drawer Navigation**: Slide-out menu for game controls
- **Touch-Friendly**: Large buttons and intuitive interactions

## 🎯 Game Controls

- **New Game**: Generate a fresh word pair
- **Hint**: Get the next word in the sequence
- **Undo**: Step back through your progress
- **Solve**: Reveal the complete solution

## 🚀 Deployment

### Vercel (Recommended)

1. **Fork this repository**
2. **Connect to Vercel**: Import your fork on [vercel.com](https://vercel.com)
3. **Add Environment Variables**: Set your `OPENAI_API_KEY` in Vercel dashboard
4. **Deploy**: Vercel will automatically deploy your app

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Live Demo](https://magiclink-game.vercel.app) (coming soon)
- [GitHub Repository](https://github.com/albertnahas/magiclink-game)

---

Built with ❤️ using Next.js and OpenAI