import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Sidebar.module.scss";
import logo from "../assets/logo_vertical.png";

// Sidebar item definition (your SVGs here)
const sidebarItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    key: "dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
        <path d="M16.1111 11.8088V5.14209H25V11.8088H16.1111ZM5 16.2532V5.14209H13.8889V16.2532H5ZM16.1111 25.1421V14.031H25V25.1421H16.1111ZM5 25.1421V18.4754H13.8889V25.1421H5ZM7.22222 14.031H11.6667V7.36431H7.22222V14.031ZM18.3333 22.9199H22.7778V16.2532H18.3333V22.9199ZM18.3333 9.58653H22.7778V7.36431H18.3333V9.58653ZM7.22222 22.9199H11.6667V20.6976H7.22222V22.9199Z" fill="currentColor"/>
      </svg>
    ),
  }, {
    name: "Orders",
    path: "/orders/ongoing",
    key: "Orders",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
        <path d="M26.67 8.97676V23.1455H4V8.97676H11.0844V7.55989C11.0844 7.36064 11.1213 7.17615 11.1951 7.00642C11.2689 6.83669 11.3685 6.6891 11.4939 6.56365C11.6194 6.43819 11.7707 6.33488 11.9478 6.25371C12.1249 6.17253 12.3094 6.13563 12.5013 6.14301H18.1687C18.368 6.14301 18.5525 6.17991 18.7222 6.25371C18.8919 6.3275 19.0395 6.42713 19.165 6.55258C19.2904 6.67803 19.3938 6.82931 19.4749 7.00642C19.5561 7.18353 19.593 7.36802 19.5856 7.55989V8.97676H26.67ZM12.5013 8.97676H18.1687V7.55989H12.5013V8.97676ZM5.41688 10.3936V12.4415L12.5013 15.9726V14.6443H18.1687V15.9726L25.2531 12.4415V10.3936H5.41688ZM13.9181 16.0611V17.478H16.7519V16.0611H13.9181ZM25.2531 21.7286V14.0133L18.1687 17.5666V18.8949H12.5013V17.5666L5.41688 14.0133V21.7286H25.2531Z" fill="currentColor"/>
      </svg>
    ),
    hasSubmenu: true,
    submenu: [
      // { name: "All Orders", path: "/projects", key: "projects" },
      { name: "Add New Orders", path: "/orders/new", key: "projects-new" },
      { name: "Ongoing Orders", path: "/orders/ongoing", key: "projects-ongoing" },
      // { name: "History & Details", path: "/orders/history", key: "projects-history" },
    ],
  },
 
  
  
  {
    name: "Employee",
    path: "/employee/list",
    key: "employee",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
        <path d="M19.6572 15.3867C21.0372 15.3867 22.1472 14.2667 22.1472 12.8867C22.1472 11.5067 21.0372 10.3867 19.6572 10.3867C18.9942 10.3867 18.3583 10.6501 17.8895 11.119C17.4206 11.5878 17.1572 12.2237 17.1572 12.8867C17.1572 13.5498 17.4206 14.1856 17.8895 14.6545C18.3583 15.1233 18.9942 15.3867 19.6572 15.3867ZM12.1572 14.3867C13.8172 14.3867 15.1472 13.0467 15.1472 11.3867C15.1472 9.72672 13.8172 8.38672 12.1572 8.38672C10.4972 8.38672 9.15723 9.72672 9.15723 11.3867C9.15723 13.0467 10.4972 14.3867 12.1572 14.3867ZM19.6572 17.3867C17.8272 17.3867 14.1572 18.3067 14.1572 20.1367V22.3867H25.1572V20.1367C25.1572 18.3067 21.4872 17.3867 19.6572 17.3867ZM12.1572 16.3867C9.82723 16.3867 5.15723 17.5567 5.15723 19.8867V22.3867H12.1572V20.1367C12.1572 19.2867 12.4872 17.7967 14.5272 16.6667C13.6572 16.4867 12.8172 16.3867 12.1572 16.3867Z" fill="currentColor"/>
      </svg>
    ),
    hasSubmenu: false,
    submenu: [
      { name: "Add New Employee", path: "/employee/new", key: "employee-new" },
      { name: "All Employees", path: "/employee/list", key: "employee-list" },
    ],
  },{
    name: "JobSheet",
    path: "/jobsheet",
    key: "jobsheet",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
        <path d="M19.6572 15.3867C21.0372 15.3867 22.1472 14.2667 22.1472 12.8867C22.1472 11.5067 21.0372 10.3867 19.6572 10.3867C18.9942 10.3867 18.3583 10.6501 17.8895 11.119C17.4206 11.5878 17.1572 12.2237 17.1572 12.8867C17.1572 13.5498 17.4206 14.1856 17.8895 14.6545C18.3583 15.1233 18.9942 15.3867 19.6572 15.3867ZM12.1572 14.3867C13.8172 14.3867 15.1472 13.0467 15.1472 11.3867C15.1472 9.72672 13.8172 8.38672 12.1572 8.38672C10.4972 8.38672 9.15723 9.72672 9.15723 11.3867C9.15723 13.0467 10.4972 14.3867 12.1572 14.3867ZM19.6572 17.3867C17.8272 17.3867 14.1572 18.3067 14.1572 20.1367V22.3867H25.1572V20.1367C25.1572 18.3067 21.4872 17.3867 19.6572 17.3867ZM12.1572 16.3867C9.82723 16.3867 5.15723 17.5567 5.15723 19.8867V22.3867H12.1572V20.1367C12.1572 19.2867 12.4872 17.7967 14.5272 16.6667C13.6572 16.4867 12.8172 16.3867 12.1572 16.3867Z" fill="currentColor"/>
      </svg>
    ),
    hasSubmenu: false,
    submenu: [
      { name: "Add New Employee", path: "/jobsheet", key: "employee-new" },
      { name: "All Employees", path: "/employee/list", key: "employee-list" },
    ],
  },{
    name: "Attendance",
    path: "/attendance",
    key: "attendance",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="31" viewBox="0 0 30 31" fill="none">
        <path d="M19.6572 15.3867C21.0372 15.3867 22.1472 14.2667 22.1472 12.8867C22.1472 11.5067 21.0372 10.3867 19.6572 10.3867C18.9942 10.3867 18.3583 10.6501 17.8895 11.119C17.4206 11.5878 17.1572 12.2237 17.1572 12.8867C17.1572 13.5498 17.4206 14.1856 17.8895 14.6545C18.3583 15.1233 18.9942 15.3867 19.6572 15.3867ZM12.1572 14.3867C13.8172 14.3867 15.1472 13.0467 15.1472 11.3867C15.1472 9.72672 13.8172 8.38672 12.1572 8.38672C10.4972 8.38672 9.15723 9.72672 9.15723 11.3867C9.15723 13.0467 10.4972 14.3867 12.1572 14.3867ZM19.6572 17.3867C17.8272 17.3867 14.1572 18.3067 14.1572 20.1367V22.3867H25.1572V20.1367C25.1572 18.3067 21.4872 17.3867 19.6572 17.3867ZM12.1572 16.3867C9.82723 16.3867 5.15723 17.5567 5.15723 19.8867V22.3867H12.1572V20.1367C12.1572 19.2867 12.4872 17.7967 14.5272 16.6667C13.6572 16.4867 12.8172 16.3867 12.1572 16.3867Z" fill="currentColor"/>
      </svg>
    ),
    hasSubmenu: false,
    submenu: [
      { name: "Add New Employee", path: "/attendance", key: "employee-new" },
      { name: "All Employees", path: "/employee/list", key: "employee-list" },
    ],
  },
];

