"use client";

import React, { useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { FiChevronLeft, FiChevronRight, FiDownload } from "react-icons/fi";

import TaskList from "./TaskList";
import { generatePDF } from "@/lib/Pdfgenerator";
import Modal from "@/components/Modal";
import CreateTaskModal from "@/components/common/create-task-modal/CreateTaskModal";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

// --- STATIC DATA ---
const INITIAL_TASKS = [
  {
    id: "1",
    title: "Related Task 2 T...",
    type: "task",
    color: "#FF9800",
    status: "pending",
    description: "Complete documentation",
    assignee: "PIA",
    priority: "medium",
  },
  {
    id: "2",
    title: "Tape & finish gy...",
    type: "document",
    color: "#F44336",
    status: "pending",
    description: "Finish gypsum board",
    assignee: "PIA",
    priority: "high",
  },
  {
    id: "3",
    title: "AAA",
    type: "task",
    color: "#FF9800",
    status: "pending",
    description: "AAA task description",
    assignee: "PIA",
    priority: "low",
  },
];

const INITIAL_EVENTS = [
  {
    id: "e1",
    title: "Project Kickoff",
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 2)),
    allDay: false,
    resource: {
      id: "4",
      title: "Install conduit f...",
      type: "electrical",
      color: "#E91E63",
      status: "pending",
      description: "Install electrical conduit",
      assignee: "PIA",
      priority: "high",
    },
  },
];

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // states for event creation
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  // right click menu state
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    event: null,
  });

  // ---------------- OUTSIDE DRAG ----------------
  const dragFromOutsideItem = useCallback(() => {
    if (!draggedTask) return null;
    return {
      title: draggedTask.title,
      allDay: true,
      resource: draggedTask,
    };
  }, [draggedTask]);

  const handleDropFromOutside = useCallback(
    ({ start, end }) => {
      if (!draggedTask) return;

      const newEvent = {
        id: `event-${Date.now()}`,
        title: draggedTask.title,
        start,
        end: end || start,
        allDay: true,
        resource: draggedTask,
      };

      setEvents((prev) => [...prev, newEvent]);
      setTasks((prev) => prev.filter((t) => t.id !== draggedTask.id));
      setDraggedTask(null);
    },
    [draggedTask],
  );

  // ---------------- EVENT MOVE / RESIZE ----------------
  const handleEventDrop = useCallback(({ event, start, end }) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)),
    );
  }, []);

  const handleEventResize = useCallback(
    ({ event, start, end }) => {
      handleEventDrop({ event, start, end });
    },
    [handleEventDrop],
  );

  // ---------------- UI HANDLERS ----------------
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.resource?.color || "#6366f1",
      borderRadius: "6px",
      color: "#fff",
      border: "none",
      padding: "4px 8px",
      fontSize: "13px",
    },
  });

  // Manual set browser right click menu
  const handleEventRightClick = useCallback((event, e) => {
    e.preventDefault(); // 🚫 disable browser menu

    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      event,
    });
  }, []);

  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  // ---------------- Add New event in list ----------------
  const handleSelectSlot = useCallback((slotInfo) => {
    setSelectedSlot(slotInfo);
    setShowCreatePopup(true);
  }, []);

  const handleDownloadPDF = () => {
    generatePDF(events, currentDate, view);
  };

  const handleCreateEvent = () => {
    if (!newEventTitle.trim() || !selectedSlot) return;

    const newEvent = {
      id: `event-${Date.now()}`,
      title: newEventTitle,
      start: selectedSlot.start,
      end: selectedSlot.end,
      allDay: true,
    };

    setEvents((prev) => [...prev, newEvent]);

    // reset
    setNewEventTitle("");
    setSelectedSlot(null);
    setShowCreatePopup(false);
  };

  // ---------------- Remove task from event list ----------------
  const onDelete = useCallback((eventId) => {
    setEvents((prevEvents) => {
      const eventToDelete = prevEvents.find((e) => e.id === eventId);

      if (eventToDelete?.resource) {
        setTasks((prevTasks) => {
          const alreadyExists = prevTasks.some(
            (t) => t.id === eventToDelete.resource.id,
          );

          if (alreadyExists) return prevTasks;

          return [...prevTasks, eventToDelete.resource];
        });
      }

      return prevEvents.filter((e) => e.id !== eventId);
    });

    setShowPopup(false);
    setSelectedEvent(null);
  }, []);

  // ---------------- Update task in event list ----------------
  const onUpdate = useCallback((updatedEvent) => {
    console.log("updatedEvent:", updatedEvent);

    setEvents((prev) =>
      prev.map((e) =>
        e.id === updatedEvent.id
          ? {
              ...e,
              ...updatedEvent,
              resource: {
                ...e.resource,
                description: updatedEvent.description,
              },
            }
          : e,
      ),
    );

    setSelectedEvent(updatedEvent);
    setShowPopup(false);
  }, []);

  const EventComponent = ({ event }) => {
    return (
      <div
        onContextMenu={(e) => handleEventRightClick(event, e)}
        className="w-full h-full"
      >
        {event.title}
      </div>
    );
  };

  // ---------------- TOOLBAR ----------------
  const CustomToolbar = () => (
    <div className="calendar-toolbar">
      <div className="toolbar-left">
        <button
          className="nav-button"
          onClick={() =>
            setCurrentDate(moment(currentDate).subtract(1, view).toDate())
          }
        >
          <FiChevronLeft size={16} />
        </button>
        <button
          className="nav-button"
          onClick={() =>
            setCurrentDate(moment(currentDate).add(1, view).toDate())
          }
        >
          <FiChevronRight size={16} />
        </button>
        <h2 className="current-month">
          {moment(currentDate).format("MMMM YYYY")}
        </h2>
        <button className="text-xs" onClick={() => setCurrentDate(new Date())}>
          Today
        </button>
      </div>

      <div className="toolbar-right">
        <button
          className="action-button download-button"
          onClick={handleDownloadPDF}
        >
          <FiDownload size={14} />
        </button>
        <div className="view-buttons">
          {["day", "week", "month"].map((v) => (
            <button
              key={v}
              className={`view-button ${view === v ? "active" : ""}`}
              onClick={() => setView(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  console.log("tasks:", tasks, "events:", events);

  return (
    <div className="calendar-container w-full">
      <div className="calendar-layout flex-1">
        <CustomToolbar />
        <DnDCalendar
          localizer={localizer}
          events={events}
          date={currentDate}
          view={view}
          onView={setView}
          onNavigate={setCurrentDate}
          step={1440} // 24 hours in one step
          timeslots={1} // single slot
          showMultiDayTimes={false}
          selectable
          resizable
          style={{ height: "calc(100vh - 140px)" }}
          dragFromOutsideItem={dragFromOutsideItem}
          onDropFromOutside={handleDropFromOutside}
          onEventDrop={handleEventDrop}
          onSelectSlot={handleSelectSlot}
          onDoubleClickEvent={() => {}}
          onSelectEvent={handleSelectEvent}
          onContextMenu={handleEventRightClick}
          onEventResize={handleEventResize}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: () => null,
            event: EventComponent,
          }}
        />
      </div>
      <TaskList tasks={tasks} onDragStart={setDraggedTask} />

      {/* {showPopup && selectedEvent && (
        <TaskPopup
          event={selectedEvent}
          onClose={() => setShowPopup(false)}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      )} */}

      <Modal
        open={showPopup && selectedEvent}
        heading={"Update Task"}
        onClose={() => setShowPopup(false)}
        width="800px"
      >
        <CreateTaskModal />
      </Modal>

      {showCreatePopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={() => setShowCreatePopup(false)}
        >
          <div
            className="bg-white p-6 rounded-lg w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Create Event</h2>

            <input
              type="text"
              placeholder="Enter event title"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              autoFocus
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowCreatePopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleCreateEvent}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {contextMenu.visible && (
        <div className="fixed inset-0 z-50" onClick={closeContextMenu}>
          <div
            className="absolute bg-white shadow-lg rounded-md w-40 py-2 text-xs"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-300 cursor-pointer"
              onClick={() => {
                setSelectedEvent(contextMenu.event);
                setShowPopup(true);
                closeContextMenu();
              }}
            >
              Edit
            </button>

            <button
              className="block w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white text-red-600 cursor-pointer"
              onClick={() => {
                onDelete(contextMenu.event.id);
                closeContextMenu();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
