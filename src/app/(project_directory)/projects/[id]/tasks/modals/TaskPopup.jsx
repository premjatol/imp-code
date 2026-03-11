import React, { useState } from 'react';
import { FiX, FiTrash2, FiSave, FiCalendar, FiClock } from 'react-icons/fi';
import moment from 'moment';
import './TaskPopup.css';

const TaskPopup = ({ event, onClose, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    title: event.title,
    start: event.start,
    end: event.end,
    description: event.resource?.description || ''
  });

  const handleSave = () => {
    onUpdate({
      ...event,
      ...editedEvent
    });
    setIsEditing(false);
  };

  const handleDateChange = (field, value) => {
    setEditedEvent({
      ...editedEvent,
      [field]: new Date(value)
    });
  };
  

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2 className="popup-title">
            {isEditing ? 'Edit Task' : 'Task Details'}
          </h2>
          <button className="close-button" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <div className="popup-body">
          {isEditing ? (
            <>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editedEvent.title}
                  onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                  placeholder="Task title"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <FiCalendar size={14} /> Start Date
                  </label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={moment(editedEvent.start).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FiClock size={14} /> End Date
                  </label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={moment(editedEvent.end).format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={editedEvent.description}
                  onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
                  placeholder="Add task description..."
                  rows={4}
                />
              </div>
            </>
          ) : (
            <>
              <div className="detail-group">
                <h3 className="detail-title">{event.title}</h3>
                <div 
                  className="detail-badge" 
                  style={{ backgroundColor: event.resource?.color || '#FF9800' }}
                >
                  {event.resource?.type || 'Task'}
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <FiCalendar size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Start:</span>
                    <span className="detail-value">
                      {moment(event.start).format('MMM DD, YYYY HH:mm')}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <FiClock size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">End:</span>
                    <span className="detail-value">
                      {moment(event.end).format('MMM DD, YYYY HH:mm')}
                    </span>
                  </div>
                </div>
              </div>

              {event.resource?.description && (
                <div className="detail-group">
                  <span className="detail-label">Description:</span>
                  <p className="detail-description">{event.resource.description}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="popup-footer">
          <button 
            className="button button-danger"
            onClick={() => onDelete(event?.id)}
          >
            <FiTrash2 size={16} />
            Delete
          </button>

          <div className="button-group">
            {isEditing ? (
              <>
                <button 
                  className="button button-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button 
                  className="button button-primary"
                  onClick={handleSave}
                >
                  <FiSave size={16} />
                  Save Changes
                </button>
              </>
            ) : (
              <button 
                className="button button-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Task
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPopup;