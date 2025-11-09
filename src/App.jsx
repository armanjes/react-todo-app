import { useEffect, useReducer, useRef, useState } from "react";
import { IconCircleCheck, IconEdit, IconTrash } from "@tabler/icons-react";

const capitalize = (title) => title.charAt(0).toUpperCase() + title.slice(1);

const getSavedTodo = () => {
  const savedTodo = localStorage.getItem("todo");
  return !savedTodo || savedTodo !== "undefined" ? JSON.parse(savedTodo) : [];
};

function taskReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "add":
      return [
        ...state,
        { id: Date.now(), isCompleted: false, title: payload.title },
      ];

    case "edit":
      return state.map((t) =>
        t.id === payload.id ? { ...t, title: payload.title } : t
      );

    case "delete":
      return state.filter((t) => t.id !== payload.id);

    case "complete":
      return state.map((t) =>
        t.id === payload.id ? { ...t, isCompleted: !t.isCompleted } : t
      );

    default:
      return state;
  }
}

const App = () => {
  const inputRef = useRef("")
  const [editingId, setEditingId] = useState(null);
  const [task, dispatch] = useReducer(taskReducer, [], getSavedTodo);

  useEffect(() => {
    localStorage.setItem("todo", JSON.stringify(task));
  }, [task]);

  const addTask = (e) => {
    e.preventDefault();
    const value = inputRef.current.value.trim();
    if (!value) return;

    if (editingId) {
      dispatch({ type: "edit", payload: { id: editingId, title: value } });
      setEditingId(null);
    } else {
      dispatch({ type: "add", payload: { title: value } });
    }
    inputRef.current.value = ""
  };

  return (
    <div className="w-[95%] md:w-[60%] my-12 mx-auto">
      <div className="space-y-4">
        <form className="flex items-center gap-2 md:gap-4" onSubmit={addTask}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a task..."
            className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-1 focus:outline-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
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
            task.map((t) => (
              <li
                key={t.id}
                className={`border rounded-lg p-4 shadow-sm ${
                  t.isCompleted ? "bg-green-200" : "bg-white"
                }`}
              >
                <h1
                  className={`text-3xl font-semibold ${
                    t.isCompleted ? "line-through" : ""
                  }`}
                >
                  {capitalize(t.title)}
                </h1>
                {/* buttons */}
                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    onClick={() =>
                      dispatch({ type: "delete", payload: { id: t.id } })
                    }
                    className="text-red-500"
                  >
                    <IconTrash />
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(t.id);
                      inputRef.current.value = t.title
                      inputRef.current.focus()
                    }}
                    className="text-amber-500"
                  >
                    <IconEdit />
                  </button>
                  <button
                    onClick={() =>
                      dispatch({ type: "complete", payload: { id: t.id } })
                    }
                    className="text-green-500"
                  >
                    <IconCircleCheck />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};
export default App;
