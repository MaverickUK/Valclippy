import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

export function RiveMascot() {
  const { RiveComponent } = useRive({
    src: 'https://public.rive.app/hosted/337622/271049/Cc25fXJvokGF-QQw-xh5oA.riv',
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  return (
    <div className="w-24 h-24">
      <RiveComponent />
    </div>
  );
} 