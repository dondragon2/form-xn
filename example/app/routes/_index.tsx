import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import {
  ActionForm,
  buildFormAction,
  createActions,
  useClientFormErrors,
  zodValidator,
} from "form-xn";
import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";

type Todo = {
  id: string;
  title: string;
};

let todos: Todo[] = [
  {
    id: uuid(),
    title:
      "Make Remix Awesome. This is totally enhance how it works. These forms handlers are great",
  },
];

const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const loader = () => Response.json(todos);

export const action = createActions({
  addTodo: {
    validator: zodValidator(todoSchema),
    handler: async ({ data }) => {
      todos.push({ id: uuid(), title: data.title });
      return Response.json(todos);
    },
  },
  updateTodo: {
    validator: zodValidator(todoSchema),
    handler: async ({ data, query }) => {
      const index = todos.findIndex((t) => t.id === query.get("id"));
      if (index !== -1) {
        todos[index].title = data.title;
      }
      return Response.json(todos);
    },
  },
  deleteTodo: async ({ query }) => {
    const index = todos.findIndex((t) => t.id === query.get("id"));
    if (index !== -1) {
      todos.splice(index, 1);
    }
    return Response.json(todos);
  },
});


export default function IndexRoute() {
  const todos = useLoaderData<typeof loader>();
  const [toggled, setToggled] = React.useState<string | null>(null);

  useEffect(() => {
    setToggled(null);
  }, [todos]);

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="mb-4 font-semibold text-2xl">📝 My Todos</h1>

      <ActionForm action="addTodo" validator={zodValidator(todoSchema)}>
        <div className="flex mb-4 gap-3">
         <TodoFormFields />
          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-4 text-white min-w-24 h-12 items-center text-lg font-semibold"
          >
            Add
          </button>
        </div>
      </ActionForm>

      <ul>
        {todos.map((todo: Todo) => (
          <li
            key={todo.id}
            className="border p-4 mb-4 rounded-lg flex gap-3 min-h-32"
          >
            {toggled !== todo.id && (
              <>
                <div
                  className="flex flex-1 gap-3"
                  onClick={() => setToggled(todo.id)}
                >
                  <span>✎</span>
                  <p className="font-normal text-lg">{todo.title}</p>
                </div>
                <div className="flex gap-3">
                  <ActionForm action={`deleteTodo?id=${todo.id}`}>
                    <button
                      type="submit"
                      className="rounded-full justify-center items-center bg-red-500 text-white text-sm font-semibold size-8"
                    >
                      X
                    </button>
                  </ActionForm>
                </div>
              </>
            )}
            {toggled === todo.id && (
              <ActionForm
                action={buildFormAction("updateTodo", { id: todo.id })}
              >
                <div className="flex flex-col flex-1 gap-3">

                  <TodoFormFields todo={todo} />

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-500 p-4 text-white min-w-24 text-lg font-semibold"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setToggled(null)}
                      className="rounded-lg border border-gray-300 p-4 min-w-24 text-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </ActionForm>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

const TodoFormFields = ({todo}: { todo?: Todo }) => {
  // Using the inferred type from AddTodoInput for form errors
  const errors = useClientFormErrors();

  return (
    <div className="flex flex-col flex-1 gap-3">
      <textarea
        defaultValue={todo?.title ?? ''}
        className="border p-4 rounded-lg flex-1"
        name="title"
      ></textarea>
      {errors?.title && (
        <p className="text-red-500 text-sm">{errors.title}</p>
      )}
    </div>
  )
}
