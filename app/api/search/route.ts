export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  if (!query || query.length < 1) {
    return Response.json({ results: [] })
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock search results based on query type
  const mockResults = [
    { id: "1", title: "React Hooks", category: "documentation", url: "#" },
    { id: "2", title: "React Query", category: "library", url: "#" },
    { id: "3", title: "React Router", category: "library", url: "#" },
    { id: "4", title: "React Testing Library", category: "testing", url: "#" },
    { id: "5", title: "React Server Components", category: "documentation", url: "#" },
    { id: "6", title: "React DevTools", category: "tools", url: "#" },
  ]

  const filtered = mockResults.filter((result) => result.title.toLowerCase().includes(query.toLowerCase()))

  return Response.json({ results: filtered.slice(0, 5) })
}
