import React, { useEffect, useState } from 'react';

export default function Confetti({ trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6', '#ec4899'];
    const startX = trigger.x || window.innerWidth / 2;
    const startY = trigger.y || window.innerHeight / 2;

    // Tạo 35 hạt pháo hoa cho mỗi lần click
    const newParticles = Array.from({ length: 35 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;
      return {
        id: `${trigger.id}-${i}`,
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4, // Hơi bay lên trên
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        shape: Math.random() > 0.5 ? 'circle' : 'square',
        opacity: 1,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    const duration = 1000; // Hiệu ứng kéo dài 1 giây
    const startTime = Date.now();

    const timer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => {
            const nextVy = p.vy + 0.25; // Trọng lực hút xuống
            const elapsed = Date.now() - trigger.id;
            const opacity = Math.max(0, 1 - elapsed / duration);
            return {
              ...p,
              x: p.x + p.vx,
              y: p.y + nextVy,
              vy: nextVy,
              rotation: p.rotation + p.rotationSpeed,
              opacity,
            };
          })
          .filter((p) => p.opacity > 0)
      );
    }, 16);

    const cleanup = setTimeout(() => {
      clearInterval(timer);
      setParticles((prev) => prev.filter((p) => !p.id.startsWith(String(trigger.id))));
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(cleanup);
    };
  }, [trigger]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            opacity: p.opacity,
            transition: 'opacity 0.05s linear',
          }}
        />
      ))}
    </div>
  );
}
