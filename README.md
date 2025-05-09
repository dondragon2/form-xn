# form-xn

Composable multi-action form handling for **[Remix](https://remix.run/)** — with first-class support for validation libraries like **Zod**, **Yup**, or anything that supports `safeParse()`.

---

## ✨ Features

- 🔁 Supports **multiple named actions** per route via `_action`
- ✅ Works with any validation library (Zod, Yup, etc.)
- 📦 Compatible with Remix server actions and client-side React validation
- 🧼 Zero styling assumptions — use your own UI

---

## 📦 Installation

```bash
bun add form-xn
# or
npm install form-xn
```

---

## 🧩 Usage Overview

### 1. Define Multi-Action in your Remix route (with Zod)

```ts
// routes/action.ts
import { createActions } from 'form-xn';
import { z } from 'zod';

const schema = z.object({
  id: z.string(),
  title: z.string().min(3),
});

export const action = createActions({
  updateTodo: {
    validator: schema, // zod has built-in safeParse
    handler: async ({ data }) => {
      return new Response(`Updated: ${data.title}`);
    },
  },
  deleteTodo: async () => {
    return new Response('Deleted!');
  },
});
```

---

### 2. Alternative: Use Yup schema

```ts
import { createActions } from 'form-xn';
import { yupValidator } from 'form-xn/utils/yupValidator';
import * as yup from 'yup';

const updateSchema = yup.object({
  id: yup.string().required(),
  title: yup.string().min(3).required(),
});

export const action = createActions({
  updateTodo: {
    validator: yupValidator(updateSchema),
    handler: async ({ data }) => {
      return new Response(`Updated: ${data.title}`);
    },
  },
});
```

---

## 🧪 `<ActionForm />` Component

The `<ActionForm />` component is a flexible wrapper that supports:

- ✅ `children`: for static layout
- ✅ `render`: for dynamic UI with inline access to `errors`
- ✅ `useClientFormErrors()`: to access errors in deeply nested components

### ✅ Basic Example with `children`

```tsx
<ActionForm
  action="updateTodo?id=123"
>
  <input name="title" />
  <button type="submit">Submit</button>
</ActionForm>
```

### ✅ Client-side validation
To access validation errors when using client-side validation, use:

```tsx
const todoSchema = z.object({
    title: z.string().min(1, "Title is required"),
});

export const Page = () => {
    return (
        <ActionForm
            action="updateTodo?id=123"
            validator={schema}
        >
            <TodoFormFields todo={{ title: 'test' }} />
            <button type="submit">Submit</button>
        </ActionForm>
    );
}
    


const TodoFormFields = ({todo}: { todo?: Todo }) => {
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
```

---

### ✅ Client-side validation Dynamic UI with `render`

When using the `render` prop, `ActionForm` gives you direct access to validation errors.

```tsx
<ActionForm
  action="updateTodo?id=123"
  validator={schema}
>
  {({ errors }) => (
    <>
      <input name="title" />
      {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
      <button type="submit">Save</button>
    </>
  )}
</ActionForm>
```

---

### 🔍 `ActionForm` Props

```ts
type ActionFormProps = {
    action: string;
    validator?: SafeValidator<any, any>;
    children?: ReactNode | ((args: { errors: FormErrorMap }) => ReactNode);
};
```

---

## 🛠 Utilities

### 🧾 `buildFormAction`

```ts
buildFormAction('updateTodo', { id: 123 });
// => "updateTodo?id=123"
```

---

### 🧾 `zodValidator(schema)`

Wrap a Zod schema into a `safeParse()`-compatible object.

---

---

### 🧾 `yupValidator(schema)`

Wrap a Yup schema into a `safeParse()`-compatible object.

---

## 📜 License

Apache 2.0

---

## 🧩 Want to Contribute?

Pull requests and Issues welcome!
