import React from 'react';
import { Check, Edit2, Trash2, Calendar, AlertTriangle } from 'lucide-react';

const PRIORITY_LABELS = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const CATEGORY_LABELS = {
  work: 'Công việc',
  personal: 'Cá nhân',
};

export default function TaskCard({ 
  task, 
  onToggleComplete, 
  onToggleSubtaskComplete, 
  onEdit, 
  onDelete,
  onSound,
}) {
  // Đánh giá xem task có quá hạn không
  const checkOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  };

  const isOverdue = checkOverdue();

  // Định dạng ngày hiển thị (DD/MM/YYYY)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Tính toán tiến độ subtasks
  const subtasksCount = task.subtasks?.length || 0;
  const completedSubtasksCount = task.subtasks?.filter((sub) => sub.completed).length || 0;
  const subtasksProgress = subtasksCount > 0 ? (completedSubtasksCount / subtasksCount) * 100 : 0;

  // Xử lý khi click vào nút checkbox
  const handleCheckboxClick = (e) => {
    // Lấy tọa độ click chuột để tạo pháo hoa
    const clickCoordinates = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    // Play sound based on new state
    if (onSound) {
      const willComplete = !task.completed;
      willComplete ? onSound.playCompleteSound() : onSound.playUncheckedSound();
    }
    onToggleComplete(task.id, clickCoordinates);
  };

  const handleSubtaskCheckboxClick = (subtaskId, e) => {
    // Lấy tọa độ click chuột cho subtask
    const clickCoordinates = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    };
    // Play sound based on subtask new state
    if (onSound) {
      const sub = task.subtasks.find((s) => s.id === subtaskId);
      const willComplete = sub ? !sub.completed : true;
      willComplete ? onSound.playCompleteSound() : onSound.playUncheckedSound();
    }
    onToggleSubtaskComplete(task.id, subtaskId, clickCoordinates);
  };

  return (
    <div className={`task-card priority-${task.priority} ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-header">
        <div className="task-title-group">
          {/* Custom Checkbox */}
          <div 
            className={`checkbox-container ${task.completed ? 'checkbox-active' : ''}`}
            onClick={handleCheckboxClick}
          >
            <div className="checkbox-custom">
              <Check />
            </div>
          </div>
          <span className="task-title">{task.title}</span>
        </div>
      </div>

      {task.desc && <p className="task-desc">{task.desc}</p>}

      {/* Subtasks checklist */}
      {subtasksCount > 0 && (
        <div className="subtasks-section">
          <div className="subtasks-header">
            <span>Các bước thực hiện</span>
            <span>{completedSubtasksCount}/{subtasksCount}</span>
          </div>
          <div className="subtasks-progress">
            <div 
              className="subtasks-progress-bar"
              style={{ width: `${subtasksProgress}%` }}
            />
          </div>
          <div className="subtasks-list">
            {task.subtasks.map((sub) => (
              <div 
                key={sub.id} 
                className="subtask-item"
                onClick={(e) => handleSubtaskCheckboxClick(sub.id, e)}
              >
                <div className={`checkbox-container ${sub.completed ? 'checkbox-active' : ''}`} style={{ marginRight: '0.5rem' }}>
                  <div className="checkbox-custom">
                    <Check />
                  </div>
                </div>
                <span className={sub.completed ? 'subtask-completed' : ''}>
                  {sub.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer chứa tags và actions */}
      <div className="task-footer">
        <div className="task-meta-left">
          {/* Tag Priority */}
          <span className={`badge-priority badge-${task.priority}`}>
            Ưu tiên: {PRIORITY_LABELS[task.priority]}
          </span>
          {/* Tag Category */}
          <span className="badge-category">
            {CATEGORY_LABELS[task.category]}
          </span>
          {/* Due date */}
          {task.dueDate && (
            <span className={`task-date ${isOverdue ? 'task-overdue' : ''}`}>
              {isOverdue ? <AlertTriangle size={14} /> : <Calendar size={14} />}
              Hạn: {formatDate(task.dueDate)} {isOverdue && '(Quá hạn)'}
            </span>
          )}
        </div>

        {/* Buttons Action */}
        <div className="task-actions">
          <button 
            className="btn-icon" 
            onClick={() => onEdit(task)} 
            title="Sửa công việc"
            style={{ border: 'none', background: 'transparent' }}
          >
            <Edit2 size={15} />
          </button>
          <button 
            className="btn-icon btn-icon-danger" 
            onClick={() => onDelete(task.id)} 
            title="Xóa công việc"
            style={{ border: 'none', background: 'transparent' }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
