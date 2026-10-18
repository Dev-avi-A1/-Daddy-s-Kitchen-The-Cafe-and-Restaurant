import React, { useState } from 'react';
import { MapPin, Phone, Clock, Mail, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Which neighborhoods in Butwal do you deliver to?',
      a: 'We deliver directly across Kalikanagar, Golpark, Traffic Chowk, Amarpath, Deepnagar, Ramnagar, Tilottama / Driver Tole, and Manigram. Orders are dispatched hot in thermal food bags.',
    },
    {
      q: 'What is the late-night delivery timing?',
      a: 'Our dining floor closes at 10:00 PM (11:00 PM on weekends), but our night delivery kitchen remains active until 2:00 AM with standard minimum order requirements.',
    },
    {
      q: 'How does Dine-In QR table ordering work?',
      a: 'When you are seated at Daddy’s Kitchen, scan the QR code on your table (or enter your table number in the checkout screen). Your order is dispatched directly to the kitchen line without waiting for a waiter.',
    },
    {
      q: 'Can I pay using eSewa or Khalti on delivery?',
      a: 'Yes! You can pay seamlessly online during checkout using our eSewa or Khalti integration, or select Cash on Delivery / Cash on Pickup.',
    },
    {
      q: 'What is your cancellation and refund policy?',
      a: 'Orders can be cancelled before the kitchen marks them as "Cooking & Assembling". Once food preparation has begun, orders cannot be cancelled due to food freshness safety. For any discrepancies or order issues, call our helpline immediately at +977 980-2672008.',
    },
  ];

  return (
    <section id="contact" className="scroll-mt-16 py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Directions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-orange-800">
                Visit & Contact
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                Find Daddy’s Kitchen in Butwal
              </h2>
              <p className="text-stone-600 text-sm mt-2">
                Drop in for a cozy café meal, pick up a takeaway parcel, or get fast delivery to your door.
              </p>
            </div>

            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <MapPin className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Address & Hub</strong>
                  <span>MFM6+PCH, 12 Teacher’s Path, Kalikanagar, Butwal 32907, Nepal</span>
                  <a
                    href="https://maps.app.goo.gl/CGW1LPR1W7BptjNh8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-orange-700 hover:text-orange-900 font-semibold mt-1"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <Phone className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Phone & WhatsApp Orders</strong>
                  <a href="tel:+9779802672008" className="hover:underline text-stone-800 font-mono">
                    +977 980-2672008
                  </a>
                  <span className="text-xs text-stone-500 block mt-0.5">
                    Order inquiries, bulk catering, and delivery hotline
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                <Clock className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Operating Hours (Asia/Kathmandu)</strong>
                  <span>Sunday – Thursday: 10:00 AM – 10:00 PM</span>
                  <span className="block">Friday – Saturday: 10:00 AM – 11:00 PM</span>
                  <span className="text-xs text-orange-800 font-semibold block mt-0.5">
                    Night delivery active across Butwal till 2:00 AM
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-orange-800">
                Customer Help & Policies
              </div>
              <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight mt-1">
                Frequently Asked Questions
              </h3>
            </div>

            <div className="divide-y divide-stone-200 bg-white rounded-2xl border border-stone-200 p-2 shadow-2xs">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="py-2.5 px-3">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-stone-900 hover:text-orange-800 transition-colors py-1"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-stone-600 leading-relaxed pb-1">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
