"use client";

import { Card } from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function SellerDashboard() {
  const { products, orders } = useStore();

  // Mock data for demonstration
  const metrics = [
    {
      title: "Total Revenue",
      value: "$12,345",
      change: "+12%",
      trend: "up",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: "Total Orders",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    {
      title: "Total Products",
      value: products.length.toString(),
      change: "-2%",
      trend: "down",
      icon: <Package className="w-4 h-4" />,
    },
    {
      title: "Active Customers",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const recentOrders = [
    {
      id: "ORD001",
      customer: "John Doe",
      product: "Gaming Laptop",
      amount: "$999",
      status: "processing",
      date: "2 hours ago",
    },
    {
      id: "ORD002",
      customer: "Jane Smith",
      product: "Wireless Earbuds",
      amount: "$129",
      status: "completed",
      date: "5 hours ago",
    },
    {
      id: "ORD003",
      customer: "Mike Johnson",
      product: "Smart Watch",
      amount: "$299",
      status: "pending",
      date: "1 day ago",
    },
  ];

  const lowStockProducts = [
    { name: "Gaming Mouse", stock: 5, threshold: 10 },
    { name: "Mechanical Keyboard", stock: 3, threshold: 15 },
    { name: "USB-C Cable", stock: 8, threshold: 20 },
  ];

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Download Report
          </Button>
          <Button size="sm">
            <Package className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">{metric.icon}</div>
                <span className="text-sm font-medium">{metric.title}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-xs",
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                )}
              >
                {metric.change}
                {metric.trend === "up" ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold">{metric.value}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Orders</h3>
            <Button variant="ghost" size="sm" className="gap-1">
              View All <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "pending"
                          ? "secondary"
                          : order.status === "processing"
                          ? "destructive"
                          : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Low Stock Alert */}
        <Card className="col-span-3 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Low Stock Alert</h3>
            <Button variant="ghost" size="sm" className="gap-1">
              View Inventory <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map((product, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted-foreground">
                    {product.stock} / {product.threshold}
                  </span>
                </div>
                <Progress
                  value={(product.stock / product.threshold) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium">Add Product</h4>
              <p className="text-sm text-muted-foreground">
                List a new product for sale
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium">Process Orders</h4>
              <p className="text-sm text-muted-foreground">
                View and update order status
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium">Update Hours</h4>
              <p className="text-sm text-muted-foreground">
                Set your business hours
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-medium">Get Support</h4>
              <p className="text-sm text-muted-foreground">
                Contact our support team
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
