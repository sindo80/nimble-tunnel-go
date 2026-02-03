import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  user_id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

export function useTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets((data || []) as Ticket[]);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('خطا در دریافت تیکت‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const createTicket = async (subject: string, description: string, priority: TicketPriority = 'medium') => {
    if (!user) {
      toast.error('لطفاً ابتدا وارد شوید');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          user_id: user.id,
          subject,
          description,
          priority,
          ticket_number: 'TKT-TEMP', // Will be replaced by trigger
        })
        .select()
        .single();

      if (error) throw error;

      const ticket = data as Ticket;
      setTickets([ticket, ...tickets]);
      toast.success('تیکت با موفقیت ارسال شد');
      return ticket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('خطا در ارسال تیکت');
      return null;
    }
  };

  return {
    tickets,
    loading,
    createTicket,
    refetch: fetchTickets,
  };
}

export function useTicket(ticketId: string) {
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    if (!user || !ticketId) {
      setLoading(false);
      return;
    }

    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (ticketError) throw ticketError;
      setTicket(ticketData as Ticket);

      const { data: messagesData, error: messagesError } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages((messagesData || []) as TicketMessage[]);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('خطا در دریافت اطلاعات تیکت');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [user, ticketId]);

  const sendMessage = async (message: string) => {
    if (!user || !ticket) {
      toast.error('لطفاً ابتدا وارد شوید');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          message,
          is_admin_reply: false,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages([...messages, data as TicketMessage]);
      toast.success('پیام ارسال شد');
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('خطا در ارسال پیام');
      return false;
    }
  };

  return {
    ticket,
    messages,
    loading,
    sendMessage,
    refetch: fetchTicket,
  };
}
