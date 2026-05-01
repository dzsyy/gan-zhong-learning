import { useEffect, useRef } from 'react';
import { useAppStore } from '../../stores/appStore';

export function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (10 + Math.random() * 10) + 's';
      const size = 2 + Math.random() * 4;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      container.appendChild(particle);
    }
  }, []);

  return <div ref={containerRef} className="particles" />;
}

const navItems = [
  { id: 'inbox', icon: '📥', label: '收集箱' },
  { id: 'projects', icon: '📋', label: '项目清单' },
  { id: 'execution', icon: '⚡', label: '执行清单' },
  { id: 'possibility', icon: '💭', label: '可能清单' },
  { id: 'recycle', icon: '♻️', label: '回收箱' },
  { id: 'archive', icon: '📦', label: '归档' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentPage, setCurrentPage, currentProject, setCurrentProject } = useAppStore();

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    if (currentProject) {
      setCurrentProject(null);
    }
  };

  return (
    <>
      <Particles />
      <div className="app-container">
        <div className="sidebar">
          <div className="sidebar-title">干中学</div>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className="main-content">{children}</div>
      </div>
    </>
  );
}