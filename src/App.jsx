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

        {/* render task */}
        <ul className="flex flex-col gap-4">
          {task.length === 0 ? (
            <p className="mt-16 text-center text-slate-400 text-lg">
              No tasks.
            </p>
          ) : (
            task.map((item) => {
              return (
                <li
                  key={item.id}
                  className="bg-white border rounded-lg p-4 shadow-sm"
                >
                  <h1
                    className={`text-3xl font-semibold ${
                      item.completed ? "line-through" : ""
                    }`}
                  >
                    {capitalize(item.title)}
                  </h1>
                  <div className="flex gap-3 mt-4 justify-end">
                    <button
                      className="p-1 border rounded-full"
                      onClick={() => deleteTask(item.id)}
                    >
                      <IconTrash stroke={2} className="text-red-500" />
                    </button>
                    <button
                      className="p-1 border rounded-full"
                      onClick={() => editTask(item.id)}
                    >
                      <IconEdit stroke={2} className="text-orange-500" />
                    </button>
                    <button
                      className="p-1 border rounded-full"
                      onClick={() => completeTask(item.id)}
                    >
                      <IconCircleCheck stroke={2} className="text-green-600" />
                      {/* {item.completed ? "Undo" : "Complete"} */}
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
