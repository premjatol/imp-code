import React, { useState, useRef, useEffect } from "react";
import { HiOutlineBell } from "react-icons/hi";
import { FaRegFileAlt, FaMapMarkerAlt } from "react-icons/fa";

const notificationsData = [
  {
    category: "Yesterday",
    items: [
      {
        title: "New or deleted markups",
        description: "638496382220818841 Jfkgjvjy",
        date: "2/3/26",
        icon: <FaRegFileAlt className="w-5 h-5 text-blue-600" />,
        unread: true,
      },
    ],
  },
  {
    category: "Older",
    items: [
      {
        title: "New or deleted markups",
        description: "638496382220818841 Jfkgjvjy",
        date: "2/2/26",
        icon: <FaRegFileAlt className="w-5 h-5 text-blue-600" />,
        unread: true,
      },
      {
        title: "Task due today",
        description: "Tezt Task #5 | ABC",
        date: "1/31/26",
        icon: <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />,
        unread: true,
      },
      {
        title: "New or deleted markups",
        description: "638496382220818841 Jfkgjvjy",
        date: "1/31/26",
        icon: <FaRegFileAlt className="w-5 h-5 text-blue-600" />,
        unread: true,
      },
      {
        title: "New or deleted markups",
        description: "638496382220818841, invoice (1) Jfkgjvjy",
        date: "1/30/26",
        icon: <FaRegFileAlt className="w-5 h-5 text-blue-600" />,
        unread: true,
      },
      // You can add more notifications here
    ],
  },
];

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  // Close popup if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalUnread = notificationsData
    .flatMap((group) => group.items)
    .filter((item) => item.unread).length;

  return (
    <div className="relative inline-block text-left m-0" ref={popupRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <HiOutlineBell className="w-6 h-6" />
        {totalUnread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
            {totalUnread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-120 max-h-100 bg-white border border-slate-300 rounded-lg shadow-lg overflow-y-auto z-20">
          <div className="p-4 border-b border-slate-200 font-semibold text-slate-800">
            Notifications ({totalUnread})
          </div>

          {/* Filters placeholder (like in image you provided) */}
          <div className="flex gap-2 px-4 py-2 border-b border-slate-200">
            <button className="rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100 transition">
              Unread only
            </button>
            <button className="rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100 transition flex items-center gap-1">
              Project <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="rounded-full border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100 transition flex items-center gap-1">
              Type <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Notification groups */}
          <div className="px-4 py-2 text-xs text-slate-500 font-semibold select-none">
            {notificationsData.map(({ category, items }) => (
              <div key={category} className="mb-3 last:mb-0">
                <div className="mb-2">{category}</div>
                <ul>
                  {items.map(({ title, description, date, icon, unread }, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0"
                    >
                      <div className="mt-1">{icon}</div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-900">
                          {title}
                        </div>
                        <div className="text-xxs text-slate-600 truncate max-w-55">
                          {description}
                        </div>
                      </div>
                      <div className="text-xxs text-slate-500 whitespace-nowrap mt-1">
                        {date}
                      </div>
                      {unread && (
                        <div className="ml-2 mt-2 shrink-0 w-2 h-2 rounded-full bg-blue-600"></div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
