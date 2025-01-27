import { Todo } from "@/types";

interface TodoPresentationProps {
    todos: Todo[];
    handleCheckboxChange: (id: string) => void;
    handleDelete: (id: string) => void;
};

export default function TodoPresentation({ todos, handleCheckboxChange, handleDelete }: TodoPresentationProps) {

  return (
    <ul className="flex flex-col gap-2">
        {todos.map((todo: Todo) => (
            <li key={todo.id} className="flex items-center gap-2 my-1">
              <label htmlFor={todo.id} className="flex items-center gap-2">
                <input
                  id={todo.id}
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                      handleCheckboxChange(todo.id);
                  }}
                />
                <p>{todo.title}</p>
              </label>
              <button
                onClick={() => handleDelete(todo.id)}
                className="bg-gray-300 hover:bg-red-500 text-white text-xs p-1 rounded-md"
              >
                Delete
              </button>
            </li>
        ))}
    </ul>
  );
};
