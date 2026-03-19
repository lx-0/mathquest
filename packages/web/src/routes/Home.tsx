export function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <h1 className="mb-2 text-4xl font-bold text-primary">MathQuest</h1>
        <p className="mb-8 text-lg text-gray-600">
          Gamified math learning for 6th graders
        </p>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <p className="text-sm text-gray-500">
            🚧 Phase 1 scaffold — core game loop coming in Phase 2
          </p>
        </div>
      </div>
    </div>
  );
}