const submenuVariants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.2, ease: "easeIn" } },
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleNavigation = (item) => {
    if (item.hasSubmenu) {
      setExpandedMenus((prev) => ({
        ...prev,
        [item.key]: !prev[item.key],
      }));
    }
    if (item.path) {
      navigate(item.path);
    }
  };

  const handleSubmenuNavigation = (path, parentKey) => {
    navigate(path);
    // Optionally close submenu on mobile
    if (window.innerWidth < 720) {
      setExpandedMenus((prev) => ({ ...prev, [parentKey]: false }));
    }
  };

  const isActive = (path) => location.pathname === path;
  const isParentActive = (item) =>
    item.hasSubmenu && item.submenu.some((subItem) => isActive(subItem.path) || location.pathname.startsWith(subItem.path));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img src={logo} alt="Alankar Logo" className={styles.logo} />
      </div>
      <nav className={styles.sidebarNav}>
        {sidebarItems.map((item, idx) => (
          <div key={item.key || idx}>
            <div
              className={`${styles.sidebarItem} ${
                isActive(item.path) || isParentActive(item) ? styles.active : ""
              }`}
              onClick={() => handleNavigation(item)}
            >
              <span className={`${styles.sidebarIcon} ${isActive(item.path) || isParentActive(item) ? styles.iconActive : ""}`}>
                {item.icon}
              </span>
              <span className={styles.sidebarText}>{item.name}</span>
              {/* {item.hasSubmenu && (
                <span
                  className={[
                    styles.submenuArrow,
                    expandedMenus[item.key] ? styles.expanded : "",
                    (isParentActive(item) || isActive(item.path)) ? styles.active : ""
                  ].join(" ")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 30 31" fill="none">
                    <path d="M11.5 22.7031L18.5 15.7031L11.5 8.70312"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )} */}
            </div>
            <AnimatePresence initial={false}>
              {item.hasSubmenu && expandedMenus[item.key] && (
                <motion.div
                  className={styles.sidebarSubmenu}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={submenuVariants}
                >
                  {item.submenu.map((subItem, sIdx) => (
                    <div
                      key={subItem.key}
                      className={`${styles.sidebarItem} ${styles.submenuItem} ${
                        isActive(subItem.path) ? styles.active : ""
                      }`}
                      onClick={() => handleSubmenuNavigation(subItem.path, item.key)}
                    >
                      <span className={styles.submenuLineWrap}>
                        <span className={styles.submenuLine} />
                        <span
                          className={`${styles.submenuDot} ${
                            isActive(subItem.path) ? styles.active : ""
                          }`}
                        />
                      </span>
                      <span className={styles.sidebarText}>{subItem.name}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
