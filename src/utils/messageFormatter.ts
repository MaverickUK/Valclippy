export function formatMessage(text: string): string {
  return text
    // Bold text: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text: *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Person cards: PERSON: initials|name|role|description|skills|projects
    .replace(/PERSON: ([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|(.+)/, (match, initials, name, role, description, skills, projects) => {
      const skillTags = formatTags(skills, 'bg-gray-200 text-gray-700');
      const projectTags = formatTags(projects, 'bg-blue-100 text-blue-700');
      
      return `<div class="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm flex-shrink-0">${initials}</div>
        <div class="flex-1">
          <h3 class="font-semibold text-lg text-gray-900">${name}</h3>
          <p class="text-gray-600 text-sm mb-2">${role}</p>
          <p class="text-gray-800 mb-3">${description}</p>
          <div class="mb-2">${skillTags}</div>
        </div>
      </div>`;
    })
    // Topic boxes: TOPIC: text -> gray clickable boxes with onclick
    .replace(/TOPIC: (.+)/, (match, topic) => 
      `<div class="bg-gray-300 text-gray-800 px-4 py-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-400 transition-colors" onclick="window.handleTopicClick('${topic}')">${topic}</div>`
    )
    // Skills tags: Skills: word word -> Skills: <span class="tag">word</span> <span class="tag">word</span>
    .replace(/Skills: (.+)/, (match, skills) => {
      const skillTags = formatTags(skills, 'bg-gray-200 text-gray-700');
      return `Skills: ${skillTags}`;
    });
}

function formatTags(items: string, className: string): string {
  return items.split(',')
    .filter((item: string) => item.trim() !== '')
    .map((item: string) => 
      `<span class="inline-block ${className} px-2 py-1 rounded text-xs mr-1">${item.trim()}</span>`
    ).join('');
}