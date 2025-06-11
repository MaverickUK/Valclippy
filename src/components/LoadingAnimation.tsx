import { useRandomLoadingMessage } from '@/hooks/useRandomLoadingMessage';

export function LoadingAnimation() {
  const loadingMessage = useRandomLoadingMessage();
  
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-600">{loadingMessage}</span>
      <div className="flex gap-1 ml-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}