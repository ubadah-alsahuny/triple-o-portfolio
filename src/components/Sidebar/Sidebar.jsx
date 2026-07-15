import React, { useState } from "react";
import styles from "./Sidebar.module.css";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaAlignJustify,
  FaSignOutAlt,
  FaPalette,
  FaUser,
  FaImages,
  FaFolder,
  FaHome,
  FaSave,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const sideBarItems = [
  { path: "/home/home", icons: <FaHome />, label: "Home" },
  {
    path: "/home/design-library",
    icons: <FaFolder />,
    label: "Design Library",
  },
  { path: "/home/templates", icons: <FaSave />, label: "Templates" },
  { path: "/home/design", icons: <FaPalette />, label: "Design" },
  { path: "/home/profile", icons: <FaUser />, label: "Profile" },
  { path: "/home/gallery", icons: <FaImages />, label: "Gallery" },
];

const Sidebar = ({ open, setOpen }) => {
  //const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const displayName = user.name || "اسم المستخدم";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <nav
      className={`shadow-md h-screen flex flex-column
                  ${styles.sidebar} duration-500`}
      style={{ width: open ? "300px" : "80px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div>
          <div
            onClick={() => setOpen(!open)}
            className={`${styles.avatar}
                           ${!open && "opacity-0 translate-x-24"}
                           duration-1000 overflow-hidden`}
            style={{
              width: open ? "55px" : "0px",
              height: open ? "55px" : "0px",
            }}
          >
            <p>{initials}</p>
          </div>
        </div>

        <h5
          className={`pt-3 text-white cursor-pointer text-center text-wrap
                        ${styles.username}
                        ${!open && "opacity-0 translate-x-24"}
                        duration-0 overflow-hidden`}
        >
          {displayName}
        </h5>

        <div>
          <FaAlignJustify
            className={`${styles.icon} cursor-pointer`}
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>

      {/* Navigation */}
      <ul className="p-4 flex-1 list-none">
        {sideBarItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`px-3 pl-2 text-white flex gap-2 items-center cursor-pointer
                              ${styles.navItem}`}
            >
              <div
                className={`flex items-center justify-center
                                 ${!open ? "w-full" : ""}`}
              >
                <div className={`${!open ? "translate-x-1" : ""}`}>
                  {item.icons}
                </div>
              </div>
              <p
                className={`${!open && "translate-x-96 opacity-0"}
                                           duration-0 overflow-hidden whitespace-nowrap px-4 pt-3`}
              >
                {item.label}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button
        className={`mx-4 inline-flex px-3 text-white gap-2 items-center
                              ${styles.navItem}`}
        onClick={handleLogout}
      >
        <div className={`items-center justify-center`}>
          <FaSignOutAlt className={`${!open ? "translate-x-1" : ""}`} />
        </div>

        <p
          className={`${!open && "translate-x-96 opacity-0"}
                                           duration-0 overflow-hidden whitespace-nowrap px-4 pt-3`}
        >
          Log out
        </p>
      </button>
    </nav>
  );
};

export default Sidebar;
