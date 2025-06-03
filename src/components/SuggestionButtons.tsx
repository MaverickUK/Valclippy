interface SuggestionButtonsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const SUGGESTIONS = [
  "Find people based on project or skill",
  "Explore company policies", 
  "Get help with internal tools",
  "Discover recently launched initiatives",
  "Browse projects using specific frameworks"
] as const;

export function SuggestionButtons({ onSuggestionClick }: SuggestionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-8 justify-center">
      {SUGGESTIONS.map((suggestion, index) => (
        <button 
          key={index}
          className="bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}