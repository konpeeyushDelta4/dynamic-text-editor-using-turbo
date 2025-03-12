import { useState } from "react";
import { Editor, Widget } from "./components";

const App = () => {
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-purple-100 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-pink-100 opacity-50 blur-3xl"></div>
      </div>

      <main className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Dynamic Prompt Editor</h1>
          <p className="text-lg text-gray-600">Create and edit templates with intelligent suggestions</p>
        </header>

        <div className="space-y-6">
          <Editor onFocusChange={setIsEditorFocused} />
          <Widget isEditorFocused={isEditorFocused} />
        </div>

        <footer className="mt-12 text-center text-gray-600">
          <p>
            Use{" "}
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-600 font-medium border border-orange-200 font-mono">
              {"{{"}
              {"}}"}
            </span>{" "}
            to trigger template suggestions
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
