import { Message } from '@/types/chat';
import { formatMessage } from '@/utils/messageFormatter';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="self-end bg-white rounded-xl px-6 py-4 text-lg font-medium shadow max-w-[80%] text-gray-800">
        {message.content}
      </div>
    );
  }

  return (
    <div className="self-start px-6 py-4 text-base max-w-[80%] flex items-start gap-3 text-gray-800">
      <img src="/mascot.png" alt="Mascot" className="w-8 h-8 mr-2" />
      <div>
        {message.content.split('\n').map((line, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: formatMessage(line) }} />
        ))}
      </div>
    </div>
  );
}