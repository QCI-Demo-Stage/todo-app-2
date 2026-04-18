import { TaskCreationForm } from "./components/TaskCreationForm";
import { TaskList } from "./components/TaskList";

export function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main
        id="main-content"
        style={{ minHeight: "100vh", background: "var(--app-bg, #f6f8fa)" }}
      >
        <h1
          style={{
            margin: 0,
            padding: "clamp(0.75rem, 2vw, 1.25rem)",
            textAlign: "center",
            fontSize: "clamp(1.5rem, 4vw, 2rem)",
            fontWeight: 700,
            color: "var(--app-text, #24292f)",
          }}
        >
          Tasks
        </h1>
        <TaskCreationForm />
        <TaskList />
      </main>
    </>
  );
}
