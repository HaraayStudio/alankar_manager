import React from "react";
import HeaderLinks from "../Components/HeaderLinks.jsx";
import styles from "./ContentStructure.module.scss";

export default function DashbaordStructure({ links, children }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <HeaderLinks links={links} />
      </div>

     <div className={styles.mainDashbaord}>
            {children}
          </div>
    </div>
  );
}
