"use client";

import Link from 'next/link';
import { useState } from 'react';
import { CheckCircle2, X, Package, Truck, Home, Star, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [activeTab, setActiveTab] = useState("Orders");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<{ type: string; order?: any; item?: any } | null>(null);
  const [rating, setRating] = useState(0);
  const [returnedItems, setReturnedItems] = useState<Set<string>>(new Set());
  const [reviewedItems, setReviewedItems] = useState<Set<string>>(new Set());
  const router = useRouter();

  const handleReturnSubmit = (itemId: string) => {
    const newSet = new Set(returnedItems);
    newSet.add(itemId);
    setReturnedItems(newSet);
    showToast('Return request successfully submitted!');
  };

  const handleFeedbackSubmit = (itemId: string) => {
    const newSet = new Set(reviewedItems);
    newSet.add(itemId);
    setReviewedItems(newSet);
    showToast('Thank you for your feedback!');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
    setActiveModal(null);
  };

  const handleApprove = async (orderId: string) => {
    try {
      const res = await fetch('/api/orders/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        showToast('Order approved and payment processing!');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        showToast('Failed to approve order.');
      }
    } catch (err) {
      showToast('Error approving order.');
    }
  };

  const handleBuyAgain = async (productId: string | undefined, isMock: boolean) => {
    if (isMock || !productId) {
      showToast('Successfully added to your cart!');
      router.push('/cart');
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      
      if (res.ok) {
        showToast('Successfully added to your cart!');
        setTimeout(() => router.push('/cart'), 500);
      } else {
        showToast('Error adding to cart. Please try again.');
      }
    } catch (err) {
      showToast('Error adding to cart. Please try again.');
    }
  };

  const tabs = ["Orders", "Buy Again", "Not Yet Shipped", "Cancelled Orders"];

  // Mock data for the empty state
  const mockOrder = {
    id: "112-9876543-1234567",
    date: "September 1, 2026",
    total: "$299.99",
    address: "Demo User - New York 10001",
    status: "Delivered yesterday",
    statusColor: "text-green-700",
    statusDot: "bg-green-500 animate-pulse",
    title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    imgUrl: "https://m.media-amazon.com/images/I/71VyM0hLkfL._AC_UL320_.jpg",
    asin: "B09XS7JWHH", // Example ASIN
  };

  const renderModals = () => {
    if (!activeModal) return null;

    const { type, order, item } = activeModal;
    const isMock = !order?.createdAt;
    const baseDate = isMock ? new Date('2026-09-01T10:00:00Z') : new Date(order?.createdAt);
    const orderDateStr = baseDate.toLocaleDateString();
    
    // Simulate shipping dates
    const shippedDate = new Date(baseDate.getTime() + 86400000);
    const deliveredDate = new Date(baseDate.getTime() + 86400000 * 3);
    const now = new Date();
    
    const isShipped = now >= shippedDate || isMock;
    const isDelivered = now >= deliveredDate || isMock;

    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
          
          <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-1 transition-colors">
            <X className="w-5 h-5" />
          </button>

          {/* Tracking Modal */}
          {type === 'track' && (
            <div className="p-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Track Package</h2>
              {item && <p className="text-gray-500 mb-6 text-sm font-bold truncate">For: {item.product.title}</p>}
              <div className="relative border-l-2 border-green-500 ml-4 space-y-8 pb-4">
                <div className="relative">
                  <div className="absolute -left-[21px] bg-green-500 p-2 rounded-full ring-4 ring-white"><Package className="w-4 h-4 text-white" /></div>
                  <div className="pl-6">
                    <h4 className="font-bold text-gray-900">Ordered</h4>
                    <p className="text-sm text-gray-500">{orderDateStr}</p>
                  </div>
                </div>
                <div className={`relative ${!isShipped && 'opacity-40'}`}>
                  <div className={`absolute -left-[21px] p-2 rounded-full ring-4 ring-white ${isShipped ? 'bg-green-500' : 'bg-gray-300'}`}><Truck className="w-4 h-4 text-white" /></div>
                  <div className="pl-6">
                    <h4 className="font-bold text-gray-900">Shipped</h4>
                    <p className="text-sm text-gray-500">{isShipped ? shippedDate.toLocaleDateString() : 'Pending'}</p>
                  </div>
                </div>
                <div className={`relative ${!isDelivered && 'opacity-40'}`}>
                  <div className={`absolute -left-[21px] p-2 rounded-full ring-4 ring-white ${isDelivered ? 'bg-green-500' : 'bg-gray-300'}`}><Home className="w-4 h-4 text-white" /></div>
                  <div className="pl-6">
                    <h4 className="font-bold text-gray-900">Delivered</h4>
                    <p className="text-sm text-gray-500">{isDelivered ? `Delivered on ${deliveredDate.toLocaleDateString()}` : 'Expected soon'}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="w-full mt-6 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">
                Close Tracking
              </button>
            </div>
          )}

          {/* Returns Modal */}
          {type === 'return' && (
            <div className="p-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Return Item</h2>
              <p className="text-gray-500 mb-4 text-sm font-bold truncate">Returning: {item?.product.title}</p>
              <p className="text-gray-500 mb-6 text-sm">Please let us know why you are returning this item.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Reason for return</label>
                  <div className="relative">
                    <select className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5 appearance-none">
                      <option>Item arrived damaged</option>
                      <option>Missing parts or accessories</option>
                      <option>No longer needed</option>
                      <option>Incompatible or not useful</option>
                      <option>Wrong item was sent</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Additional Comments (Optional)</label>
                  <textarea rows={3} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5" placeholder="Tell us more about the issue..."></textarea>
                </div>
              </div>

              <button onClick={() => handleReturnSubmit(item.id)} className="w-full mt-6 bg-[#ffd814] text-gray-900 border border-[#fcd200] font-bold py-3 rounded-xl hover:bg-[#f7ca00] transition-colors shadow-sm">
                Submit Return Request
              </button>
            </div>
          )}

          {/* Feedback Modal */}
          {type === 'feedback' && (
            <div className="p-8">
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Leave Feedback</h2>
              <p className="text-gray-500 mb-4 text-sm font-bold truncate">For: {item?.product.title}</p>
              <p className="text-gray-500 mb-6 text-sm">How was your experience with WebMCPStore?</p>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-10 h-10 cursor-pointer transition-colors ${star <= rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300 hover:text-orange-200'}`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Write a review</label>
                <textarea rows={4} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block p-2.5" placeholder="What did you like or dislike?"></textarea>
              </div>

              <button onClick={() => handleFeedbackSubmit(item.id)} className="w-full mt-6 bg-[#ffd814] text-gray-900 border border-[#fcd200] font-bold py-3 rounded-xl hover:bg-[#f7ca00] transition-colors shadow-sm">
                Submit Feedback
              </button>
            </div>
          )}

        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (activeTab === "Buy Again") {
      return (
        <div className="bg-white p-12 border border-gray-200/60 rounded-2xl text-center text-gray-600 shadow-sm flex flex-col items-center justify-center">
          <Package className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Buy Again</h3>
          <p>There are no recommended items to buy again at this time.</p>
          <button onClick={() => setActiveTab('Orders')} className="mt-6 text-blue-600 hover:underline font-medium" suppressHydrationWarning>View past orders</button>
        </div>
      );
    }
    
    if (activeTab === "Not Yet Shipped") {
      return (
        <div className="bg-white p-12 border border-gray-200/60 rounded-2xl text-center text-gray-600 shadow-sm flex flex-col items-center justify-center">
          <Truck className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Looking for an order?</h3>
          <p>You have no orders waiting to be shipped.</p>
        </div>
      );
    }

    if (activeTab === "Cancelled Orders") {
      return (
        <div className="bg-white p-12 border border-gray-200/60 rounded-2xl text-center text-gray-600 shadow-sm flex flex-col items-center justify-center">
          <X className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Cancelled Orders</h3>
          <p>You have not cancelled any orders.</p>
        </div>
      );
    }

    // Default "Orders" tab
    const ordersToRender = initialOrders.length > 0 ? initialOrders : [mockOrder];

    return (
      <div className="space-y-6">
        {ordersToRender.map((order, idx) => {
          const isMock = initialOrders.length === 0;
          const orderId = isMock ? order.id : order.id;
          const orderDate = isMock ? order.date : new Date(order.createdAt).toLocaleDateString();
          const orderTotal = isMock ? order.total : `$${order.total.toFixed(2)}`;
          const orderAddress = isMock ? order.address : order.address;
          const orderStatus = isMock ? order.status : order.status;
          
          const items = isMock ? [{
            id: 'mock-item',
            product: {
              id: 1, // Fallback mock ID
              title: order.title,
              imgUrl: order.imgUrl,
              asin: order.asin
            }
          }] : order.items;

          return (
            <div key={idx} className="border border-gray-200/60 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
              {/* Order Header */}
              <div className="bg-gray-50/80 p-4 border-b border-gray-200/60 flex flex-wrap justify-between text-sm text-gray-600">
                <div className="flex gap-8">
                  <div>
                    <p className="uppercase font-bold text-gray-500 text-xs tracking-wider mb-1">Order Placed</p>
                    <p suppressHydrationWarning className="font-medium text-gray-900">{orderDate}</p>
                  </div>
                  <div>
                    <p className="uppercase font-bold text-gray-500 text-xs tracking-wider mb-1">Total</p>
                    <p suppressHydrationWarning className="font-medium text-gray-900">{orderTotal}</p>
                  </div>
                  <div>
                    <p className="uppercase font-bold text-gray-500 text-xs tracking-wider mb-1">Ship To</p>
                    <p className="text-blue-600 hover:text-orange-600 transition-colors cursor-pointer font-medium line-clamp-1 max-w-[200px]">{orderAddress}</p>
                  </div>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <p className="uppercase font-bold text-gray-500 text-xs tracking-wider mb-1">Order # {orderId}</p>
                  <button onClick={() => showToast('Order receipt sent to your email!')} className="text-blue-600 hover:text-orange-600 transition-colors cursor-pointer font-medium" suppressHydrationWarning>View order details</button>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <h3 className="font-extrabold text-xl mb-6 text-green-700 flex items-center gap-2">
                  {orderStatus === "Pending Approval" ? (
                    <><span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span><span className="text-orange-700">Awaiting Your Approval</span></>
                  ) : (
                    <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>{orderStatus}</>
                  )}
                </h3>
                <div className="space-y-6">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-32 h-32 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center p-2 border border-gray-100 mix-blend-multiply">
                        <Image src={item.product.imgUrl || ''} alt={item.product.title} width={128} height={128} className="w-full h-full object-contain cursor-pointer" onClick={() => window.open(item.product.imgUrl, '_blank')} />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <Link href={isMock ? `/dp/B01N2Z02K3` : `/dp/${item.product.asin}`} className="font-bold text-lg text-gray-900 hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-gray-500 mb-4">Sold by: WebMCPStore</p>
                        <div className="flex gap-3">
                          <button onClick={() => handleBuyAgain(item.product.id, isMock)} className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-sm font-bold py-2 px-5 rounded-full shadow-sm transition-colors border border-[#fcd200]" suppressHydrationWarning>
                            Buy it again
                          </button>
                          <Link href={isMock ? `/dp/B01N2Z02K3` : `/dp/${item.product.asin}`} className="bg-white hover:bg-gray-50 text-gray-900 text-sm font-bold py-2 px-5 rounded-full shadow-sm transition-colors border border-gray-200/60 inline-flex items-center justify-center">
                            View your item
                          </Link>
                        </div>
                      </div>
                      <div className="w-full sm:w-56 shrink-0 flex flex-col gap-3 justify-center">
                         {orderStatus === "Pending Approval" ? (
                           <button onClick={() => handleApprove(orderId)} className="w-full bg-[#ffd814] text-gray-900 font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors border border-[#fcd200] text-center hover:bg-[#f7ca00]" suppressHydrationWarning>
                             Approve & Pay
                           </button>
                         ) : (
                           <>
                             <button onClick={() => setActiveModal({ type: 'track', order, item })} className="w-full bg-white hover:bg-gray-50 text-gray-900 text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors border border-gray-200/60 text-center" suppressHydrationWarning>
                                Track package
                             </button>
                             {!returnedItems.has(item.id) ? (
                               <button onClick={() => setActiveModal({ type: 'return', order, item })} className="w-full bg-white hover:bg-gray-50 text-gray-900 text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors border border-gray-200/60 text-center" suppressHydrationWarning>
                                  Return or replace items
                               </button>
                             ) : (
                               <div className="w-full bg-gray-100 text-gray-500 text-sm font-bold py-2.5 px-4 rounded-xl border border-gray-200 text-center flex items-center justify-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" /> Return Requested
                               </div>
                             )}
                             {!reviewedItems.has(item.id) ? (
                               <button onClick={() => setActiveModal({ type: 'feedback', order, item })} className="w-full bg-white hover:bg-gray-50 text-gray-900 text-sm font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors border border-gray-200/60 text-center" suppressHydrationWarning>
                                  Leave seller feedback
                               </button>
                             ) : (
                               <div className="w-full bg-gray-100 text-gray-500 text-sm font-bold py-2.5 px-4 rounded-xl border border-gray-200 text-center flex items-center justify-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" /> Feedback Submitted
                               </div>
                             )}
                           </>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="max-w-[1200px] mx-auto p-4 md:p-8 relative z-10">
      
      {renderModals()}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[60] bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-lg flex items-center animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
          <p className="text-green-800 font-bold text-sm">{toastMessage}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 mt-4">
        <div className="flex items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Orders</h1>
        </div>
        <div className="flex gap-4 border-b border-gray-200 w-full md:w-auto md:flex-1 md:ml-8 mt-4 md:mt-0 overflow-x-auto text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 whitespace-nowrap transition-colors font-bold ${
                activeTab === tab
                  ? "border-b-2 border-[#f3a847] text-[#c47715]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              suppressHydrationWarning
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {renderContent()}

    </main>
  );
}
