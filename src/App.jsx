import { useEffect, useState } from "react";
import { IconCircleCheck, IconEdit, IconTrash } from "@tabler/icons-react";

const getInitialTask = () => {
  const savedTask = localStorage.getItem("todo-task");
  return savedTask ? JSON.parse(savedTask) : [];
};

const capitalize = (title) => {
  return title.charAt(0).toUpperCase() + title.slice(1);
};

const App = () => {
  const [input, setInput] = useState("");
  const [task, setTask] = useState(getInitialTask());
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todo-task", JSON.stringify(task));
  }, [task]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (editingId) {
      setTask((prev) => {
        return prev.map((item) =>
          item.id === editingId ? { ...item, title: input } : item
        );
      });
      setEditingId(null);
    } else {
      setTask([
        ...task,
        {
          id: Date.now(),
          completed: false,
          title: input,
        },
      ]);
    }
    setInput("");
  };

  const deleteTask = (id) => {
    setTask(task.filter((item) => item.id !== id));
  };

  const editTask = (id) => {
    const itemToEdit = task.find((item) => item.id === id);

    if (itemToEdit) {
      setInput(itemToEdit.title);
      setEditingId(id);
    }
  };

  const completeTask = (id) => {
    setTask(
      task.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const filteredTask = task.filter((item) => {
    if (filter === "pending") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const isActive = (type) =>
    filter === type ? "bg-blue-600 text-white" : "border";

  return (
    <div className="w-[95%] md:w-[60%] my-12 mx-auto">
      <div className="space-y-4">
        <form className="flex items-center gap-2 md:gap-4" onSubmit={addTask}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task..."
            className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white font-semibold rounded-lg transition duration-150 ease-in-out"
          >
            Add Task
          </button>
        </form>

        <ul className="flex flex-col gap-4">
          <div className="space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1 rounded ${isActive("all")}`}
            >
              All Task {task.length > 0 && task.length}
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-1 border rounded ${isActive("pending")}`}
            >
              Pending {task && task.length > 0 && task.filter((item) => !item.completed).length}
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-1 border rounded ${isActive("completed")}`}
            >
              Completed {task.length > 0 && task.filter((item) => item.completed).length}
            </button>
          </div>

          {/* render task */}
          {!filteredTask.length ? (
            <p className="mt-16 text-center text-slate-400 text-lg">
              No tasks.
            </p>
          ) : (
            filteredTask.map((item) => {
              return (
                <li
                  key={item.id}
                  className={`border rounded-lg p-4 shadow-sm ${
                    item.completed ? "bg-green-200" : "bg-white"
                  }`}
                >
                  <h1
                    className={`text-3xl font-semibold ${
                      item.completed ? "line-through" : ""
                    }`}
                  >
                    {capitalize(item.title)}
                  </h1>
                  <div className="flex gap-3 mt-4 justify-end">
                    <button onClick={() => deleteTask(item.id)}>
                      <IconTrash stroke={2} className="text-red-500" />
                    </button>
                    <button onClick={() => editTask(item.id)}>
                      <IconEdit stroke={2} className="text-orange-500" />
                    </button>
                    <button onClick={() => completeTask(item.id)}>
                      <IconCircleCheck stroke={2} className="text-green-600" />
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};
export default App;

// asynchronous nature of React's state updates
// function execution context
