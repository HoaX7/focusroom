import { createFileRoute, useRouter } from "@tanstack/solid-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <button type="button" class="rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
      Add 1 to 0?
    </button>
  );
}
