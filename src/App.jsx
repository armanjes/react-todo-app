import { useEffect, useReducer, useState } from "react";
import { IconCircleCheck, IconEdit, IconTrash } from "@tabler/icons-react";

const getInitialTask = () => {
  const savedTask = localStorage.getItem("todo-task");
  if (!savedTask || savedTask === "undefined") return [];

  try {
    return JSON.parse(savedTask);
  } catch (e) {
    console.error("Invalid JSON in localStorage:", e);
    return [];
  }
};

const capitalize = (title) => {
  return title.charAt(0).toUpperCase() + title.slice(1);
};

const taskReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "add":
      return [...state, { title: payload, completed: false, id: Date.now() }];
    case "delete":
      return state.filter((t) => t.id !== payload);
    case "complete":
      return state.map((t) =>
        t.id === payload ? { ...t, completed: !t.completed } : t
      );
    case "edit":
      return state.map((t) =>
        t.id === payload.id ? { ...t, title: payload.title } : t
      );
    default:
      return state;
  }
};

const App = () => {
  const [input, setInput] = useState("");
  const [editingID, setEditingID] = useState(null);
  const [task, dispatch] = useReducer(taskReducer, [], getInitialTask);

  useEffect(() => {
    localStorage.setItem("todo-task", JSON.stringify(task));
  }, [task]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (editingID) {
      dispatch({ type: "edit", payload: { id: editingID, title: input } });
      setEditingID(null);
    } else {
      dispatch({ type: "add", payload: input });
    }
    setInput("");
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

        <ul className="flex flex-col gap-4">
          {/* render task */}
          {!task.length ? (
            <p className="mt-16 text-center text-slate-400 text-lg">
              No tasks.
            </p>
          ) : (
            task.map((item) => {
              return (
                <li
                  key={item.id}
                  className={`border rounded-lg p-4 shadow-sm ${
                    item.completed ? "bg-green-100" : "bg-white"
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
                    <button
                      onClick={() =>
                        dispatch({ type: "delete", payload: item.id })
                      }
                    >
                      <IconTrash stroke={2} className="text-red-500" />
                    </button>
                    <button
                      onClick={() => {
                        setInput(item.title);
                        setEditingID(item.id);
                      }}
                    >
                      <IconEdit stroke={2} className="text-orange-500" />
                    </button>
                    <button
                      onClick={() =>
                        dispatch({ type: "complete", payload: item.id })
                      }
                    >
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
