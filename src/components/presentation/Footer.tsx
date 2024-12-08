import { format } from 'date-fns';
import { usePresentationContext } from '@/hooks/usePresentationContext';

export function Footer() {
  const { data, currentSlideIndex } = usePresentationContext();
  if (!data) return null;

  const { documentName, settings, slides } = data;

  return (
    <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-sm border-t rounded-b-2xl">
      <div className="flex items-center gap-2">
        <img src={settings.footer.logoUrl} alt="Logo" className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-4">
        <div className="font-medium text-gray-700">{documentName}</div>
        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          {currentSlideIndex + 1}/{slides.length}
        </div>
      </div>
      <div className="text-sm text-gray-500">
        {format(new Date(settings.date), settings.footer.dateFormat)}
      </div>
    </footer>
  );
}