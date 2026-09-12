import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    'Hi MediBridge Health, I would like to inquire about TPA desk management and pending claim recovery.'
  );
  return (
    <a
      href={`https://wa.me/917669017779?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="WhatsApp Support"
    >
      <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity animate-pulse" />
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
        <MessageCircle className="w-7 h-7 text-white" fill="white" strokeWidth={0} />
      </div>
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#061224] border border-green-400/20 text-green-300 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}
