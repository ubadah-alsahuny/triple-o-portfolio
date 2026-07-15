import React from "react";
import styles from "./Home.module.css";

const links = [
  { name: "Canva", url: "https://www.canva.com", icon: "🎨" },
  { name: "LinkedIn", url: "https://www.linkedin.com", icon: "💼" },
  { name: "Color Palettes", url: "https://colorhunt.co/", icon: "🌈" },
  { name: "Figma", url: "https://www.figma.com", icon: "🧩" },
];

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>

      <header className="z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Portofolio✨
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Access the top platforms every designer needs — all in one place.
        </p>
      </header>

      <section className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl px-4 z-10">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.card} p-6 text-center text-xl font-semibold flex flex-col items-center justify-center`}
          >
            <span className="text-3xl mb-2">{link.icon}</span>
            {link.name}
          </a>
        ))}
      </section>
      <div className="mt-20 text-center z-10">
        <a
          href="Design"
          className="bg-blue-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          Start Designing Now
        </a>
      </div>

      <footer className="mt-20 text-center text-gray-500 text-sm z-10">
        Built with 💙 for creative designers by Portofolio
      </footer>
    </div>
  );
};

export default Home;
