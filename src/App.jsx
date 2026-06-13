import { useState, useEffect } from 'react';
import { Plus, Search, ClipboardList, CheckCircle2, Clock, AlertCircle, Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import Confetti from './components/Confetti';
import AuthScreen from './components/AuthScreen';

// Một số công việc mẫu để người dùng không cảm thấy ứng dụng trống trải khi mở lần đầu
const DEFAULT_TASKS = [
  {
    id: 1,
    title: 'Tìm hiểu React Hooks cơ bản',
    desc: 'Học cách sử dụng useState, useEffect và useRef trong React.',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 ngày tới
    priority: 'high',
    category: 'work',
    completed: false,
    createdAt: new Date().toISOString(),
    subtasks: [
      { id: 1.1, text: 'Đọc tài liệu useState', completed: true },
      { id: 1.2, text: 'Thực hành useEffect cleanup', completed: false },
      { id: 1.3, text: 'Tạo ứng dụng đếm giờ với useRef', completed: false },
    ]
  },
  {
    id: 2,
    title: 'Hoàn thành bài tập Quản lý công việc',
    desc: 'Xây dựng ứng dụng Todo App kết hợp Pomodoro có giao diện đẹp mắt.',
    dueDate: new Date().toISOString().split('T')[0], // hôm nay
    priority: 'high',
    category: 'work',
    completed: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    subtasks: [
      { id: 2.1, text: 'Khởi tạo project Vite React', completed: true },
      { id: 2.2, text: 'Thiết kế giao diện CSS Glassmorphism', completed: true },
      { id: 2.3, text: 'Viết component Pomodoro Timer', completed: true },
      { id: 2.4, text: 'Tích hợp hiệu ứng pháo hoa hoàn thành', completed: false },
    ]
  },
  {
    id: 3,
    title: 'Mua quà sinh nhật cho bạn thân',
    desc: 'Mua một cuốn sách lập trình hoặc một bộ Lego nhỏ.',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 ngày tới
    priority: 'low',
    category: 'personal',
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    subtasks: []
  },
  {
    id: 4,
    title: 'Mua đồ tạp hóa cuối tuần',
    desc: 'Sữa, bánh mì, trái cây, rau quả tươi.',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // quá hạn 2 ngày
    priority: 'medium',
    category: 'personal',
    completed: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    subtasks: []
  }
];

export default function App() {
  // Khởi tạo người dùng hiện tại từ localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('focustask_currentUser') || '';
  });

  // Khởi tạo state tasks từ localStorage dựa theo currentUser
  const [tasks, setTasks] = useState(() => {
    const activeUser = localStorage.getItem('focustask_currentUser');
    if (activeUser) {
      const users = JSON.parse(localStorage.getItem('focustask_users')) || [];
      const user = users.find(u => u.username.toLowerCase() === activeUser.toLowerCase());
      if (user && user.tasks && user.tasks.length > 0) {
        return user.tasks;
      }
    }
    return DEFAULT_TASKS;
  });

  // Khởi tạo theme (mặc định tối 'dark')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('focustask_theme');
    return saved || 'dark';
  });

  // State bộ lọc và tìm kiếm
  const [activeCategory, setActiveCategory] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  // State quản lý Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // State tạo pháo hoa
  const [confettiTrigger, setConfettiTrigger] = useState(null);

  // Đồng bộ theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    } else {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    }
    localStorage.setItem('focustask_theme', theme);
  }, [theme]);

  // Đồng bộ tasks vào LocalStorage cho user hiện tại khi có thay đổi
  useEffect(() => {
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('focustask_users')) || [];
      const updatedUsers = users.map((u) => {
        if (u.username.toLowerCase() === currentUser.toLowerCase()) {
          return { ...u, tasks };
        }
        return u;
      });
      localStorage.setItem('focustask_users', JSON.stringify(updatedUsers));
    }
  }, [tasks, currentUser]);

  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
    localStorage.setItem('focustask_currentUser', username);
    
    const users = JSON.parse(localStorage.getItem('focustask_users')) || [];
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user && user.tasks && user.tasks.length > 0) {
      setTasks(user.tasks);
    } else {
      setTasks(DEFAULT_TASKS);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này?')) {
      setCurrentUser('');
      localStorage.removeItem('focustask_currentUser');
      setTasks([]);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check quá hạn
  const isTaskOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  // Thao tác Lưu Task (Thêm mới hoặc Cập nhật)
  const handleSaveTask = (taskData) => {
    if (taskToEdit) {
      setTasks(
        tasks.map((t) =>
          t.id === taskToEdit.id ? { ...t, ...taskData } : t
        )
      );
      setTaskToEdit(null);
    } else {
      const newTask = {
        id: Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([newTask, ...tasks]);
    }
  };

  // Thao tác Toggle hoàn thành task lớn
  const handleToggleComplete = (taskId, clickCoordinates) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            setConfettiTrigger(clickCoordinates);
          }
          const updatedSubtasks = t.subtasks?.map((sub) => ({
            ...sub,
            completed: nextCompleted,
          })) || [];
          return { ...t, completed: nextCompleted, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  // Thao tác Toggle hoàn thành subtask
  const handleToggleSubtaskComplete = (taskId, subtaskId, clickCoordinates) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map((sub) => {
            if (sub.id === subtaskId) {
              const nextCompleted = !sub.completed;
              if (nextCompleted) {
                setConfettiTrigger(clickCoordinates);
              }
              return { ...sub, completed: nextCompleted };
            }
            return sub;
          });

          // Tự động hoàn thành task chính nếu toàn bộ các subtasks đều hoàn thành
          const allSubtasksDone =
            updatedSubtasks.length > 0 &&
            updatedSubtasks.every((s) => s.completed);

          return {
            ...t,
            subtasks: updatedSubtasks,
            completed: allSubtasksDone ? true : t.completed,
          };
        }
        return t;
      })
    );
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      setTasks(tasks.filter((t) => t.id !== taskId));
    }
  };

  // Tính toán số liệu thống kê cho Dashboard
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => isTaskOverdue(t)).length;

  // Lọc và sắp xếp danh sách Task
  const filteredTasks = tasks
    .filter((t) => {
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.desc && t.desc.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesPriority && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDateAsc') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'priorityDesc') {
        const priorityWeights = { high: 3, medium: 2, low: 1 };
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      }
      if (sortBy === 'createdAtDesc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  const isFiltered = activeCategory !== 'all' || priorityFilter !== 'all' || searchQuery !== '';

  const handleResetFilters = () => {
    setActiveCategory('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar chứa Pomodoro và Lọc */}
      <Sidebar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        tasks={tasks}
        theme={theme}
        toggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Nội dung chính bên phải */}
      <main className="main-content">
        {/* Header Dashboard */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Bảng công việc <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Chào mừng bạn! Quản lý công việc hiệu quả mỗi ngày.
            </p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => { setTaskToEdit(null); setIsModalOpen(true); }}
            style={{ height: '40px', display: 'flex', alignItems: 'center' }}
          >
            <Plus size={18} /> Thêm công việc
          </button>
        </div>

        {/* Dashboard Stats */}
        <div className="stats-container">
          {/* Card 1: Tổng số */}
          <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
              <ClipboardList size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Tổng số</span>
              <span className="stat-value">{totalCount}</span>
            </div>
          </div>

          {/* Card 2: Hoàn thành */}
          <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--priority-low-text)' }}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--priority-low-text)' }}>
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Đã xong</span>
              <span className="stat-value">{completedCount}</span>
            </div>
          </div>

          {/* Card 3: Đang chờ */}
          <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--priority-medium-text)' }}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--priority-medium-text)' }}>
              <Clock size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Đang chờ</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
          </div>

          {/* Card 4: Quá hạn */}
          <div className="stat-card glass-panel" style={{ borderLeft: '4px solid var(--priority-high-text)' }}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--priority-high-text)' }}>
              <AlertCircle size={22} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Quá hạn</span>
              <span className="stat-value" style={{ color: overdueCount > 0 ? 'var(--priority-high-text)' : 'inherit' }}>
                {overdueCount}
              </span>
            </div>
          </div>
        </div>

        {/* Bộ lọc thanh công cụ */}
        <div className="glass-panel" style={{ 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          display: 'flex', 
          gap: '1rem', 
          alignItems: 'center', 
          flexWrap: 'wrap'
        }}>
          {/* Ô tìm kiếm */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Tìm kiếm công việc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search 
              size={18} 
              style={{ 
                position: 'absolute', 
                left: '0.875rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--text-muted)' 
              }} 
            />
          </div>

          {/* Bộ lọc mức độ ưu tiên */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Mọi độ ưu tiên</option>
              <option value="high">Độ ưu tiên: Cao</option>
              <option value="medium">Độ ưu tiên: Trung bình</option>
              <option value="low">Độ ưu tiên: Thấp</option>
            </select>
          </div>

          {/* Sắp xếp */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDateAsc">Sắp xếp: Hạn gần nhất</option>
              <option value="priorityDesc">Sắp xếp: Ưu tiên cao nhất</option>
              <option value="createdAtDesc">Sắp xếp: Mới tạo trước</option>
            </select>
          </div>
        </div>

        {/* Danh sách Task */}
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onToggleSubtaskComplete={handleToggleSubtaskComplete}
          onEdit={handleEditClick}
          onDelete={handleDeleteTask}
          onOpenModal={() => { setTaskToEdit(null); setIsModalOpen(true); }}
          isFiltered={isFiltered}
          onResetFilters={handleResetFilters}
        />
      </main>

      {/* Modal chỉnh sửa & thêm công việc */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setTaskToEdit(null); }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Hiệu ứng pháo hoa khi hoàn thành công việc */}
      <Confetti trigger={confettiTrigger} />
    </div>
  );
}
