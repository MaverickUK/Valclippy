export function formatMessage(text: string): string {
  return text
    // Bold text: **text** -> <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text: *text* -> <em>text</em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Person cards: PERSON: initials|name|role|description|skills|projects
    .replace(/PERSON: ([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|(.+?)(?=\s*PERSON:|$)/g, (match, initials, name, role, description, skills, projects) => {
      const skillTags = formatTags(skills, 'bg-gray-200 text-gray-700');
      const projectTags = formatTags(projects, 'bg-blue-100 text-blue-700');
      
      return `<div class="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 font-semibold text-sm flex-shrink-0">${initials}</div>
        <div class="flex-1">
          <h3 class="font-semibold text-lg text-gray-900">${name}</h3>
          <p class="text-gray-600 text-sm mb-2">${role}</p>
          <p class="text-gray-800 mb-3">${description}</p>
          <div class="mb-2">${skillTags}</div>
          <div class="mb-2">${projectTags}</div>
        </div>
      </div>`;
    })
    // Project documentation list format: DOCLIST: project_name|doc1:source:modified|doc2:source:modified...
    .replace(/DOCLIST: ([^|]+)\|(.*)/g, (match, projectName, docsData) => {
      const docs = docsData.split('|').map(docStr => {
        const [name, source, lastModified, , warning] = docStr.split(':');
        return { name, source, lastModified, warning };
      });
      
      // Count sources
      const sourceCounts = docs.reduce((acc, doc) => {
        acc[doc.source] = (acc[doc.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const totalCount = docs.length;
      
      // Create filter tabs
      const filterTabs = `
        <div class="flex items-center gap-2 mb-4">
          <span class="bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">All ${totalCount}</span>
          ${sourceCounts.confluence ? `<span class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm whitespace-nowrap">Confluence ${sourceCounts.confluence}</span>` : ''}
          ${sourceCounts.excel ? `<span class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm whitespace-nowrap">Excel ${sourceCounts.excel}</span>` : ''}
          ${sourceCounts.word ? `<span class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm whitespace-nowrap">Word ${sourceCounts.word}</span>` : ''}
          ${sourceCounts.teams ? `<span class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm whitespace-nowrap">Teams ${sourceCounts.teams}</span>` : ''}
          <div class="ml-auto">
            <span class="text-gray-600 text-sm">Sort by ↓</span>
          </div>
        </div>
      `;
      
      // Create document rows
      const docRows = docs.map(doc => {
        const getSourceIcon = (source: string) => {
          switch(source) {
            case 'confluence': return '<img src="/icons/confluence.png" style="width: 24px; height: 24px;" />';
            case 'excel': return '<img src="/icons/excel.png" style="width: 24px; height: 24px;" />';
            case 'word': return '<img src="/icons/word.png" style="width: 24px; height: 24px;" />';
            case 'teams': return '<img src="/icons/teams.png" style="width: 24px; height: 24px;" />';
            default: return '📁';
          }
        };
        
        const warningIcon = doc.warning ? `<span class="text-orange-500 text-sm">⚠️ ${doc.warning}</span>` : '';
        
        return `
          <tr class="hover:bg-gray-50 border-b border-gray-200">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <span class="text-lg">${getSourceIcon(doc.source)}</span>
                <span class="font-medium text-gray-900">${doc.name}</span>
              </div>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-4">
                <span class="text-gray-600 text-sm">${doc.lastModified}</span>
                ${warningIcon}
              </div>
            </td>
          </tr>
        `;
      }).join('');
      
      return `<div class="my-4">
        <div class="mb-3">
          <span class="text-gray-800">Good question! This is what I can find for project documentation for ${projectName}.</span>
        </div>
        ${filterTabs}
        <div class="border border-gray-300 rounded-lg overflow-hidden bg-white">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-100 border-b border-gray-200">
                <th class="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                <th class="px-4 py-3 text-right font-semibold text-gray-900">Last modified</th>
              </tr>
            </thead>
            <tbody>
              ${docRows}
            </tbody>
          </table>
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