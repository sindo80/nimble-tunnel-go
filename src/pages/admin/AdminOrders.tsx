import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderStatus } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns-jalali";

const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "پرداخت شده", color: "bg-blue-100 text-blue-800" },
  processing: { label: "در حال پردازش", color: "bg-purple-100 text-purple-800" },
  shipped: { label: "ارسال شده", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "تحویل داده شده", color: "bg-green-100 text-green-800" },
  cancelled: { label: "لغو شده", color: "bg-red-100 text-red-800" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    } else {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast({ title: "خطا", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "موفق", description: "وضعیت سفارش به‌روزرسانی شد" });
      fetchOrders();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">مدیریت سفارشات</h1>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">شماره سفارش</TableHead>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">مبلغ کل</TableHead>
                  <TableHead className="text-right">شهر</TableHead>
                  <TableHead className="text-right">تلفن</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      هیچ سفارشی یافت نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono">{order.order_number}</TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'yyyy/MM/dd - HH:mm')}
                      </TableCell>
                      <TableCell>
                        {order.final_amount.toLocaleString('fa-IR')} تومان
                      </TableCell>
                      <TableCell>{order.shipping_city || "-"}</TableCell>
                      <TableCell dir="ltr" className="text-left">{order.phone || "-"}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value: OrderStatus) => handleStatusChange(order.id, value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue>
                              <Badge className={statusMap[order.status].color}>
                                {statusMap[order.status].label}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusMap).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
