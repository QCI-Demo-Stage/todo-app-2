import { TaskList } from "./components/TaskList";

export function App() {
  return (
    <main style={{ minHeight: "100vh", background: "#f6f8fa" }}>
      <h1 style={{ margin: 0, padding: "1rem", textAlign: "center" }}>
        Tasks
      </h1>
      <TaskList />
    </main>
  );
}
