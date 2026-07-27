import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppCS() {
  const whatsappUrl = "https://wa.me/6285717578072?text=Halo%20CS%20StepLuxe,%20saya%20ingin%20melapor%20/%20bertanya%20mengenai%20layanan.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      title="Lapor ke CS via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 group border border-emerald-400/30"
    >
      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform">
        <MessageCircle className="w-4 h-4 text-white fill-white" />
      </div>
      <span className="hidden sm:inline">Lapor CS WhatsApp</span>
      <span className="sm:hidden">CS WA</span>
    </a>
  );
}
