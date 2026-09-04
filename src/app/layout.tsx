import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "WebMCPStore - AI Powered Shopping",
  description: "Shop for everything with your AI agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  window.modelContext = window.modelContext || {};
                  window.modelContext.tools = window.modelContext.tools || [];
                  window.modelContext.registerTool = window.modelContext.registerTool || function(tool) {
                    this.tools.push(tool);
                  };
                  document.modelContext = window.modelContext;
                  const ctx = document.modelContext;
                  
                  ctx.registerTool({
                    name: "search_products",
                    description: "Search the 100k product catalog.",
                    inputSchema: {
                      type: "object",
                      properties: { query: { type: "string" }, category: { type: "string" } },
                      required: ["query"]
                    },
                    execute: async (input) => {
                      const url = new URL(window.location.origin + '/api/search');
                      if (input.query) url.searchParams.append('q', input.query);
                      if (input.category) url.searchParams.append('category', input.category);
                      const res = await fetch(url.toString());
                      return await res.json();
                    }
                  });

                  ctx.registerTool({
                    name: "get_product_details",
                    description: "Fetch deep metadata (reviews, specs, price, ASIN) for a product.",
                    inputSchema: {
                      type: "object",
                      properties: { asin: { type: "string" } },
                      required: ["asin"]
                    },
                    execute: async (input) => {
                      const res = await fetch('/api/product?asin=' + input.asin);
                      return await res.json();
                    }
                  });

                  ctx.registerTool({
                    name: "get_todays_deals",
                    description: "Fetch the highest-rated Best Sellers and current promotions.",
                    inputSchema: { type: "object", properties: {} },
                    execute: async () => {
                      const res = await fetch('/api/deals');
                      return await res.json();
                    }
                  });

                  ctx.registerTool({
                    name: "view_cart",
                    description: "View current shopping cart contents.",
                    inputSchema: { type: "object", properties: {} },
                    execute: async () => {
                      const res = await fetch('/api/cart');
                      return await res.json();
                    }
                  });

                  ctx.registerTool({
                    name: "add_to_cart",
                    description: "Add a product to the cart by its database ID.",
                    inputSchema: {
                      type: "object",
                      properties: { productId: { type: "string" }, quantity: { type: "number" } },
                      required: ["productId"]
                    },
                    execute: async (input) => {
                      const res = await fetch('/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productId: input.productId, quantity: input.quantity || 1, addedBy: "agent" })
                      });
                      const data = await res.json();
                      window.dispatchEvent(new Event('cartUpdated'));
                      return data;
                    }
                  });

                  ctx.registerTool({
                    name: "remove_from_cart",
                    description: "Remove a specific item from the cart by its cartItemId.",
                    inputSchema: {
                      type: "object",
                      properties: { cartItemId: { type: "string" } },
                      required: ["cartItemId"]
                    },
                    execute: async (input) => {
                      const res = await fetch('/api/cart?id=' + input.cartItemId, { method: 'DELETE' });
                      const data = await res.json();
                      window.dispatchEvent(new Event('cartUpdated'));
                      return data;
                    }
                  });

                  ctx.registerTool({
                    name: "update_cart_quantity",
                    description: "Set the exact quantity of a specific cart item.",
                    inputSchema: {
                      type: "object",
                      properties: { productId: { type: "string" }, quantity: { type: "number" } },
                      required: ["productId", "quantity"]
                    },
                    execute: async (input) => {
                      const res = await fetch('/api/cart/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(input)
                      });
                      const data = await res.json();
                      window.dispatchEvent(new Event('cartUpdated'));
                      return data;
                    }
                  });

                  ctx.registerTool({
                    name: "clear_cart",
                    description: "Empty the cart entirely.",
                    inputSchema: { type: "object", properties: {} },
                    execute: async () => {
                      const res = await fetch('/api/cart/clear', { method: 'POST' });
                      const data = await res.json();
                      window.dispatchEvent(new Event('cartUpdated'));
                      return data;
                    }
                  });

                  ctx.registerTool({
                    name: "get_user_profile",
                    description: "Fetch the user's name, email, saved addresses, and payment methods.",
                    inputSchema: { type: "object", properties: {} },
                    execute: async () => {
                      const res = await fetch('/api/profile');
                      return await res.json();
                    }
                  });

                  ctx.registerTool({
                    name: "add_saved_address",
                    description: "Add a new delivery address.",
                    inputSchema: {
                      type: "object",
                      properties: { street: { type: "string" }, city: { type: "string" }, country: { type: "string" } },
                      required: ["street", "city", "country"]
                    },
                    execute: async (input) => {
                      const res = await fetch('/api/profile/address', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(input)
                      });
                      return await res.json();
                    }
                  });

                  ctx.registerTool({
                    name: "add_payment_method",
                    description: "Add a new credit card.",
                    inputSchema: {
                      type: "object",
                      properties: { cardType: { type: "string" }, last4: { type: "string" } },
                      required: ["cardType", "last4"]
                    },
                    execute: async (input) => {
                      const res = await fetch('/api/profile/payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(input)
                      });
                      return await res.json();
                    }
                  });

                  ctx.registerTool({
                    name: "checkout_order",
                    description: "Draft an order for the current cart and send it to the user for final approval. Does not immediately process payment.",
                    inputSchema: {
                      type: "object",
                      properties: { addressId: { type: "string" }, paymentMethodId: { type: "string" } },
                      required: ["addressId", "paymentMethodId"]
                    },
                    execute: async (input) => {
                      const res = await fetch('/api/checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(input)
                      });
                      const data = await res.json();
                      if(data.success) {
                        return { success: true, message: "Order drafted and sent to the user for approval.", orderId: data.orderId };
                      }
                      return data;
                    }
                  });

                  ctx.registerTool({
                    name: "recommend_product",
                    description: "Recommend a product to the user instead of adding it directly to their cart.",
                    inputSchema: {
                      type: "object",
                      properties: { productId: { type: "string" }, reason: { type: "string" } },
                      required: ["productId", "reason"]
                    },
                    execute: async (input) => {
                      const res = await fetch('/api/recommendations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(input)
                      });
                      const data = await res.json();
                      window.dispatchEvent(new Event('cartUpdated')); // Trigger UI refresh for recs
                      return data;
                    }
                  });

                  ctx.registerTool({
                    name: "view_orders",
                    description: "Check the user's order history and statuses.",
                    inputSchema: { type: "object", properties: {} },
                    execute: async () => {
                      const res = await fetch('/api/orders');
                      return await res.json();
                    }
                  });

                  ctx.registerTool({
                    name: "leave_product_review",
                    description: "Submit a 1-5 star review and comment on a purchased product.",
                    inputSchema: {
                      type: "object",
                      properties: { productId: { type: "string" }, stars: { type: "number" }, comment: { type: "string" } },
                      required: ["productId", "stars", "comment"]
                    },
                    execute: async (input) => {
                      const res = await fetch('/api/reviews', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(input)
                      });
                      return await res.json();
                    }
                  });

                  console.log("Super-Agent WebMCP 14-Tool God-Mode Suite registered synchronously.");
                } catch (e) {
                  console.error(e);
                }
              })();
            `
          }}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
