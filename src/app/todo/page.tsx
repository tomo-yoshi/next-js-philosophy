import TodoContainer from "./_components/TodoContainer/container";
import { fetchTodos } from "./actions";

export default async function TodoPage() {
    const todos = await fetchTodos();
    console.log(todos);
  return (
    <main>
        <h1>Todo List</h1>
        <TodoContainer initialTodos={todos} />
    </main>
  );
};
