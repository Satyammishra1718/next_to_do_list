import styles from "./page.module.css";
import React from "react";
import TableSomething from "./tableSomething/page";

export default function Home() {
  return (
    <main className={styles.main}>
      <TableSomething />
    </main>
  );
}
