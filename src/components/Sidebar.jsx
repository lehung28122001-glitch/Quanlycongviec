
import { 
  CheckSquare, 
  TrendingUp, 
  Sun, 
  Moon, 
  Layers, 
  Briefcase, 
  User,
  LogOut
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: Layers },
  { id: 'work', name: 'Công việc', icon: Briefcase },
  { id: 'personal', name: 'Cá nhân', icon: User },
];

export default function Sidebar({ 
  activeCategory, 
  setActiveCategory, 
  tasks, 
  theme, 
  toggleTheme,
  currentUser,
  onLogout
}) {
  // Tính toán số lượng task cho từng category
  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return tasks.length;
    return tasks.filter((t) => t.category === categoryId).length;
  };

  // Tính toán tiến độ hoàn thành chung
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <aside className="app-sidebar">
      {/* Header Sidebar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            backgroundColor: 'var(--accent-primary)', 
            color: 'white', 
            width: '36px', 
            height: '36px', 
            borderRadius: 'var(--radius-sm)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 10px var(--accent-glow)'
          }}>
            <CheckSquare size={20} />
          </div>
          <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 800 }}>FocusTask</h1>
        </div>
        
        {/* Toggle Theme Button */}
        <button 
          onClick={toggleTheme} 
          className="btn-icon" 
          title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
          style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Progress Section */}
      <div style={{ 
        padding: '1.25rem', 
        background: 'rgba(255, 255, 255, 0.01)', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-md)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <TrendingUp size={14} /> Tiến độ hoàn thành
          </span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{completionPercent}%</span>
        </div>
        <div style={{ height: '6px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${completionPercent}%`, 
              height: '100%', 
              backgroundColor: 'var(--accent-primary)', 
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
            }} 
          />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: 500 }}>
          Đã hoàn thành {completedTasks}/{totalTasks} công việc
        </div>
      </div>

      {/* Navigation / Filter Section */}
      <div>
        <div className="filter-title">Danh mục</div>
        <div className="filter-list">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`filter-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <IconComponent size={16} />
                  <span>{cat.name}</span>
                </div>
                <span className="filter-count">{getCategoryCount(cat.id)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar" title={currentUser}>
            {currentUser ? currentUser.charAt(0) : 'U'}
          </div>
          <div className="user-details">
            <span className="user-name" title={currentUser}>{currentUser}</span>
            <span className="user-role">Thành viên</span>
          </div>
        </div>
        <button 
          onClick={onLogout} 
          className="btn-icon btn-icon-danger" 
          title="Đăng xuất"
          style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
