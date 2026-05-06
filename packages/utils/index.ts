export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function calculateOrderTotal(items: Array<{ quantity: number; unitPrice: number }>): number {
  return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
}
