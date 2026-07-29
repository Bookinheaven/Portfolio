# Tanvik Sri Ram Reddy - Personal Portfolio

A sleek, modern, and highly interactive personal portfolio built for performance and aesthetics. Designed with a minimalist "developer-first" approach, featuring asymmetrical bento-box layouts, premium micro-interactions, and a data-driven architecture.

## 🚀 Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Data Architecture**: Fully driven by a central `portfolio.json` file for easy updates.

## ✨ Key Features

- **True Bento Layout**: An asymmetrical project grid that highlights key work.
- **"Flashlight" Mouse Tracking**: Premium interactive glow effects that track the cursor over project cards.
- **Ambient Glow & Gradients**: Subtle, slow-moving background meshes and gradient typography.
- **Fully Responsive**: Optimized for desktops, tablets, and mobile devices.
- **Data-Driven**: All content (projects, skills, socials) is loaded dynamically from `src/data/portfolio.json`. Adding a new project or skill takes seconds and requires zero component rewrites.

## 🛠️ Local Development

To run this project locally on your machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Bookinheaven/portfolio.git
   ```

2. **Navigate to the directory**
   ```bash
   cd portfolio
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173` (or the port provided in your terminal).

## 📁 Project Structure

```
portfolio/
├── public/                 # Static assets (images, favicon)
├── src/
│   ├── components/         # Reusable React components (Hero, Projects, Skills, etc.)
│   ├── data/               # Contains portfolio.json for central data management
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global styles and custom Tailwind utilities (glow effects)
│   └── main.jsx            # React entry point
├── tailwind.config.js      # Tailwind configuration
└── vite.config.js          # Vite configuration
```

## 📝 Updating Content

To update the portfolio with your own information, simply edit the `src/data/portfolio.json` file. The entire site will dynamically update based on the data provided there.

- Add your resume to the `public/` directory and ensure the name matches the `resumeUrl` in the JSON.
- Add your project screenshots to `public/images/projects/`.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
