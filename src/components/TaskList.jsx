import React from 'react';
import { ClipboardList, Plus, SearchX } from 'lucide-react';
import TaskCard from './TaskCard';

export default function TaskList({ 
  tasks, 
  onToggleComplete, 
  onToggleSubtaskComplete, 
  onEdit, 
  onDelete, 
  onOpenModal,
  isFiltered,
  onResetFilters
}) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        {isFiltered ? (
          <>
            <SearchX className="empty-state-icon" />
            <h3>Không tìm thấy kết quả</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '300px' }}>
              Hãy thử tìm kiếm với từ khóa khác hoặc đặt lại bộ lọc hiện tại.
            </p>
            <button className="btn btn-secondary" onClick={onResetFilters} style={{ height: '36px' }}>
              Đặt lại bộ lọc
            </button>
          </>
        ) : (
          <>
            <ClipboardList className="empty-state-icon" />
            <h3>Danh sách trống</h3>
            <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: '300px' }}>
              Bắt đầu ngày mới bằng việc lập kế hoạch cho các mục tiêu của bạn.
            </p>
            <button className="btn btn-primary" onClick={onOpenModal} style={{ height: '36px' }}>
              <Plus size={16} /> Thêm công việc đầu tiên
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onToggleSubtaskComplete={onToggleSubtaskComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
