import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle, AlertCircle, XCircle, Send, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
import { useTicket, TicketStatus, TicketPriority } from '@/hooks/useTickets';
import { format } from 'date-fns-jalali';
import { cn } from '@/lib/utils';

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

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ticket, messages, loading, sendMessage } = useTicket(id || '');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
    setSending(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-40 bg-muted rounded-xl" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!ticket) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">تیکت یافت نشد</h1>
          <Button onClick={() => navigate('/support')}>بازگشت به پشتیبانی</Button>
        </div>
      </Layout>
    );
  }

  const status = statusConfig[ticket.status];
  const priority = priorityConfig[ticket.priority];
  const StatusIcon = status.icon;
  const isOpen = ticket.status === 'open' || ticket.status === 'in_progress';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/support')} className="mb-6">
          <ArrowRight className="h-4 w-4 ml-2" />
          بازگشت به لیست تیکت‌ها
        </Button>

        {/* Ticket Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className={`${status.color} text-white`}>
                <StatusIcon className="h-3 w-3 ml-1" />
                {status.label}
              </Badge>
              <Badge className={priority.color}>
                اولویت: {priority.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                شماره تیکت: {ticket.ticket_number}
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

        {/* Messages */}
        <div className="space-y-4 mb-6">
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
                    message.is_admin_reply ? "flex-row" : "flex-row-reverse"
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
                    message.is_admin_reply ? "" : "flex flex-col items-end"
                  )}>
                    <div className={cn(
                      "rounded-2xl p-4",
                      message.is_admin_reply 
                        ? "bg-primary/10 rounded-tr-none" 
                        : "bg-muted rounded-tl-none"
                    )}>
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
        {isOpen ? (
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSendMessage}>
                <Textarea
                  placeholder="پیام خود را بنویسید..."
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="mb-4"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={sending || !newMessage.trim()}>
                    <Send className="h-4 w-4 ml-2" />
                    {sending ? 'در حال ارسال...' : 'ارسال پیام'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-muted/50">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">این تیکت بسته شده و امکان ارسال پیام وجود ندارد</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
