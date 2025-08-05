import React from 'react';
import HeaderLinks from "../Components/HeaderLinks.jsx";
import styles from "./ContentStructure.module.scss";

export default function ContentStructure({ links, children }) {
  return (
    <div className={styles.wrapper}>
    <div className={styles.header}>
          <HeaderLinks links={links} />
    </div>
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}
