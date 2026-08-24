import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare, AlertCircle, Clock, CheckCircle2, ChevronRight, Inbox, Mail, ShieldAlert, Paperclip, Trash2, X } from 'lucide-react';

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

const DaycareSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [activeAttachment, setActiveAttachment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchTickets = () => {
      const saved = localStorage.getItem("seymour_support_tickets");
      if (saved) {
        setTickets(JSON.parse(saved));
      } else {
        localStorage.setItem("seymour_support_tickets", JSON.stringify(DEFAULT_TICKETS));
        setTickets(DEFAULT_TICKETS);
      }
    };

    fetchTickets();
    // Poll every 2 seconds to check if parent sent a new message
    const interval = setInterval(fetchTickets, 2000);
    return () => clearInterval(interval);
  }, []);

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

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicketId) return;

    const newReply = {
      id: Date.now(),
      sender: "agent",
      senderName: "Maya",
      text: replyMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = tickets.map(t => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          lastActivity: "Just now",
          messages: [...t.messages, newReply]
        };
      }
      return t;
    });

    saveTickets(updated);
    setReplyMessage("");
  };

  const handleResolveTicket = () => {
    if (!activeTicketId) return;
    const updated = tickets.map(t => {
      if (t.id === activeTicketId) {
        return { ...t, status: t.status === 'Resolved' ? 'Active' : 'Resolved' };
      }
      return t;
    });
    saveTickets(updated);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] p-6 lg:p-10 font-sans text-[#1e293b]">
      <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500 h-[calc(100vh-80px)] flex flex-col">
        
        {/* Header */}
        <div className="mb-8 shrink-0">
          <h1 className="text-[26px] font-bold text-[#0f172a] mb-1 leading-tight">Support Desk</h1>
          <p className="text-[13px] text-[#64748b]">Manage and reply to parent issue reports and questions</p>
        </div>

        {/* Workspace Grid */}
        <div className="flex-1 flex gap-6 min-h-0 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-6">
          
          {/* Left Column: Tickets Queue */}
          <div className="w-[320px] lg:w-[380px] border-r border-gray-100 flex flex-col shrink-0">
            <div className="bg-[#f8fafc] px-6 py-4 border-b border-gray-100">
              <h3 className="text-[12px] font-bold text-[#0f172a] uppercase tracking-wider">Active Tickets</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {tickets.length > 0 ? (
                tickets.map((t) => {
                  const isActive = t.id === activeTicketId;
                  const lastMsg = t.messages[t.messages.length - 1];
                  return (
                    <div 
                      key={t.id}
                      onClick={() => setActiveTicketId(t.id)}
                      className={`p-5 cursor-pointer transition-colors text-left ${
                        isActive 
                          ? 'bg-[#bdf0f1]/20 border-l-4 border-l-[#06b6d4]' 
                          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="text-[11px] font-bold text-gray-400 font-mono shrink-0">{t.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                          t.urgency === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                          t.urgency === 'Medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                          'bg-gray-50 text-gray-500 border border-gray-200'
                        }`}>
                          {t.urgency}
                        </span>
                      </div>

                      <h4 className="text-[13px] font-bold text-[#1e293b] leading-tight mb-1 truncate">{t.title}</h4>
                      <p className="text-[12px] text-gray-500 line-clamp-1 mb-2">{lastMsg ? lastMsg.text : t.description}</p>
                      
                      <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold uppercase">
                        <span>{t.parentName}</span>
                        <span>{t.lastActivity}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                  <Inbox size={32} className="mb-2 text-gray-300" />
                  <p className="text-xs font-bold uppercase tracking-wider">Queue Empty</p>
                  <p className="text-[11px] text-gray-400 max-w-xs mt-1">
                    No active support requests.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Chat Workspace */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#fafbfc]">
            {activeTicket ? (
              <div className="flex-1 flex flex-col min-h-0">
                
                {/* Active Ticket Header */}
                <div className="bg-white border-b border-gray-100 px-8 py-5 flex justify-between items-center shrink-0">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0f172a] mb-1">{activeTicket.title}</h3>
                    <p className="text-[12px] text-[#64748b] flex items-center gap-1.5 font-medium">
                      <span>Submitted by: <strong>{activeTicket.parentName}</strong> ({activeTicket.parentEmail})</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleResolveTicket}
                      className={`text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-colors border ${
                        activeTicket.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {activeTicket.status === 'Resolved' ? 'Resolved' : 'Mark Resolved'}
                    </button>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                      title="Delete Ticket"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                  
                  {/* Original Issue Details Card */}
                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-3 mb-6 text-left">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Original Issue Report</span>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#1e293b]">{activeTicket.title}</h4>
                      <p className="text-[13px] text-[#64748b] leading-relaxed mt-1">{activeTicket.description}</p>
                    </div>
                    
                    {(activeTicket.urgency || activeTicket.attachment) && (
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 pt-3 border-t border-gray-100/60 mt-1">
                        <div>
                          <span className="text-gray-400">Urgency:</span>{' '}
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            activeTicket.urgency === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                            activeTicket.urgency === 'Medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                            'bg-gray-50 text-gray-500 border border-gray-200'
                          }`}>
                            {activeTicket.urgency}
                          </span>
                        </div>
                        
                        {activeTicket.attachment && (
                          <button 
                            onClick={() => setActiveAttachment(activeTicket.attachment)}
                            className="flex items-center gap-1.5 text-[#06b6d4] hover:text-[#0891b2] font-semibold hover:underline"
                          >
                            <Paperclip size={13} />
                            <span>{activeTicket.attachment}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {activeTicket.messages.map((msg) => {
                    const isAgent = msg.sender === 'agent';
                    return (
                      <div key={msg.id} className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                          isAgent 
                            ? 'bg-[#06b6d4] text-white rounded-tr-none' 
                            : 'bg-white text-[#1e293b] rounded-tl-none border border-gray-100'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <span className="text-[9px] font-semibold text-[#94a3b8] mt-1 px-1.5 uppercase tracking-wide">
                          {msg.senderName} &bull; {msg.time}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="bg-white border-t border-gray-100 p-4 flex gap-4 shrink-0">
                  <textarea
                    placeholder="Type your response to the parent..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 h-[56px] border border-gray-100 focus:border-gray-200 rounded-xl px-4 py-3 text-[13px] font-medium text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8] resize-none bg-[#f8fafc] focus:bg-white"
                  />
                  <button 
                    type="submit"
                    className="bg-[#06b6d4] hover:bg-[#0891b2] text-white font-semibold text-[11px] uppercase tracking-wider px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 self-center h-[46px]"
                  >
                    <Send size={14} />
                    Send Reply
                  </button>
                </form>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#94a3b8] p-8 text-center bg-white">
                <Inbox size={42} className="text-gray-200 mb-3" />
                <h4 className="text-[14px] font-bold uppercase tracking-widest text-gray-400">Select a Conversation</h4>
                <p className="text-xs text-gray-400 max-w-sm mt-1">
                  Choose a ticket from the sidebar queue to read messages and reply to parents.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Attachment Preview Modal */}
      {activeAttachment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Paperclip size={16} className="text-[#06b6d4]" />
                <span className="text-sm font-bold text-gray-700 truncate max-w-xs">{activeAttachment}</span>
              </div>
              <button 
                onClick={() => setActiveAttachment(null)}
                className="text-gray-400 hover:text-gray-655 p-1 rounded-full hover:bg-gray-200 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[300px]">
              {activeAttachment.endsWith('.png') || activeAttachment.endsWith('.jpg') || activeAttachment.endsWith('.jpeg') ? (
                /* Mock Image Screenshot View */
                <div className="w-full space-y-4">
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-gray-50 p-2">
                    <div className="bg-white rounded-lg border border-gray-100 p-4 space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">KIDPort App Mock Screenshot</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 py-4 flex flex-col items-center justify-center text-center">
                        <ShieldAlert size={40} className="text-red-500 animate-bounce" />
                        <h5 className="font-bold text-sm text-gray-800">Error 500: Failed to fetch chart data</h5>
                        <p className="text-xs text-gray-500 max-w-xs">
                          An unexpected error occurred while compiling the child milestone progress logs. Please contact support.
                        </p>
                      </div>
                      
                      <div className="h-4 bg-[#bdf0f1]/20 rounded-full w-3/4 mx-auto animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center font-semibold uppercase">
                    MOCK SCREENSHOT: {activeAttachment}
                  </p>
                </div>
              ) : (
                /* Mock Document View */
                <div className="w-full space-y-4">
                  <div className="border border-gray-200 rounded-xl bg-white p-6 shadow-sm font-serif text-[#1e293b] leading-relaxed text-xs space-y-3 relative before:content-[''] before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-red-250">
                    <div className="pl-6 border-b border-gray-100 pb-3 font-sans font-bold text-[10px] text-gray-400 uppercase flex justify-between">
                      <span>REPORT DOCUMENT</span>
                      <span>DATE: 08/17/2026</span>
                    </div>
                    <div className="pl-6 space-y-2 text-[13px]">
                      <p className="font-bold">Subject: support_ticket_attachment_payload</p>
                      <p>This is a simulated document view representing the uploaded file payload: <span className="font-mono bg-gray-50 px-1 py-0.5 rounded text-xs text-[#06b6d4]">{activeAttachment}</span>.</p>
                      <p>The system stores medical clearances, authorization forms, and bill duplicates inside the attachment repository for parent queries.</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center font-semibold uppercase">
                    MOCK DOCUMENT: {activeAttachment}
                  </p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => alert("File downloaded successfully (simulated)!")}
                className="px-4 py-2 bg-[#06b6d4] hover:bg-[#0891b2] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Download File
              </button>
              <button 
                onClick={() => setActiveAttachment(null)}
                className="px-4 py-2 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl p-6 space-y-5 animate-in zoom-in duration-200 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-[16px] font-bold text-gray-900">Delete Support Ticket</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Are you sure you want to delete this ticket? All messages and attachments associated with it will be permanently deleted.
              </p>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const updated = tickets.filter(t => t.id !== activeTicketId);
                  saveTickets(updated);
                  setActiveTicketId(null);
                  setShowDeleteModal(false);
                }}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DaycareSupport;
