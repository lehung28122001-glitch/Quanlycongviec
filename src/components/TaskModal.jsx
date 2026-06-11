import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');
  
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDesc(taskToEdit.desc || '');
      setDueDate(taskToEdit.dueDate || '');
      setPriority(taskToEdit.priority || 'medium');
      setCategory(taskToEdit.category || 'work');
      setSubtasks(taskToEdit.subtasks || []);
    } else {
      setTitle('');
      setDesc('');
      setDueDate('');
      setPriority('medium');
      setCategory('work');
      setSubtasks([]);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: Date.now() + Math.random(), text: subtaskInput.trim(), completed: false }
    ]);
    setSubtaskInput('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((sub) => sub.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      title: title.trim(),
      desc: desc.trim(),
      dueDate,
      priority,
      category,
      subtasks,
    });
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{taskToEdit ? 'Chỉnh sửa công việc' : 'Thêm công việc mới'}</h2>
          <button className="btn-icon" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="task-title">Tiêu đề *</label>
              <input
                id="task-title"
                type="text"
                placeholder="Nhập tiêu đề công việc..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="task-desc">Mô tả</label>
              <textarea
                id="task-desc"
                placeholder="Nhập chi tiết công việc..."
                rows="2"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="task-priority">Mức độ ưu tiên</label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="high">Cao</option>
                  <option value="medium">Trung bình</option>
                  <option value="low">Thấp</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="task-category">Danh mục</label>
                <select
                  id="task-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="work">Công việc</option>
                  <option value="personal">Cá nhân</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="task-date">Hạn hoàn thành</label>
              <input
                id="task-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Subtasks checklist builder */}
            <div className="form-group">
              <label>Các bước thực hiện (Subtasks)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Thêm bước thực hiện..."
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddSubtask}
                  style={{ padding: '0 0.75rem', height: '38px', borderRadius: 'var(--radius-sm)' }}
                >
                  <Plus size={18} />
                </button>
              </div>

              {subtasks.length > 0 && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  maxHeight: '120px', 
                  overflowY: 'auto', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.25rem'
                }}>
                  {subtasks.map((sub) => (
                    <div 
                      key={sub.id} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.375rem 0.5rem',
                        borderBottom: '1px solid var(--border-color)',
                        fontSize: '0.8125rem'
                      }}
                    >
                      <span style={{ 
                        textDecoration: sub.completed ? 'line-through' : 'none',
                        color: sub.completed ? 'var(--text-muted)' : 'var(--text-primary)'
                      }}>
                        {sub.text}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(sub.id)}
                        className="btn-icon btn-icon-danger"
                        style={{ padding: '0.125rem', border: 'none', background: 'transparent' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {taskToEdit ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
