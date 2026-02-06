import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle, AlertCircle, XCircle, Send, User, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns-jalali';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Ticket {
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

interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

const statusConfig: Record<TicketStatus, { label: string; color: string; icon: typeof Clock }> = {
  open: { label: 'باز', color: 'bg-blue-500', icon: Clock },
  in_progress: { label: 'در حال بررسی', color: 'bg-amber-500', icon: AlertCircle },
  resolved: { label: 'حل شده', color: 'bg-emerald-500', icon: CheckCircle },
  closed: { label: 'بسته', color: 'bg-gray-500', icon: XCircle },
};

const priorityConfig: Record<TicketPriority, { label: string; color: string }> = {
  low: { label: 'کم', color: 'bg-gray-100 text-gray-700' },
  medium: { label: 'متوسط', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'زیاد', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'فوری', color: 'bg-red-100 text-red-700' },
};

export default function AdminTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');

  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ['admin-ticket', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Ticket;
    },
    enabled: !!id,
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['admin-ticket-messages', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []) as TicketMessage[];
    },
    enabled: !!id,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!user || !ticket) throw new Error('Missing data');

      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: ticket.id,
          user_id: user.id,
          message,
          is_admin_reply: true,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ticket-messages', id] });
      setNewMessage('');
      toast.success('پیام ارسال شد');
    },
    onError: () => {
      toast.error('خطا در ارسال پیام');
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: TicketStatus) => {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      toast.success('وضعیت تیکت به‌روزرسانی شد');
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی وضعیت');
    },
  });

  const updatePriorityMutation = useMutation({
    mutationFn: async (newPriority: TicketPriority) => {
      const { error } = await supabase
        .from('tickets')
        .update({ priority: newPriority })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-tickets'] });
      toast.success('اولویت تیکت به‌روزرسانی شد');
    },
    onError: () => {
      toast.error('خطا در به‌روزرسانی اولویت');
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  const loading = ticketLoading || messagesLoading;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!ticket) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">تیکت یافت نشد</h1>
          <Button onClick={() => navigate('/admin/tickets')}>بازگشت به لیست تیکت‌ها</Button>
        </div>
      </AdminLayout>
    );
  }

  const status = statusConfig[ticket.status];
  const priority = priorityConfig[ticket.priority];
  const StatusIcon = status.icon;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/admin/tickets')}>
          <ArrowRight className="h-4 w-4 ml-2" />
          بازگشت به لیست تیکت‌ها
        </Button>

        {/* Ticket Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${status.color} text-white`}>
                <StatusIcon className="h-3 w-3 ml-1" />
                {status.label}
              </Badge>
              <Badge className={priority.color}>
                اولویت: {priority.label}
              </Badge>
              <span className="text-sm text-muted-foreground font-mono">
                {ticket.ticket_number}
              </span>
            </div>
            <CardTitle className="text-xl">{ticket.subject}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{ticket.description}</p>
            <Separator className="my-4" />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>تاریخ ایجاد: {format(new Date(ticket.created_at), 'yyyy/MM/dd - HH:mm')}</span>
              <span>آخرین به‌روزرسانی: {format(new Date(ticket.updated_at), 'yyyy/MM/dd - HH:mm')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Admin Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">تنظیمات تیکت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>وضعیت</Label>
                <Select
                  value={ticket.status}
                  onValueChange={(value: TicketStatus) => updateStatusMutation.mutate(value)}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">باز</SelectItem>
                    <SelectItem value="in_progress">در حال بررسی</SelectItem>
                    <SelectItem value="resolved">حل شده</SelectItem>
                    <SelectItem value="closed">بسته</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>اولویت</Label>
                <Select
                  value={ticket.priority}
                  onValueChange={(value: TicketPriority) => updatePriorityMutation.mutate(value)}
                  disabled={updatePriorityMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">کم</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="high">زیاد</SelectItem>
                    <SelectItem value="urgent">فوری</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">گفتگو</h3>
          
          {messages.length === 0 ? (
            <Card className="py-10 text-center">
              <p className="text-muted-foreground">هنوز پیامی ارسال نشده است</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.is_admin_reply ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    message.is_admin_reply ? "bg-primary text-white" : "bg-muted"
                  )}>
                    {message.is_admin_reply ? (
                      <Shield className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div className={cn(
                    "flex-1 max-w-[80%]",
                    message.is_admin_reply ? "flex flex-col items-end" : ""
                  )}>
                    <div className={cn(
                      "rounded-2xl p-4",
                      message.is_admin_reply 
                        ? "bg-primary/10 rounded-tl-none" 
                        : "bg-muted rounded-tr-none"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.is_admin_reply ? 'پشتیبانی' : 'کاربر'}
                        </span>
                      </div>
                      <p className="leading-relaxed">{message.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">
                      {format(new Date(message.created_at), 'yyyy/MM/dd - HH:mm')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSendMessage}>
              <Textarea
                placeholder="پاسخ خود را بنویسید..."
                rows={4}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="mb-4"
              />
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={sendMessageMutation.isPending || !newMessage.trim()}
                >
                  <Send className="h-4 w-4 ml-2" />
                  {sendMessageMutation.isPending ? 'در حال ارسال...' : 'ارسال پاسخ'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
