import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, CheckCircle, AlertCircle, XCircle, ChevronLeft, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns-jalali';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

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

export default function AdminTickets() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['admin-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Ticket[];
    },
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">مدیریت تیکت‌ها</h1>
            <p className="text-muted-foreground">مشاهده و پاسخ به تیکت‌های کاربران</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{ticketStats.total}</p>
              <p className="text-sm text-muted-foreground">کل تیکت‌ها</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{ticketStats.open}</p>
              <p className="text-sm text-muted-foreground">باز</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{ticketStats.in_progress}</p>
              <p className="text-sm text-muted-foreground">در حال بررسی</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{ticketStats.resolved}</p>
              <p className="text-sm text-muted-foreground">حل شده</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-500/10 to-gray-500/5">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-600">{ticketStats.closed}</p>
              <p className="text-sm text-muted-foreground">بسته</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="جستجو در تیکت‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 ml-2" />
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="open">باز</SelectItem>
                    <SelectItem value="in_progress">در حال بررسی</SelectItem>
                    <SelectItem value="resolved">حل شده</SelectItem>
                    <SelectItem value="closed">بسته</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="اولویت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه اولویت‌ها</SelectItem>
                    <SelectItem value="urgent">فوری</SelectItem>
                    <SelectItem value="high">زیاد</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="low">کم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">تیکتی یافت نشد</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'فیلترها را تغییر دهید'
                  : 'هنوز تیکتی ثبت نشده است'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const status = statusConfig[ticket.status];
              const priority = priorityConfig[ticket.priority];
              const StatusIcon = status.icon;

              return (
                <Link key={ticket.id} to={`/admin/tickets/${ticket.id}`}>
                  <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge className={`${status.color} text-white text-xs`}>
                              <StatusIcon className="h-3 w-3 ml-1" />
                              {status.label}
                            </Badge>
                            <Badge className={`${priority.color} text-xs`}>
                              {priority.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                              {ticket.ticket_number}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg line-clamp-1">{ticket.subject}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                            <span>ایجاد: {format(new Date(ticket.created_at), 'yyyy/MM/dd - HH:mm')}</span>
                            <span>به‌روزرسانی: {format(new Date(ticket.updated_at), 'yyyy/MM/dd - HH:mm')}</span>
                          </div>
                        </div>
                        <ChevronLeft className="h-5 w-5 text-muted-foreground shrink-0 mt-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
