import { useState, useEffect } from 'react'
import './App.css'

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const PROJECTS = [
  {
    id: 1,
    title: 'Brand Identity System',
    category: 'Branding · UI',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'E-commerce Experience',
    category: 'UX · Product',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Mobile App Redesign',
    category: 'UI · Mobile',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    title: 'Design System',
    category: 'Design Ops',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
  },
]

const TECH_STACK = [
  'Figma', 'Framer', 'React', 'Tailwind CSS', 'Adobe XD',
  'Sketch', 'Principle', 'After Effects', 'Illustrator', 'Photoshop',
]

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1a1a1a] font-sans antialiased">
      {/* Sticky Header with Glassmorphism */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-xl border-b border-black/5 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="text-lg font-semibold tracking-tight text-[#1a1a1a]">
            Portfolio
          </a>
          <ul className="flex items-center gap-10">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="text-sm font-medium text-[#1a1a1a]/80 hover:text-[#1a1a1a] transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="min-h-[85vh] flex flex-col justify-center px-6 lg:px-8 pt-24 pb-20 max-w-6xl mx-auto">
          <p className="text-sm font-medium tracking-widest uppercase text-[#1a1a1a]/50 mb-6">
            UI/UX Designer · 9 Years of Experience
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[1.08] tracking-tight text-[#1a1a1a] max-w-4xl">
            Experience-driven Designer
          </h1>
          <p className="mt-10 text-lg sm:text-xl text-[#1a1a1a]/70 max-w-xl leading-relaxed">
            사용자 경험을 중심으로 9년간 다양한 프로덕트를 설계해 왔습니다.
            데이터와 인사이트를 바탕으로 직관적이고 아름다운 인터페이스를 만듭니다.
          </p>
        </section>

        {/* Project Grid */}
        <section id="work" className="px-6 lg:px-8 py-24 max-w-6xl mx-auto">
          <h2 className="text-sm font-medium tracking-widest uppercase text-[#1a1a1a]/50 mb-12">
            Selected Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="px-6 lg:px-8 py-24 max-w-6xl mx-auto">
          <h2 className="text-sm font-medium tracking-widest uppercase text-[#1a1a1a]/50 mb-12">
            Tools & Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {TECH_STACK.map((tool) => (
              <span
                key={tool}
                className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-[#1a1a1a]/10 text-[#1a1a1a]/80 hover:border-[#1a1a1a]/20 hover:text-[#1a1a1a] transition-colors"
              >
                {tool}
              </span>
            ))}
          </div>
        </section>

        {/* About & Contact placeholder */}
        <section id="about" className="px-6 lg:px-8 py-24 max-w-6xl mx-auto border-t border-[#1a1a1a]/10">
          <h2 className="text-sm font-medium tracking-widest uppercase text-[#1a1a1a]/50 mb-6">
            About
          </h2>
          <p className="text-lg text-[#1a1a1a]/70 max-w-2xl leading-relaxed">
            브랜드, 서비스, 프로덕트 전반의 디자인을 담당해 왔습니다.
            사용자 리서치부터 프로토타이핑, 디자인 시스템 구축까지 경험했습니다.
          </p>
        </section>

        <section id="contact" className="px-6 lg:px-8 py-24 max-w-6xl mx-auto">
          <h2 className="text-sm font-medium tracking-widest uppercase text-[#1a1a1a]/50 mb-6">
            Contact
          </h2>
          <a
            href="mailto:hello@example.com"
            className="text-2xl sm:text-3xl font-medium text-[#1a1a1a] hover:opacity-70 transition-opacity"
          >
            hello@example.com
          </a>
        </section>
      </main>

      <footer className="px-6 lg:px-8 py-8 max-w-6xl mx-auto border-t border-[#1a1a1a]/10 text-sm text-[#1a1a1a]/50">
        © {new Date().getFullYear()} Portfolio. All rights reserved.
      </footer>
    </div>
  )
}

function ProjectCard({ project }) {
  return (
    <a
      href="#"
      className="group block rounded-2xl overflow-hidden bg-white border border-[#1a1a1a]/5 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 pointer-events-none">
          <span className="text-white/90 text-sm font-medium">{project.category}</span>
          <span className="text-white text-xl font-semibold mt-1">{project.title}</span>
        </div>
      </div>
      <div className="p-6 group-hover:bg-[#F9F9F9]/50 transition-colors duration-300">
        <span className="text-sm text-[#1a1a1a]/50">{project.category}</span>
        <h3 className="text-lg font-semibold text-[#1a1a1a] mt-1">{project.title}</h3>
      </div>
    </a>
  )
}

export default App
