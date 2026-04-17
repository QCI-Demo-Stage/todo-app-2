import TaskCreationForm from './components/TaskCreationForm';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Todo</h1>
        <p className="app__intro">Create a task below. Title is required.</p>
      </header>
      <main className="app__main">
        <TaskCreationForm />
      </main>
    </div>
  );
}

export default App;
