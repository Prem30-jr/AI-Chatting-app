"use client"

export interface MockResponse {
  text: string
  artifacts?: Array<{
    type: "code" | "markdown" | "html"
    language?: string
    title: string
    content: string
  }>
}

const MOCK_RESPONSES: { [key: string]: MockResponse } = {
  default: {
    text: `I understand you're asking about that topic. Here's what I can help you with:

1. **First Point**: This is the initial consideration for your question. It provides context and foundational information.

2. **Second Point**: Building on that, here's a deeper dive into the subject matter with more technical details.

3. **Third Point**: Finally, let me tie this together with practical applications and best practices.

Feel free to ask follow-up questions or request clarification on any of these points.`,
    artifacts: [
      {
        type: "code",
        language: "typescript",
        title: "Example Implementation",
        content: `// Example TypeScript code
interface Response {
  status: number;
  data: unknown;
  error?: string;
}

async function fetchData(url: string): Promise<Response> {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    return {
      status: 500,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}`,
      },
    ],
  },
  code: {
    text: `Here's a helpful code example for you. This demonstrates best practices and common patterns used in modern development.`,
    artifacts: [
      {
        type: "code",
        language: "javascript",
        title: "React Component Example",
        content: `export function Counter() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="p-4 space-y-2">
      <p className="text-lg">Count: {count}</p>
      <button
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Increment
      </button>
    </div>
  );
}`,
      },
    ],
  },
  markdown: {
    text: `# Understanding the Topic

This is comprehensive information about your question.

## Key Sections

### Section 1
Some detailed explanation here with **bold** and *italic* text.

### Section 2
- Point one
- Point two
- Point three

### Section 3
This concludes our overview.`,
  },
  html: {
    text: `I've created an interactive example for you:`,
    artifacts: [
      {
        type: "html",
        title: "Interactive Demo",
        content: `<div style="padding: 20px; border-radius: 8px; background: #f5f5f5;">
  <h3 style="margin-top: 0; color: #333;">Interactive Example</h3>
  <button id="demo-btn" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">Click me</button>
  <p id="demo-text" style="margin-top: 12px; color: #666;"></p>
  <script>
    let clicks = 0;
    document.getElementById('demo-btn').onclick = function() {
      clicks++;
      document.getElementById('demo-text').textContent = 'You clicked ' + clicks + ' times!';
    };
  </script>
</div>`,
      },
    ],
  },
}

// Simulate intelligent response selection based on user input
function selectMockResponse(userMessage: string): MockResponse {
  const lowerMessage = userMessage.toLowerCase()

  if (
    lowerMessage.includes("code") ||
    lowerMessage.includes("example") ||
    lowerMessage.includes("function") ||
    lowerMessage.includes("component")
  ) {
    return MOCK_RESPONSES.code
  }

  if (
    lowerMessage.includes("explain") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("what") ||
    lowerMessage.includes("how")
  ) {
    return MOCK_RESPONSES.markdown
  }

  if (
    lowerMessage.includes("interactive") ||
    lowerMessage.includes("demo") ||
    lowerMessage.includes("example") ||
    lowerMessage.includes("html")
  ) {
    return MOCK_RESPONSES.html
  }

  return MOCK_RESPONSES.default
}

export function generateMockStreamingResponse(userMessage: string): AsyncGenerator<string, void, unknown> {
  return generateStreamingText(
    selectMockResponse(userMessage).text,
    30, // ms delay between words
  )
}

export function getArtifactsForResponse(userMessage: string) {
  return selectMockResponse(userMessage).artifacts || []
}

// Generator for streaming text word-by-word
async function* generateStreamingText(text: string, delayMs: number): AsyncGenerator<string, void, unknown> {
  const words = text.split(" ")
  let accumulated = ""

  for (const word of words) {
    accumulated += (accumulated ? " " : "") + word
    yield accumulated
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
}
