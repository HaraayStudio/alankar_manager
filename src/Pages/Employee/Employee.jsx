import React from "react";
import styles from "./EmployeeDashboard.module.scss";
import ContentStructure from "../../Layout/ContentStructure";
export default function Employee() {
  const links = [
    { to: "/employee/new", label: "Add New Employee" },
    { to: "/employee/list", label: "All Employee" },
  ];
  return (
    <ContentStructure links={links}>
      <div className={styles.sec1}>
        <div className={styles.leftDiv}></div>
        <div className={styles.rightDiv}></div>
      </div>
    </ContentStructure>
  );
}
