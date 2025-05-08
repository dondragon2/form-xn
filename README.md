# @uluru/form-xn

Composable multi-action form handling for **Remix** and **React** — with first-class support for validation libraries like **Zod**, **Yup**, or anything that supports `safeParse()`.

---

## ✨ Features

- 🔁 Supports **multiple named actions** per route via `_action`
- ✅ Works with any validation library (Zod, Yup, etc.)
- 📦 Compatible with Remix server actions and client-side React validation
- 🧠 Fully type-safe handlers (via `InferActionInput`)
- 🧼 Zero styling assumptions — use your own UI

---

## 📦 Installation

```bash
bun add @uluru/form-xn
# or
npm install @uluru/form-xn
```

---

## 🧩 Usage Overview

### 1. Define Multi-Action in your Remix route (with Zod)

```ts
// routes/action.ts
import { createActions } from '@uluru/form-xn';
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
import { createActions } from '@uluru/form-xn';
import { yupValidator } from '@uluru/form-xn/utils/yupValidator';
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
- ✅ `useFormErrors()`: to access errors in deeply nested components

### ✅ Basic Example with `children`

```tsx
<ActionForm
  action="updateTodo?id=123"
  validator={schema}
>
  <input name="title" />
  <button type="submit">Submit</button>
</ActionForm>
```

To access validation errors when using `children`, use:

```tsx
const errors = useFormErrors();
{errors.title && <span>{errors.title}</span>}
```

---

### ✅ Dynamic UI with `render`

When using the `render` prop, `ActionForm` gives you direct access to validation errors.

```tsx
<ActionForm
  action="updateTodo?id=123"
  validator={schema}
  render={({ errors }) => (
    <>
      <input name="title" />
      {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
      <button type="submit">Save</button>
    </>
  )}
/>
```

> ✅ If `children` is provided, it takes precedence over `render`.

---

### 🔍 `ActionForm` Props

```ts
type ActionFormProps = {
  action: string;
  validator?: SafeValidator<any>;
  children?: React.ReactNode;
  render?: (args: { errors: Record<string, string> }) => React.ReactNode;
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

### 🧾 `yupValidator(schema)`

Wrap a Yup schema into a `safeParse()`-compatible object.

---

## 📜 License

Apache 2.0

---

## 🧩 Want to Contribute?

Pull requests and issues welcome!
