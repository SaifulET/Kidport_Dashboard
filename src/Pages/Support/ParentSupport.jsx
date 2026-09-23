import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ChevronLeft, Clock, Paperclip, Plus, Send } from 'lucide-react';
import { apiGet, apiPost, getSessionUser } from '../../lib/api';
import { createSocket } from '../../lib/socket';

const mergeMessages = (current, incoming) => {
  const additions = Array.isArray(incoming) ? incoming : [incoming];
  const existing = new Set(current.map((message) => message.id));
  return [...current, ...additions.filter((message) => message?.id && !existing.has(message.id))];
};

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ParentSupport = () => {
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showNewForm, setShowNewForm] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [attachmentName, setAttachmentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const sessionUser = getSessionUser();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await apiGet('/support/messages?limit=100');
        setThread(response.data.thread);
        setMessages(response.data.messages || []);
      } catch (err) {
        setError(err.message || 'Unable to load support messages.');
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  useEffect(() => {
    const socket = createSocket();
    socket.on('support:message', ({ message }) => {
      setMessages((current) => mergeMessages(current, message));
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showNewForm]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      setError('');
      await apiPost('/support/issues', {
        title: title.trim(),
        description: description.trim(),
        urgency
      });
      const response = await apiPost('/support/messages', {
        text: `[New Ticket Opened]\n\nTitle: ${title.trim()}\nUrgency: ${urgency}\n\n${description.trim()}`
      });
      setMessages((current) => mergeMessages(current, response.data.sentMessage));
      setShowNewForm(false);
      setTitle('');
      setDescription('');
      setUrgency('medium');
      setAttachmentName('');
    } catch (err) {
      setError(err.message || 'Unable to create support ticket.');
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const text = chatMessage.trim();
    if (!text) return;

    try {
      setError('');
      setChatMessage('');
      const response = await apiPost('/support/messages', { text });
      setMessages((current) => mergeMessages(current, response.data.sentMessage));
    } catch (err) {
      setChatMessage(text);
      setError(err.message || 'Unable to send message.');
    }
  };

  const handleFileAttach = (event) => {
    const file = event.target.files?.[0];
    if (file) setAttachmentName(file.name);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-[#1e293b] flex justify-center items-start">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-[750px] relative">
        {showNewForm ? (
          <div className="flex flex-col h-full bg-[#fafbfc]">
            <div className="bg-[#bdf0f1]/60 px-6 py-4 flex items-center gap-4 border-b border-[#bdf0f1]/30 shrink-0">
              <button
                onClick={() => setShowNewForm(false)}
                className="text-[#1a365d] hover:text-[#1aa3b9] p-1.5 rounded-full hover:bg-white/50 transition-all shrink-0"
                type="button"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h3 className="text-[15px] font-bold text-[#0f172a] leading-tight">New Support Ticket</h3>
                <p className="text-[11px] text-[#64748b] font-medium mt-0.5">Send the support team the details</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {error && <div className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
              <label className="block">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Subject</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm outline-none focus:border-[#06b6d4]"
                  placeholder="What can we help with?"
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Details</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="mt-2 h-40 w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm outline-none resize-none focus:border-[#06b6d4]"
                  placeholder="Describe what happened..."
                />
              </label>

              <label className="block">
                <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Urgency</span>
                <select
                  value={urgency}
                  onChange={(event) => setUrgency(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm outline-none focus:border-[#06b6d4]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-3 text-sm text-[#64748b] cursor-pointer">
                <Paperclip size={16} />
                <span className="truncate">{attachmentName || 'Attach a file name for reference'}</span>
                <input type="file" className="hidden" onChange={handleFileAttach} />
              </label>

              <button type="submit" className="w-full h-12 rounded-xl bg-[#06b6d4] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#0891b2] transition-colors">
                Create Ticket
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full bg-[#fafbfc]">
            <div className="bg-[#bdf0f1]/60 px-6 py-4 flex items-center justify-between gap-4 border-b border-[#bdf0f1]/30">
              <div>
                <h3 className="text-[15px] font-bold text-[#0f172a] leading-tight">{thread?.title || 'Support Team'}</h3>
                <p className="text-[11px] text-[#64748b] font-medium mt-0.5">{thread?.subtitle || 'Usually replies within minutes'}</p>
              </div>
              <button
                onClick={() => setShowNewForm(true)}
                className="w-10 h-10 rounded-full bg-white text-[#06b6d4] border border-[#bdf0f1] flex items-center justify-center shadow-sm hover:bg-[#ecfeff]"
                type="button"
                title="New ticket"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="bg-white border-b border-gray-100 px-6 py-2.5 flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-500">Signed in as {sessionUser?.fullName || 'Parent'}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                <Clock size={12} />
                Live
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs font-bold uppercase tracking-wider text-gray-400">Loading</div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                  <AlertCircle size={32} className="mb-2 text-gray-300" />
                  <p className="text-xs font-bold uppercase tracking-wider">No messages yet</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isParent = message.sender === 'user' || message.sender === 'parent';
                  return (
                    <div key={message.id} className={`flex flex-col ${isParent ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                        isParent
                          ? 'bg-[#06b6d4] text-white rounded-tr-none'
                          : 'bg-white text-[#1e293b] rounded-tl-none border border-gray-100'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      </div>
                      <span className="text-[9px] font-semibold text-[#94a3b8] mt-1 px-1.5 uppercase tracking-wide">
                        {formatTime(message.sentAt || message.time)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && <div className="mx-4 mb-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

            <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-100 p-4 flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                className="flex-1 bg-[#f8fafc] border border-transparent focus:border-gray-200 focus:bg-white rounded-full px-5 py-3 text-[13px] font-medium text-[#1e293b] outline-none transition-all placeholder:text-[#94a3b8]"
              />
              <button type="submit" className="w-11 h-11 rounded-full bg-[#06b6d4] hover:bg-[#0891b2] text-white flex items-center justify-center shadow-md transition-colors shrink-0">
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentSupport;
