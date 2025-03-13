# Dynamic Text Editor

A powerful, customizable rich text editor for React applications with dynamic template suggestions, variable highlighting, and Markdown support.

![Dynamic Text Editor Demo](https://dynamic-text-editor.vercel.app/screenshot.png)

## ✨ Features

- 🚀 **Rich Text Editing** - Based on Quill.js with support for formatting
- 🔍 **Dynamic Suggestions** - Customizable template variables with autocompletion
- 💡 **Variable Highlighting** - Automatic highlighting of template variables
- ⌨️ **Keyboard Navigation** - Full keyboard support for power users
- 🎨 **Theming Support** - Choose between 'Snow' and 'Bubble' themes
- 🎭 **Custom Rendering** - Completely customize suggestion items appearance
- 🧩 **Markdown Support** - Automatic Markdown formatting
- 📱 **Responsive Design** - Works on all screen sizes

## 📦 Installation

```bash
npm install dynamic-text-editor
# or
yarn add dynamic-text-editor
```

### Peer Dependencies

This package has the following peer dependencies:

```
react: ^16.8.0 || ^17.0.0 || ^18.0.0
react-dom: ^16.8.0 || ^17.0.0 || ^18.0.0
quill: ^1.3.7
```

## 🚀 Basic Usage

```jsx
import { DynamicTextEditor } from 'dynamic-text-editor';
import 'dynamic-text-editor/dist/styles.css'; // Import default styles

const MyEditor = () => {
  const [content, setContent] = useState('Hello {{user.name}}!');
  
  const suggestions = [
    {
      id: 'user.name',
      label: 'User Name',
      value: 'user.name',
      description: 'The name of the current user',
      category: 'User'
    },
    // More suggestions...
  ];
  
  return (
    <DynamicTextEditor
      value={content}
      onChange={setContent}
      suggestions={suggestions}
      placeholder="Start typing..."
    />
  );
};
```

## 🎛️ Available Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | The content of the editor |
| `onChange` | `function` | required | Callback when content changes |
| `suggestions` | `array` | `[]` | Array of suggestion items |
| `placeholder` | `string` | `''` | Placeholder text when editor is empty |
| `theme` | `'snow' \| 'bubble'` | `'snow'` | Editor theme |
| `toolbar` | `array` | `[]` | Toolbar configuration |
| `fontSize` | `string` | `'1rem'` | Font size for editor content |
| `lineHeight` | `string` | `'1.5'` | Line height for editor content |
| `width` | `string` | `'100%'` | Width of the editor |
| `height` | `string` | `'auto'` | Height of the editor |
| `renderItem` | `function` | `undefined` | Custom renderer for suggestion items |
| `classNames` | `object` | `{}` | Custom class names for components |
| `trigger` | `string` | `'{{'` | The trigger string for suggestions |
| `closingChar` | `string` | `'}}'` | The closing string for templates |
| `maxHeight` | `number` | `300` | Maximum height of suggestions dropdown |
| `minWidth` | `number` | `200` | Minimum width of suggestions dropdown |
| `maxWidth` | `number` | `400` | Maximum width of suggestions dropdown |

### Suggestion Item Structure

Each suggestion item should have the following structure:

```ts
interface BaseEditorItem {
  id: string;           // Unique identifier
  label: string;        // Display label
  value: string;        // Value to insert
  description?: string; // Optional description
  category?: string;    // Optional category
  link?: string;        // Optional documentation link
}
```

## 🎨 Theming and Customization

### Themes

The editor supports two built-in themes:

```jsx
// Snow theme (default)
<DynamicTextEditor theme="snow" />

// Bubble theme
<DynamicTextEditor theme="bubble" />
```

### Custom Class Names

You can customize the appearance by providing custom class names:

```jsx
<DynamicTextEditor
  classNames={{
    root: "my-editor",
    editor: "my-editor__input",
    variable: "my-editor__variable",
    suggestions: "my-editor__suggestions",
    suggestion: "my-editor__suggestion",
    suggestionSelected: "my-editor__suggestion--selected",
    category: "my-editor__category",
    description: "my-editor__description",
  }}
/>
```

### Custom CSS

You can target the editor with CSS selectors:

```css
/* Target the editor container */
.dynamic-text-editor {
  border: 2px solid #3498db;
}

/* Style the variable highlights */
.dynamic-text-editor__variable {
  background-color: #e8f4fd;
  color: #2980b9;
  padding: 2px 4px;
  border-radius: 4px;
}

/* Style the suggestions dropdown */
.dynamic-text-editor__suggestions {
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

### Custom Suggestion Renderer

Completely customize the appearance of suggestion items:

```jsx
const renderCustomItem = (item, isSelected) => {
  return (
    <div
      style={{
        padding: "12px 16px",
        backgroundColor: isSelected ? "#f0f9ff" : "transparent",
        cursor: "pointer",
        borderLeft: isSelected ? "3px solid #0066cc" : "3px solid transparent",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      <div style={{ fontSize: "20px" }}>
        {getIconForCategory(item.category)}
      </div>
      <div>
        <div style={{ fontWeight: "600" }}>{item.label}</div>
        {item.description && (
          <div style={{ fontSize: "0.9em", color: "#666" }}>
            {item.description}
          </div>
        )}
        {item.category && (
          <div style={{ fontSize: "0.8em", color: "#888" }}>
            {item.category}
          </div>
        )}
      </div>
    </div>
  );
};

<DynamicTextEditor
  renderItem={renderCustomItem}
  // ...
/>
```

## 🧰 Toolbar Configuration

Configure the toolbar with an array of formatting options:

```jsx
<DynamicTextEditor
  toolbar={[
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean']
  ]}
/>
```

## 🛠️ Using Refs and Editor API

You can access the editor's API using a ref:

```jsx
import { useRef } from 'react';
import { DynamicTextEditor, DynamicTextEditorRef } from 'dynamic-text-editor';

const MyEditor = () => {
  const editorRef = useRef<DynamicTextEditorRef>(null);
  
  const handleClearClick = () => {
    // Access editor methods through ref
    editorRef.current?.clearContent();
  };
  
  return (
    <>
      <DynamicTextEditor
        ref={editorRef}
        // ...other props
      />
      <button onClick={handleClearClick}>Clear Editor</button>
    </>
  );
};
```

Available methods on the ref:

- `clearContent()` - Clear the editor content
- `focus()` - Focus the editor
- `blur()` - Remove focus from the editor

## 🧩 Advanced Examples

### Theme Toggle

Allow users to switch between themes:

```jsx
const [theme, setTheme] = useState<'snow' | 'bubble'>('snow');

<div>
  <select
    value={theme}
    onChange={(e) => setTheme(e.target.value as 'snow' | 'bubble')}
  >
    <option value="snow">Snow Theme</option>
    <option value="bubble">Bubble Theme</option>
  </select>
  
  <DynamicTextEditor
    theme={theme}
    // ...other props
  />
</div>
```

### Toggle Toolbar Visibility

```jsx
const [showToolbar, setShowToolbar] = useState(true);
const toolbarOptions = [['bold', 'italic', 'underline']];

<div>
  <label>
    <input
      type="checkbox"
      checked={showToolbar}
      onChange={() => setShowToolbar(!showToolbar)}
    />
    Show Toolbar
  </label>
  
  <DynamicTextEditor
    toolbar={showToolbar ? toolbarOptions : []}
    // ...other props
  />
</div>
```

### Custom Trigger and Closing Characters

```jsx
<DynamicTextEditor
  trigger="${"
  closingChar="}"
  // ...other props
/>
```


