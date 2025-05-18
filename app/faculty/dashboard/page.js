"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalText, setModalText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  useEffect(() => {
    fetchNotifications();
    fetchSchedules();
    fetchTasks();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/faculty/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await fetch("/api/faculty/schedules");
      if (res.ok) {
        const data = await res.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error("Failed to fetch schedules", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/faculty/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const openModal = (type, text = "", id = null) => {
    setModalType(type);
    setModalText(text);
    setEditingId(id);
    setShowModal(true);
  };

  const openConfirmModal = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setModalType("confirm");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalText("");
    setEditingId(null);
    setConfirmMessage("");
    setConfirmAction(null);
  };

  const handleSubmit = async () => {
    if (editingId) {
      openConfirmModal("Are you sure you want to save the changes?", async () => {
        try {
          const payload = { _id: editingId, text: modalText };
          const res = await fetch(`/api/faculty/${modalType}s`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const updated = await res.json();
            if (modalType === "notification") {
              setNotifications(notifications.map((n) => (n._id === editingId ? updated : n)));
            } else if (modalType === "schedule") {
              setSchedules(schedules.map((s) => (s._id === editingId ? updated : s)));
            } else if (modalType === "task") {
              setTasks(tasks.map((t) => (t._id === editingId ? updated : t)));
            }
          }
        } catch (error) {
          console.error("Failed to update", error);
        }
        closeModal();
      });
    } else {
      try {
        const payload = { text: modalText };
        const res = await fetch(`/api/faculty/${modalType}s`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          if (modalType === "notification") {
            setNotifications([created, ...notifications]);
          } else if (modalType === "schedule") {
            setSchedules([created, ...schedules]);
          } else if (modalType === "task") {
            setTasks([created, ...tasks]);
          }
        }
      } catch (error) {
        console.error("Failed to create", error);
      }
      closeModal();
    }
  };

  const deleteItem = (type, id) => {
    openConfirmModal("Are you sure you want to delete this item?", async () => {
      try {
        const res = await fetch(`/api/faculty/${type}s?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          if (type === "notification") {
            setNotifications(notifications.filter((n) => n._id !== id));
          } else if (type === "schedule") {
            setSchedules(schedules.filter((s) => s._id !== id));
          } else if (type === "task") {
            setTasks(tasks.filter((t) => t._id !== id));
          }
        }
      } catch (error) {
        console.error("Failed to delete", error);
      }
      closeModal();
    });
  };

  const handleSignOut = () => {
    console.log("Signing out...");
    setShowMenu(false);
    router.push("/");
  };

  return (
    <div className="bg-white m-0 min-h-screen">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            {modalType === "confirm" ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-black">Confirmation</h2>
                <p className="mb-4 text-black">{confirmMessage}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (confirmAction) {
                        confirmAction();
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4 text-black">
                  {editingId ? `Edit ${modalType}` : `Add ${modalType}`}
                </h2>
                <textarea
                  className="w-full p-2 border rounded mb-4 text-black"
                  value={modalText}
                  onChange={(e) => setModalText(e.target.value)}
                  placeholder={`Enter ${modalType} text`}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
                  >
                    {editingId ? "Save" : "Add"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-row items-start relative">
        <div className="flex flex-col items-center bg-blue-600 p-5 shadow-md w-80 h-70">
          <Image
            src="/sample.jpg"
            alt="Logo"
            width={100}
            height={200}
            className="rounded-full w-50 h-50 object-cover mb-4"
          />
          <h5 className="text-xl font-bold text-white mt-2 m-0">Jhon Doe</h5>
        </div>
        <header className="flex-1 flex items-center justify-center relative">
          <h1 className="bg-yellow-500 w-5/5 text-center text-4xl font-bold text-black p-10.5 py-20">
            Faculty Dashboard
          </h1>
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-black focus:outline-none cursor-pointer"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <ul className="py-2">
                  <li>
                    <a
                      href="/faculty/profile"
                      className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
                      onClick={() => setShowMenu(false)}
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="/faculty/settings"
                      className="block px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
                      onClick={() => setShowMenu(false)}
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </header>
      </div>
      <main className="content flex flex-row">
        <nav className="flex flex-col gap-11 bg-yellow-600 shadow-md max-w-max text-center">
          <a
            href="/faculty/dashboard"
            className="text-lg font-medium bg-yellow-400 px-29 py-10 hover:bg-yellow-500"
            target="_self" 
          >
            Dashboard
          </a>
          <a
            href="/faculty/section"
            className="text-lg px-29 py-10 hover:bg-yellow-500"
            target="_self"
          >
            Section
          </a>
          <a href="/faculty/task" className="text-lg px-29 py-10 hover:bg-yellow-500" target="_self">
            Task
          </a>
          <a
            href="/faculty/schedule"
            className="text-lg px-29 py-10 hover:bg-yellow-500"
            target="_self"
          >
            Schedule
          </a>
          <a
            href="/faculty/grades"
            className="text-lg px-29 py-10 hover:bg-yellow-500"
            target="_self"
          >
            Grades
          </a>
        </nav>
        <div className="flex flex-col flex-1 gap-6 p-2">
          <section className="p-1 max-w-screen bg-grey shadow border-dotted border-2 border-yellow-400 rounded-lg overflow-scroll overflow-x-auto">
            <div className="h-80 relative">
              <div className="flex justify-between items-center bg-gray-500 rounded-t-sm p-1 sticky top-0 z-10 border-1 border-black">
                <h1 className="text-black text-2xl font-bold">Notification</h1>
                <button
                  onClick={() => openModal("notification")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 cursor-pointer"
                  aria-label="Add notification"
                >
                  +
                </button>
              </div>
              {notifications.length === 0 ? (
                <div className="flex justify-center items-center text-center text-black p-2">
                  No notifications
                </div>
              ) : (
                <table className="min-w-full text-black bg-gray p-1 border-separate border border-gray-300 table-auto">
                  <tbody>
                    {notifications.map((notification) => (
                      <tr key={notification._id} className="bg-gray">
                        <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal max-w-xs">{notification.text}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center w-12">
                          <button
                            onClick={() => openModal("notification", notification.text, notification._id)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded-full hover:bg-yellow-600 inline-flex items-center justify-center cursor-pointer mr-2"
                            aria-label="Edit notification"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-10-4l9-9 4 4-9 9H7v-4z" />
                            </svg>
                          </button>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center w-12">
                          <button
                            onClick={() => deleteItem("notification", notification._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 inline-flex items-center justify-center cursor-pointer"
                            aria-label="Delete notification"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
          <section className="content flex flex-row h-80 gap-1 ">
            <div className="flex flex-col flex-1 bg-grey shadow border-dotted border-2 border-yellow-400 rounded-lg h-auto p-1 relative overflow-scroll overflow-x-auto">
              <div className="flex justify-between items-center bg-gray-500 rounded-t-sm p-1 sticky top-0 z-10 border-1 border-black">
                <h1 className="text-black text-2xl font-bold">Upcoming Schedules</h1>
                <button
                  onClick={() => openModal("schedule")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 cursor-pointer"
                  aria-label="Add schedule"
                >
                  +
                </button>
              </div>
              {schedules.length === 0 ? (
                <div className="flex justify-center items-center text-center text-black p-2">
                  No schedule
                </div>
              ) : (
                <table className="min-w-full text-black bg-grey p-1 border-separate border border-gray-300 table-auto">
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule._id} className="bg-grey">
                        <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal max-w-xs">{schedule.text}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center w-12">
                          <button
                            onClick={() => openModal("schedule", schedule.text, schedule._id)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded-full hover:bg-yellow-600 inline-flex items-center justify-center cursor-pointer mr-2"
                            aria-label="Edit schedule"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-10-4l9-9 4 4-9 9H7v-4z" />
                            </svg>
                          </button>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center w-12">
                          <button
                            onClick={() => deleteItem("schedule", schedule._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 inline-flex items-center justify-center cursor-pointer"
                            aria-label="Delete schedule"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="flex flex-col flex-1 bg-grey shadow border-dotted border-2 border-yellow-400 rounded-lg h-auto p-1 relative overflow-scroll overflow-x-auto">
              <div className="flex justify-between items-center bg-gray-500 rounded-t-sm p-1 sticky top-0 z-10 border-1 border-black">
                <h1 className="text-black text-2xl font-bold">Tasks</h1>
                <button
                  onClick={() => openModal("task")}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 cursor-pointer"
                  aria-label="Add task"
                >
                  +
                </button>
              </div>
              {tasks.length === 0 ? (
                <div className="flex justify-center items-center text-center text-black p-2">
                  No tasks
                </div>
              ) : (
                <table className="min-w-full text-black bg-grey p-1 border-separate border border-gray-300 table-auto">
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task._id} className="bg-grey">
                        <td className="border border-gray-300 px-4 py-2 break-words whitespace-normal max-w-xs">{task.text}</td>
                        <td className="border border-gray-300 px-2 py-2 text-center w-12">
                          <button
                            onClick={() => openModal("task", task.text, task._id)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded-full hover:bg-yellow-600 inline-flex items-center justify-center cursor-pointer mr-2"
                            aria-label="Edit task"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-10-4l9-9 4 4-9 9H7v-4z" />
                            </svg>
                          </button>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center w-12">
                          <button
                            onClick={() => deleteItem("task", task._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 inline-flex items-center justify-center cursor-pointer"
                            aria-label="Delete task"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}