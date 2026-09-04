'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Plus, CreditCard, ChevronRight, CheckCircle2, ChevronDown } from 'lucide-react';

export default function Checkout() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  
  // Accordion State
  const [activeStep, setActiveStep] = useState(1);
  
  // Data State
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [shippingSpeed, setShippingSpeed] = useState('prime'); // 'prime' or 'standard'

  // New forms UI state
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', zip: '' });
  const [newCard, setNewCard] = useState({ number: '', name: '', exp: '', cvc: '' });

  useEffect(() => {
    Promise.all([
      fetch(`/api/cart?t=${Date.now()}`).then(res => res.json()),
      fetch(`/api/profile/address?t=${Date.now()}`).then(res => res.json()),
      fetch(`/api/profile/payment?t=${Date.now()}`).then(res => res.json())
    ]).then(([cartData, addressData, paymentData]) => {
      setItems(cartData);
      setAddresses(addressData);
      setPayments(paymentData);
      if (addressData.length > 0) setSelectedAddress(addressData[0].id);
      if (paymentData.length > 0) setSelectedPayment(paymentData[0].id);
      setLoading(false);
    });
  }, []);

  const handleAddCard = async () => {
    if (!newCard.number || !newCard.name || !newCard.exp || !newCard.cvc) {
      alert('Please fill out all fields');
      return;
    }
    const firstDigit = newCard.number.charAt(0);
    const cardType = firstDigit === '4' ? 'Visa' : firstDigit === '5' ? 'Mastercard' : 'Credit Card';
    const last4 = newCard.number.slice(-4) || '0000';
    
    try {
      const res = await fetch('/api/profile/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardType, last4 })
      });
      const data = await res.json();
      if (data.success) {
        setPayments([...payments, data.data]);
        setSelectedPayment(data.data.id);
        setShowNewCardForm(false);
        setNewCard({ number: '', name: '', exp: '', cvc: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await fetch(`/api/profile/payment?id=${id}`, { method: 'DELETE' });
      const filtered = payments.filter(p => p.id !== id);
      setPayments(filtered);
      if (selectedPayment === id && filtered.length > 0) {
        setSelectedPayment(filtered[0].id);
      } else if (filtered.length === 0) {
        setSelectedPayment('');
      }
    } catch (err) {}
  };

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.zip) {
      alert('Please fill out all fields');
      return;
    }
    const street = `${newAddress.name} - ${newAddress.street}`;
    const city = `${newAddress.city}, ${newAddress.zip}`;
    const country = 'United States';
    
    try {
      const res = await fetch('/api/profile/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ street, city, country })
      });
      const data = await res.json();
      if (data.success) {
        setAddresses([...addresses, data.data]);
        setSelectedAddress(data.data.id);
        setShowNewAddressForm(false);
        setNewAddress({ name: '', street: '', city: '', zip: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await fetch(`/api/profile/address?id=${id}`, { method: 'DELETE' });
      const filtered = addresses.filter(a => a.id !== id);
      setAddresses(filtered);
      if (selectedAddress === id && filtered.length > 0) {
        setSelectedAddress(filtered[0].id);
      } else if (filtered.length === 0) {
        setSelectedAddress('');
      }
    } catch (err) {}
  };

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCost = shippingSpeed === 'prime' ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;



  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    try {
      const addressObj = addresses.find(a => a.id === selectedAddress);
      const addressString = addressObj ? `${addressObj.street}, ${addressObj.city}` : '123 Main St, NY';
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addressString, paymentMethod: 'credit_card' })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/orders`);
      } else {
        alert('Checkout failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-[#f3a847] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (items.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center">
      <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
      <Link href="/" className="text-blue-600 hover:underline">Continue shopping</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      
      {/* Checkout Header (No Navigation) */}
      <header className="bg-gradient-to-b from-gray-100 to-gray-50 border-b border-gray-200 py-4">
        <div className="max-w-[1000px] mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tighter">WebMCP<span className="text-[#f3a847]">Store</span></Link>
          <h1 className="text-2xl font-medium text-gray-700 hidden sm:block">Checkout (<span className="text-[#007185]">{totalItems} items</span>)</h1>
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
      </header>

      <main className="max-w-[1000px] mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        
        {/* Main Checkout Accordion Area */}
        <div className="flex-1 space-y-4">
          
          {/* STEP 1: DELIVERY ADDRESS */}
          <div className={`border ${activeStep === 1 ? 'border-orange-400 shadow-md' : 'border-gray-200/60 shadow-sm'} rounded-xl bg-white overflow-hidden transition-all`}>
            {/* Header */}
            <div 
              className={`p-4 sm:p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50 ${activeStep === 1 ? 'bg-orange-50/30' : ''}`}
              onClick={() => setActiveStep(1)}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
              <h2 className={`text-xl font-bold flex-1 ${activeStep === 1 ? 'text-orange-700' : 'text-gray-900'}`}>Choose a shipping address</h2>
              {activeStep > 1 && <span className="text-sm text-blue-600 font-medium hover:underline">Change</span>}
            </div>

            {/* Content */}
            {activeStep === 1 && (
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {addresses.length === 0 && !showNewAddressForm && (
                    <p className="text-gray-500 text-sm">No addresses found. Please add a new address.</p>
                  )}
                  {addresses.map((addr) => {
                    const [namePart, ...streetParts] = (addr.street || '').split(' - ');
                    const streetPart = streetParts.length > 0 ? streetParts.join(' - ') : namePart;
                    const displayName = streetParts.length > 0 ? namePart : 'User';
                    return (
                      <label 
                        key={addr.id} 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAddress === addr.id ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}
                      >
                        <div className="flex gap-3">
                          <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-1 accent-orange-600" />
                          <div className="flex-1">
                            <p className="font-bold">{displayName}</p>
                            <p className="text-sm text-gray-600 mt-1">{streetPart}</p>
                            <p className="text-sm text-gray-600">{addr.city}</p>
                            <p className="text-sm text-gray-600">{addr.country}</p>
                            <div className="flex gap-4 mt-2">
                              {selectedAddress === addr.id && <button className="text-sm text-blue-600 hover:underline">Edit address</button>}
                              <button onClick={(e) => handleDeleteAddress(addr.id, e)} className="text-sm text-red-600 hover:underline">Delete</button>
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {!showNewAddressForm ? (
                  <button onClick={() => setShowNewAddressForm(true)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors">
                    <Plus className="w-4 h-4" /> Add a new address
                  </button>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50/50">
                    <h3 className="font-bold mb-4">Add a new address</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} placeholder="Full name" className="col-span-2 border border-gray-300 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                      <input type="text" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} placeholder="Street address" className="col-span-2 border border-gray-300 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                      <input type="text" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} placeholder="City" className="border border-gray-300 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                      <input type="text" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} placeholder="ZIP Code" className="border border-gray-300 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button onClick={handleAddAddress} className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-sm font-bold py-2 px-4 rounded-full shadow-sm border border-[#fcd200]">Use this address</button>
                      <button onClick={() => setShowNewAddressForm(false)} className="text-sm text-gray-600 hover:underline">Cancel</button>
                    </div>
                  </div>
                )}
                
                <div className="bg-gray-50 -mx-6 -mb-6 p-4 px-6 border-t border-gray-200 mt-4 rounded-b-xl flex items-center">
                  <button onClick={() => setActiveStep(2)} className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-sm font-bold py-2.5 px-6 rounded-full shadow-sm border border-[#fcd200]">
                    Use this address
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: PAYMENT METHOD */}
          <div className={`border ${activeStep === 2 ? 'border-orange-400 shadow-md' : 'border-gray-200/60 shadow-sm'} rounded-xl bg-white overflow-hidden transition-all`}>
            {/* Header */}
            <div 
              className={`p-4 sm:p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50 ${activeStep === 2 ? 'bg-orange-50/30' : ''}`}
              onClick={() => { if (activeStep > 2 || activeStep === 1 && selectedAddress) setActiveStep(2) }}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 2 ? 'bg-orange-500 text-white' : activeStep > 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {activeStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </span>
              <h2 className={`text-xl font-bold flex-1 ${activeStep === 2 ? 'text-orange-700' : 'text-gray-900'}`}>Payment method</h2>
              {activeStep > 2 && <span className="text-sm text-blue-600 font-medium hover:underline">Change</span>}
            </div>

            {/* Content */}
            {activeStep === 2 && (
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {payments.length === 0 && !showNewCardForm && (
                    <p className="text-gray-500 text-sm">No payment methods found. Please add a new card.</p>
                  )}
                  {payments.map((card) => (
                    <label 
                      key={card.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPayment === card.id ? 'border-orange-500 bg-orange-50/20 ring-1 ring-orange-500' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex gap-3 items-start">
                        <input type="radio" name="payment" checked={selectedPayment === card.id} onChange={() => setSelectedPayment(card.id)} className="mt-1 accent-orange-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                            <span className="font-bold">{card.cardType} ending in {card.last4}</span>
                          </div>
                          <p className="text-sm text-gray-600 ml-7">User</p>
                          <div className="flex gap-4 ml-7 mt-2">
                            <button onClick={(e) => handleDeleteCard(card.id, e)} className="text-sm text-red-600 hover:underline">Delete</button>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {!showNewCardForm ? (
                  <button onClick={() => setShowNewCardForm(true)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium mb-6 transition-colors">
                    <Plus className="w-4 h-4" /> Add a credit or debit card
                  </button>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-gray-50/50">
                    <h3 className="font-bold mb-4">Add a new card</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={newCard.number} onChange={e => setNewCard({...newCard, number: e.target.value})} placeholder="Card number" className="col-span-2 border border-gray-300 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                      <input type="text" value={newCard.name} onChange={e => setNewCard({...newCard, name: e.target.value})} placeholder="Name on card" className="col-span-2 border border-gray-300 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                      <input type="text" value={newCard.exp} onChange={e => setNewCard({...newCard, exp: e.target.value})} placeholder="MM/YY" className="border border-gray-300 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                      <input type="text" value={newCard.cvc} onChange={e => setNewCard({...newCard, cvc: e.target.value})} placeholder="CVC" className="border border-gray-300 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button onClick={handleAddCard} className="bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-bold py-2 px-4 rounded-full shadow-sm transition-colors">Add card</button>
                      <button onClick={() => setShowNewCardForm(false)} className="text-sm text-gray-600 hover:underline">Cancel</button>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200 mb-6">
                  <h3 className="font-bold mb-2">Gift cards & promotional codes</h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Enter code" className="flex-1 border border-gray-300 rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none text-sm" />
                    <button className="bg-white hover:bg-gray-50 border border-gray-300 rounded px-4 py-2 text-sm font-medium transition-colors shadow-sm">Apply</button>
                  </div>
                </div>

                <div className="bg-gray-50 -mx-6 -mb-6 p-4 px-6 border-t border-gray-200 rounded-b-xl flex items-center">
                  <button onClick={() => setActiveStep(3)} className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-sm font-bold py-2.5 px-6 rounded-full shadow-sm border border-[#fcd200]">
                    Use this payment method
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: REVIEW ITEMS */}
          <div className={`border ${activeStep === 3 ? 'border-orange-400 shadow-md' : 'border-gray-200/60 shadow-sm'} rounded-xl bg-white overflow-hidden transition-all`}>
            {/* Header */}
            <div 
              className={`p-4 sm:p-6 flex items-center gap-4 cursor-pointer hover:bg-gray-50 ${activeStep === 3 ? 'bg-orange-50/30' : ''}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${activeStep === 3 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
              <h2 className={`text-xl font-bold flex-1 ${activeStep === 3 ? 'text-orange-700' : 'text-gray-900'}`}>Review items and shipping</h2>
            </div>

            {/* Content */}
            {activeStep === 3 && (
              <div className="p-6 border-t border-gray-200 bg-white">
                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
                  <h3 className="text-xl font-extrabold text-green-700 mb-2">Delivery: {shippingSpeed === 'prime' ? 'Tomorrow' : '3-5 Business Days'}</h3>
                  <p className="text-sm text-gray-500 mb-6">Items shipped from WebMCPStore</p>
                  
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Items List */}
                    <div className="flex-1 space-y-6">
                      {items.map(item => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-lg p-2 border border-gray-100 mix-blend-multiply">
                            <Image src={item.product.imgUrl || ''} alt={item.product.title} width={96} height={96} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 line-clamp-2 mb-1">{item.product.title}</h4>
                            <p className="text-[#B12704] font-bold text-lg mb-1">${item.product.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500 mt-1">Sold by: WebMCPStore</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Options */}
                    <div className="w-full md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
                      <h4 className="font-bold mb-3">Choose your Prime delivery option:</h4>
                      <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="radio" name="shipping" checked={shippingSpeed === 'prime'} onChange={() => setShippingSpeed('prime')} className="mt-1 accent-orange-600" />
                          <div>
                            <span className="font-bold text-green-700 group-hover:text-green-800 transition-colors">Tomorrow</span>
                            <p className="text-sm text-gray-600 mt-0.5">FREE Prime Delivery</p>
                          </div>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="radio" name="shipping" checked={shippingSpeed === 'standard'} onChange={() => setShippingSpeed('standard')} className="mt-1 accent-orange-600" />
                          <div>
                            <span className="font-bold text-gray-900">3-5 Business Days</span>
                            <p className="text-sm text-gray-600 mt-0.5">$5.99 - Standard Delivery</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 -mx-6 -mb-6 p-4 px-6 border-t border-gray-200 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="w-full sm:w-auto bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-sm font-bold py-3 px-8 rounded-full shadow-sm border border-[#fcd200] disabled:opacity-50"
                  >
                    {placingOrder ? 'Processing...' : 'Place your order'}
                  </button>
                  <div className="text-center sm:text-right">
                    <p className="text-xl font-bold text-[#B12704]">Order total: ${total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">By placing your order, you agree to WebMCPStore's privacy notice and conditions of use.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Persistent Sticky Sidebar */}
        <div className="w-full md:w-[320px] shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200/60 sticky top-4">
            
            <button 
              onClick={() => activeStep === 3 ? handlePlaceOrder() : setActiveStep(activeStep + 1)}
              disabled={placingOrder}
              className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 text-sm font-bold py-3.5 rounded-full shadow-sm border border-[#fcd200] mb-4 disabled:opacity-50"
            >
              {activeStep === 3 
                ? (placingOrder ? 'Processing...' : 'Place your order')
                : 'Continue'
              }
            </button>
            <p className="text-xs text-gray-500 text-center mb-6 pb-6 border-b border-gray-200">
              By placing your order, you agree to WebMCPStore's privacy notice and conditions of use.
            </p>
            
            <h3 className="font-extrabold text-lg mb-4 text-gray-900">Order Summary</h3>
            
            <div className="space-y-2 text-sm mb-4 pb-4 border-b border-gray-200 text-gray-600">
              <div className="flex justify-between"><span>Items ({totalItems}):</span> <span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping & handling:</span> <span>${shippingCost > 0 ? shippingCost.toFixed(2) : '0.00'}</span></div>
              {shippingSpeed === 'prime' && (
                <div className="flex justify-between text-green-700"><span>Prime Free Delivery:</span> <span>-$0.00</span></div>
              )}
              <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                <span>Total before tax:</span> <span>${(subtotal + shippingCost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between"><span>Estimated tax to be collected:</span> <span>${tax.toFixed(2)}</span></div>
            </div>
            
            <div className="flex justify-between text-2xl font-bold text-[#B12704] mb-4">
              <span>Order total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <p className="text-xs text-blue-600 hover:underline cursor-pointer">How are shipping costs calculated?</p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
