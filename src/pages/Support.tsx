import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Plus, Clock, CheckCircle, AlertCircle, XCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTickets, TicketStatus, TicketPriority } from '@/hooks/useTickets';
import { format } from 'date-fns-jalali';

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

export default function SupportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, loading, createTicket } = useTickets();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium' as TicketPriority,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.description) return;

    setSubmitting(true);
    const ticket = await createTicket(formData.subject, formData.description, formData.priority);
    setSubmitting(false);

    if (ticket) {
      setDialogOpen(false);
      setFormData({ subject: '', description: '', priority: 'medium' });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-3">پشتیبانی تیکت</h1>
            <p className="text-muted-foreground mb-6">برای ارسال تیکت و پیگیری درخواست‌های خود، وارد حساب کاربری شوید</p>
            <Button onClick={() => navigate('/auth')} size="lg">
              ورود به حساب کاربری
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">پشتیبانی تیکت</h1>
              <p className="text-muted-foreground mt-1">تیکت‌های خود را مشاهده و پیگیری کنید</p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl shadow-lg">
                <Plus className="h-4 w-4 ml-2" />
                ارسال تیکت جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>ارسال تیکت جدید</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">موضوع</Label>
                  <Input
                    id="subject"
                    placeholder="موضوع تیکت را وارد کنید"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">اولویت</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: TicketPriority) => setFormData({ ...formData, priority: value })}
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

                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات</Label>
                  <Textarea
                    id="description"
                    placeholder="مشکل یا درخواست خود را شرح دهید..."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'در حال ارسال...' : 'ارسال تیکت'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">هنوز تیکتی ندارید</h3>
              <p className="text-muted-foreground mb-6">برای شروع، یک تیکت جدید ارسال کنید</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 ml-2" />
                ارسال تیکت جدید
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => {
              const status = statusConfig[ticket.status];
              const priority = priorityConfig[ticket.priority];
              const StatusIcon = status.icon;

              return (
                <Link key={ticket.id} to={`/support/${ticket.id}`}>
                  <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={`${status.color} text-white text-xs`}>
                              <StatusIcon className="h-3 w-3 ml-1" />
                              {status.label}
                            </Badge>
                            <Badge className={`${priority.color} text-xs`}>
                              {priority.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {ticket.ticket_number}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg line-clamp-1">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {ticket.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-3">
                            {format(new Date(ticket.created_at), 'yyyy/MM/dd - HH:mm')}
                          </p>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-muted-foreground shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
