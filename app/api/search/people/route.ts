export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""

  if (!query || query.length < 1) {
    return Response.json({ people: [] })
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Generate mock people data
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"]
  const mockPeople = []

  for (let i = 0; i < firstNames.length; i++) {
    for (let j = 0; j < lastNames.length; j++) {
      mockPeople.push({
        id: `person-${i}-${j}`,
        name: `${firstNames[i]} ${lastNames[j]}`,
        username: `@${firstNames[i].toLowerCase()}${lastNames[j].toLowerCase()}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstNames[i]}${lastNames[j]}`,
      })
    }
  }

  // Filter by query
  const filtered = mockPeople.filter(
    (person) =>
      person.name.toLowerCase().includes(query.toLowerCase()) ||
      person.username.toLowerCase().includes(query.toLowerCase()),
  )

  return Response.json({ people: filtered.slice(0, 8) })
}
