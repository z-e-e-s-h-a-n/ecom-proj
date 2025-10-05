export const orderConfirmationTemplate = (order: any) => ({
  subject: `🛍️ Order Confirmed — #${order.id}`,
  html: `
    <h1>Thank you for your order, ${order.customerName || "friend"}!</h1>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Total:</strong> $${order.total}</p>
    <p>We’ll notify you once your order is shipped. You can track your order in your dashboard.</p>
    <hr />
    <p>Thanks for choosing Evorii. We’re excited to craft something meaningful for you!</p>
  `,
  text: `Your order #${order.id} is confirmed. Total: $${order.total}. We'll notify you once it's shipped. Thank you for choosing Evorii!`,
});
