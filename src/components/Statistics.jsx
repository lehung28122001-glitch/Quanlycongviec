import React from 'react';
import { ListTodo, Loader, CheckCircle2, BarChart3 } from 'lucide-react';

// Lấy trạng thái của 1 task.
// Hỗ trợ cả 2 cách lưu dữ liệu:
// - task.status: 'todo' | 'in-progress' | 'done' (do Thành viên 3 thêm)
// - task.completed: true/false (dữ liệu cũ, chưa có status)
const getTaskStatus = (task) => {
  if (task.status) return task.status;
  return task.completed ? 'done' : 'todo';
};

const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    icon: ListTodo,
  },
  'in-progress': {
    label: 'In Progress',
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.1)',
    icon: Loader,
  },
  done: {
    label: 'Done',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    icon: CheckCircle2,
  },
};

export default function Statistics({ tasks }) {
  const total = tasks.length;

  // Đếm số lượng công việc theo từng trạng thái
  const counts = tasks.reduce(
    (acc, task) => {
      const status = getTaskStatus(task);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { todo: 0, 'in-progress': 0, done: 0 }
  );

  const getPercent = (count) => (total === 0 ? 0 : Math.round((count / total) * 100));

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1.1rem' }}>
        <BarChart3 size={20} style={{ color: 'var(--accent-primary)' }} />
        Thống kê công việc
      </h2>

      {/* Bảng tổng hợp các trạng thái */}
      <div className="stats-container" style={{ marginBottom: '1rem' }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = counts[key] || 0;
          return (
            <div
              key={key}
              className="stat-card glass-panel"
              style={{ borderLeft: `4px solid ${cfg.color}` }}
            >
              <div className="stat-icon-wrapper" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                <Icon size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{cfg.label}</span>
                <span className="stat-value">{count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Thanh tiến độ tổng quan */}
      <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        Tổng số công việc: <strong>{total}</strong>
      </div>
      <div style={{ display: 'flex', height: '10px', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'var(--bg-secondary, #1e1e2f)' }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const percent = getPercent(counts[key] || 0);
          if (percent === 0) return null;
          return (
            <div
              key={key}
              style={{ width: `${percent}%`, backgroundColor: cfg.color }}
              title={`${cfg.label}: ${counts[key]} (${percent}%)`}
            />
          );
        })}
      </div>

      {/* Bảng chi tiết theo trạng thái */}
      <table style={{ width: '100%', marginTop: '1rem', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color, #333)' }}>
            <th style={{ padding: '0.5rem 0' }}>Trạng thái</th>
            <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Số lượng</th>
            <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Tỷ lệ</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <tr key={key} style={{ borderBottom: '1px solid var(--border-color, #2a2a3a)' }}>
              <td style={{ padding: '0.5rem 0', color: cfg.color, fontWeight: 600 }}>{cfg.label}</td>
              <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{counts[key] || 0}</td>
              <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{getPercent(counts[key] || 0)}%</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 700 }}>
            <td style={{ padding: '0.5rem 0' }}>Tổng</td>
            <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>{total}</td>
            <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
