import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, ChevronLeft, AlertCircle, Clock, CheckCircle2, ChevronRight, MessageSquare, Plus } from 'lucide-react';

const DEFAULT_TICKETS = [
  {
    id: "TKT-391",
    title: "Milestone chart loading issue",
    description: "I tried to view Emma's milestone chart but it shows an error screen.",
    urgency: "Medium",
    attachment: "screenshot_error_milestone.png",
    status: "Active",
    parentName: "Sarah Johnson",
    parentEmail: "parent@kidport.internal",
    parentInitials: "SJ",
    lastActivity: "2 mins ago",
    messages: [
      {
        id: 1,
        sender: "agent",
        senderName: "Maya",
        text: "Hi Sarah! 👋 I'm Maya from KIDport support. How can I help you today?",
        time: "10:30 AM"
      },
      {
        id: 2,
        sender: "parent",
        senderName: "Sarah",
        text: "hi i have an issue",
        time: "09:58 AM"
      },
      {
        id: 3,
        sender: "agent",
        senderName: "Maya",
        text: "Thanks for reaching out! Let me help you with that. Could you provide more details?",
        time: "09:58 AM"
      },
      {
        id: 4,
        sender: "parent",
        senderName: "Sarah",
        text: "okay let me explain the whole things",
        time: "09:59 AM"
      },
      {
        id: 5,
        sender: "agent",
        senderName: "Maya",
        text: "Thanks for reaching out! Let me help you with that. Could you provide more details?",
        time: "09:59 AM"
      }
    ]
  },
  {
    id: "TKT-184",
    title: "Billing discrepancy on July Invoice",
    description: "My July invoice shows an extra charge for extended care that we did not use.",
    urgency: "High",
    attachment: "invoice_discrepancy_july.pdf",
    status: "Active",
    parentName: "Emily Smith",
    parentEmail: "parent@kidport.internal",
    parentInitials: "ES",
    lastActivity: "Yesterday",
    messages: [
      {
        id: 1,
        sender: "parent",
        senderName: "Emily",
        text: "Hello, I noticed a duplicate extended care fee on my July invoice. Can this be refunded?",
        time: "Yesterday, 04:12 PM"
      },
      {
        id: 2,
        sender: "agent",
        senderName: "Maya",
        text: "Hi Emily, let me look into your billing details. Yes, I see the duplicate charge. I have initiated a refund of $45. It should show up on your card within 3-5 business days.",
        time: "Yesterday, 04:45 PM"
      },
      {
        id: 3,
        sender: "parent",
        senderName: "Emily",
        text: "Thank you for the quick help!",
        time: "Yesterday, 04:48 PM"
      }
    ]
  },
  {
    id: "TKT-602",
    title: "Allergy documentation update",
    description: "Updated dietary restrictions regarding tree nuts.",
    urgency: "High",
    attachment: "medical_report_cashews.pdf",
    status: "Active",
    parentName: "Jennifer Brown",
    parentEmail: "parent@kidport.internal",
    parentInitials: "JB",
    lastActivity: "1 hour ago",
    messages: [
      {
        id: 1,
        sender: "parent",
        senderName: "Jennifer",
        text: "URGENT: Noah was recently diagnosed with a cashew allergy. I have uploaded the medical report. Can you verify it is updated in his profile?",
        time: "01:10 PM"
      },
      {
        id: 2,
        sender: "agent",
        senderName: "Support Team",
        text: "Hi Jennifer, we have received the update and marked it on Noah's profile badge. His classroom teacher has also been notified immediately.",
        time: "01:30 PM"
      },
      {
        id: 3,
        sender: "parent",
        senderName: "Jennifer",
        text: "Thank you, that is a huge relief.",
        time: "01:35 PM"
      }
    ]
  },
  {
    id: "TKT-824",
    title: "Change pick-up authorization",
    description: "Need to authorize grandmother Maria Martinez to pick up Olivia this Friday.",
    urgency: "Low",
    status: "Resolved",
    parentName: "Carlos Martinez",
    parentEmail: "parent@kidport.internal",
    parentInitials: "CM",
    lastActivity: "2 days ago",
    messages: [
      {
        id: 1,
        sender: "parent",
        senderName: "Carlos",
        text: "Hi, I need to add my mother Maria Martinez to the pick-up list for Olivia this Friday. She will bring her ID.",
        time: "2 days ago"
      },
      {
        id: 2,
        sender: "agent",
        senderName: "Maya",
        text: "Hello Carlos, I have updated Olivia's pick-up authorization record. Please ensure she brings a valid photo ID. Thanks!",
        time: "2 days ago"
      },
      {
        id: 3,
        sender: "parent",
        senderName: "Carlos",
        text: "Perfect, thank you!",
        time: "2 days ago"
      }
    ]
  }
];

const ParentSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [chatMessage, setChatMessage] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  const [attachmentName, setAttachmentName] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("seymour_support_tickets");
    if (saved) {
      setTickets(JSON.parse(saved));
    } else {
      localStorage.setItem("seymour_support_tickets", JSON.stringify(DEFAULT_TICKETS));
      setTickets(DEFAULT_TICKETS);
    }
  }, []);

  // Update whenever tickets change
  const saveTickets = (updated) => {
    setTickets(updated);
    localStorage.setItem("seymour_support_tickets", JSON.stringify(updated));
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTicketId, tickets]);

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const newTicket = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      title,
      description,
      urgency,
      attachment: attachmentName || null,
      status: "Active",
      parentName: "Sarah Johnson",
      parentEmail: "parent@kidport.internal",
      parentInitials: "SJ",
      lastActivity: "Just now",
      messages: [
        {
          id: 1,
          sender: "parent",
          senderName: "Sarah",
          text: `[New Ticket Opened] Urgency: ${urgency}\n\nTitle: ${title}\nDescription: ${description}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 2,
          sender: "agent",
          senderName: "Support Team",
          text: "Thanks for reporting your issue. A support agent will review this shortly.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    const updated = [newTicket, ...tickets];
    saveTickets(updated);
    setActiveTicketId(newTicket.id);
    setShowNewForm(false);
    // Reset form
    setTitle("");
    setDescription("");
    setUrgency("Medium");
    setAttachmentName("");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeTicketId) return;

    const newMessage = {
      id: Date.now(),
      sender: "parent",
      senderName: "Sarah",
      text: chatMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = tickets.map(t => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          lastActivity: "Just now",
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    });

    saveTickets(updated);
    setChatMessage("");
  };

  const handleFileAttach = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachmentName(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-[#1e293b] flex justify-center items-start">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[750px] relative">
        
        {/* Render Chat view if a ticket is active */}
        {activeTicket ? (
          <div className="flex flex-col h-full bg-[#fafbfc]">
            {/* Header matching screenshot design */}
            <div className="bg-[#bdf0f1]/60 px-6 py-4 flex items-center gap-4 border-b border-[#bdf0f1]/30">
              <button 
                onClick={() => setActiveTicketId(null)}
                className="text-[#1a365d] hover:text-[#1aa3b9] p-1.5 rounded-full hover:bg-white/50 transition-all shrink-0"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="w-11 h-11 bg-white border border-gray-200 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop" 
                  alt="Agent avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div>
                <h3 className="text-[15px] font-bold text-[#0f172a] leading-tight">Support Team</h3>
                <p className="text-[11px] text-[#64748b] font-medium mt-0.5">Usually replies within minutes</p>
              </div>
            </div>

            {/* Ticket Subject banner */}
            <div className="bg-white border-b border-gray-100 px-6 py-2.5 flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-500">Ticket: {activeTicket.title}</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                activeTicket.urgency === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                activeTicket.urgency === 'Medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                'bg-gray-50 text-gray-500 border border-gray-200'
              }`}>
                {activeTicket.urgency}
              </span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="flex justify-center">
                <span className="bg-gray-100 text-[#64748b] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Today
                </span>
              </div>

              {activeTicket.messages.map((msg) => {
                const isParent = msg.sender === 'parent';
                return (
                  <div key={msg.id} className={`flex flex-col ${isParent ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                      isParent 
                        ? 'bg-[#06b6d4] text-white rounded-tr-none' 
                        : 'bg-white text-[#1e293b] rounded-tl-none border border-gray-100'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className="text-[9px] font-semibold text-[#94a3b8] mt-1 px-1.5 uppercase tracking-wide">
                      {msg.time}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-100 p-4 flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-transparent focus:border-gray-200 focus:bg-white rounded-full px-5 py-3 pr-10 text-[13px] font-medium text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8]"
                />
                <button 
                  type="button" 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#06b6d4] transition-colors"
                  title="Attach File"
                >
                  <Paperclip size={16} />
                </button>
              </div>
              <button 
                type="submit"
                className="w-11 h-11 rounded-full bg-[#06b6d4] hover:bg-[#0891b2] text-white flex items-center justify-center shadow-md transition-colors shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        ) : showNewForm ? (
          /* New Ticket Form view matching screenshot */
          <div className="flex flex-col h-full bg-[#fafbfc]">
            {/* Header */}
            <div className="bg-[#bdf0f1]/60 px-6 py-4 flex items-center gap-4 border-b border-[#bdf0f1]/30 shrink-0">
              <button 
                onClick={() => setShowNewForm(false)}
                className="text-[#1a365d] hover:text-[#1aa3b9] p-1.5 rounded-full hover:bg-white/50 transition-all shrink-0"
              >
                <ChevronLeft size={20} />
              </button>
              <h3 className="text-[15px] font-bold text-[#0f172a] leading-tight">Submit Issue Report</h3>
            </div>

            {/* Form Scroll Container */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Issue Title card container */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
                <label className="block text-[12px] font-bold text-[#1e293b]">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="Brief description of the issue..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-transparent focus:border-gray-200 focus:bg-white rounded-xl px-4 py-3 text-[13px] font-medium text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8]"
                />
              </div>

              {/* Detailed Description card container */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2">
                <label className="block text-[12px] font-bold text-[#1e293b]">Detailed Description</label>
                <textarea
                  required
                  placeholder="Please describe what happened, what you expected..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 bg-[#f8fafc] border border-transparent focus:border-gray-200 focus:bg-white rounded-xl px-4 py-3 text-[13px] font-medium text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8] resize-none"
                />
                <p className="text-[10px] text-[#94a3b8] uppercase font-semibold tracking-wide">
                  The more details you provide, the faster we can help!
                </p>
              </div>

              {/* Attachments card container */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
                <label className="block text-[12px] font-bold text-[#1e293b]">Attachments (Optional)</label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={handleFileAttach}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                  />
                  <div className="w-full border-2 border-dashed border-[#e2e8f0] hover:border-[#06b6d4] rounded-2xl py-5 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white">
                    <Paperclip size={18} className="text-gray-400" />
                    <span className="text-[12px] font-semibold text-[#475569]">
                      {attachmentName || "Attach File"}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-[#94a3b8] uppercase font-semibold tracking-wide">
                  Screenshots and videos help us understand the issue better
                </p>
              </div>

              {/* Urgency selector card container */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
                <label className="block text-[12px] font-bold text-[#1e293b]">How urgent is this issue?</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Low", "Medium", "High"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        urgency === level 
                          ? 'bg-[#bdf0f1]/30 border-[#06b6d4] text-[#1aa3b9]' 
                          : 'bg-white border-gray-200 text-[#475569] hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#06b6d4] hover:bg-[#0891b2] text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
              >
                Submit Issue Report
              </button>
            </form>
          </div>
        ) : (
          /* Active Chats & Tickets Directory List */
          <div className="flex flex-col h-full bg-[#fafbfc]">
            {/* Header */}
            <div className="bg-[#bdf0f1]/60 px-6 py-5 flex justify-between items-center border-b border-[#bdf0f1]/30 shrink-0">
              <div>
                <h3 className="text-[16px] font-bold text-[#0f172a]">KIDPort Support</h3>
                <p className="text-[11px] text-[#64748b] font-medium mt-0.5">Need help? Talk to our admin staff</p>
              </div>
              <button
                onClick={() => setShowNewForm(true)}
                className="bg-[#06b6d4] hover:bg-[#0891b2] text-white p-2.5 rounded-full shadow-md transition-all shrink-0 flex items-center gap-1.5"
                title="New Issue Report"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Tickets List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {tickets.length > 0 ? (
                tickets.map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setActiveTicketId(t.id)}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#06b6d4] shrink-0 font-bold text-sm">
                        <MessageSquare size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-[13px] font-bold text-[#1e293b] truncate leading-tight">{t.title}</h4>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                            t.urgency === 'High' ? 'bg-red-50 text-red-500' :
                            t.urgency === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {t.urgency}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748b] truncate leading-tight">
                          {t.messages[t.messages.length - 1]?.text || t.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 shrink-0" />
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                  <MessageSquare size={36} className="mb-3 text-gray-300" />
                  <p className="text-xs font-bold uppercase tracking-widest">No Active Tickets</p>
                  <p className="text-[11px] text-gray-400 max-w-xs mt-1">
                    Click the plus button in the top right to submit an issue report and start chatting.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ParentSupport;
