"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Schedule() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  
  // Calendar data - January 2025 (31 days, starts on Wednesday)
  const daysInMonth = 31;
  const startingDay = 3; // 0=Sunday, 1=Monday, ..., 6=Saturday
  const [events] = useState({
    4: "Time Event",
    19: "Time Event",
  });

  // Generate calendar cells
  const calendarDays = [];
  
  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
  }

  // Add actual days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvent = events[day];
    calendarDays.push(
      <div
        key={day}
        className="h-24 border border-gray-300 p-2 relative"
      >
        <div className="font-semibold text-lg text-gray-800">{day}</div>
        {hasEvent && (
          <div className="text-xs mt-1 p-1 bg-yellow-100 rounded text-gray-700">
            {events[day]}
          </div>
        )}
      </div>
    );
  }

  const handleSignOut = () => {
    console.log("Signing out...");
    setShowMenu(false);
    router.push("/");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-row items-start relative">
        {/* Profile Sidebar */}
        <div className="flex flex-col items-center bg-blue-600 p-5 shadow-md w-80 h-70" >
          <Image
            src="/sample.jpg"
            alt="Profile"
            width={100}
            height={200}
            className="rounded-full object-cover mb-4"
            priority
          />
            <h5 className="text-xl font-bold text-black mt-2 m-0">Jhon Doe</h5>
        </div>

        {/* Main Header */}
        <header className="flex-1 flex items-center justify-center relative">
          <h1 className="bg-yellow-500 w-5/5 text-center text-4xl font-bold text-black p-10.5 py-20">
            Schedule
          </h1>
          
          {/* Profile Dropdown */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-black focus:outline-none"
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
                      className="block px-4 py-2 text-black hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="/faculty/settings"
                      className="block px-4 py-2 text-black hover:bg-gray-100"
                      onClick={() => setShowMenu(false)}
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
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
        {/* Navigation Sidebar */}
        <nav className="flex flex-col gap-11 bg-yellow-600 shadow-md max-w-max text-center">
          <a
            href="/faculty/dashboard"
            className="text-lg px-29 py-10" 
            target="_self"
          >
            Dashboard
          </a>
          <a
            href="/faculty/section"
            className="text-lg px-29 py-10"
            target="_self"
          >
            Section
          </a>
          <a href="/faculty/task" className="text-lg px-29 py-10" target="_self">
            Task
          </a>
          <a
            href="/faculty/schedule"
            className="text-lg font-medium bg-yellow-400 px-29 py-10"
            target="_self"
          >
            Schedule
          </a>
          <a
            href="/faculty/grades"
            className="text-lg px-29 py-10"
            target="_self"
          >
            Grades
          </a>
        </nav>

        {/* Calendar Content */}
        <div className="flex-1 p-8">
          {/* Calendar Header */}
          <div className="flex justify-between bg-blue-500 text-white px-6 py-3 font-bold text-lg rounded-t">
            <span>January 2025</span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 bg-white border border-yellow-400 p-4 shadow rounded-b">
            {/* Day names */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-bold py-2 text-gray-700">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays}
          </div>
        </div>
      </main>
    </div>
  );
}
