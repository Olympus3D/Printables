import { WHATSAPP_NUMBER } from '../config';

type WhatsAppContext = 'quote' | 'contact' | 'order' | 'product';

export function getWhatsAppMessage(context: WhatsAppContext, productName?: string): string {
  switch (context) {
    case 'quote':
      return 'Olá! Quero solicitar um orçamento para uma peça personalizada.';
    case 'contact':
      return 'Olá! Tenho uma dúvida rápida sobre o catálogo da Olympus 3D.';
    case 'order':
      return 'Olá! Quero finalizar um pedido com vocês.';
    case 'product':
      return productName
        ? `Olá! Quero comprar o produto: ${productName}`
        : 'Olá! Quero comprar um produto do catálogo.';
    default:
      return 'Olá!';
  }
}

export function createWhatsAppUrl(message?: string): string {
  if (!message) return `https://wa.me/${WHATSAPP_NUMBER}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}