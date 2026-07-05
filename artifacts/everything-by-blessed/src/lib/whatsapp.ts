export function getWhatsAppLink(message: string) {
  const number = "2348062951033";
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function getProductWhatsAppMessage(productName: string) {
  return `Hello Everything by Blessed, I'm interested in the ${productName} displayed on your website. Please send me more information.`;
}
