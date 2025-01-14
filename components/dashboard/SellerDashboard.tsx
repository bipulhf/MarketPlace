'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Package, Loader2, BarChart, TrendingUp, DollarSign } from 'lucide-react';
import { getProductImage } from '@/lib/imageUtils';
import { toast } from 'sonner';
import { Select } from '@radix-ui/react-select';
import { OrderStatus } from '@/lib/types';
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface NewProduct {
  name?: string;
  price?: number;
  description?: string;
  stockAmount?: number;
}

interface Analytics {
  currentMonth: {
    total: number;
    orderCount: number;
  };
  lifetime: {
    total: number;
    orderCount: number;
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stockAmount: number;
}

interface Order {
  id: string;
  createdAt: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

interface OrderWithProducts extends Order {
  items: {
    productId: string;
    quantity: number;
    product: Product;
  }[];
}

export default function SellerDashboard() {
  const [newProduct, setNewProduct] = useState<NewProduct>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const currentUser = useStore(state => state.currentUser);
  const products = useStore(state => state.products);
  const sellerOrders = useStore(state => state.sellerOrders);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);
  const fetchProducts = useStore(state => state.fetchProducts);
  const fetchSellerOrders = useStore(state => state.fetchSellerOrders);

  useEffect(() => {
    if (currentUser) {
      fetchProducts();
      fetchSellerOrders();
    }
  }, [currentUser, fetchProducts, fetchSellerOrders]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentUser) return;
      
      try {
        const response = await fetch(`/api/seller/analytics?sellerId=${currentUser.id}`);
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setIsLoadingAnalytics(false);
      }
    };

    fetchAnalytics();
  }, [currentUser]);

  const handleAddProduct = async () => {
    if (currentUser && newProduct.name && newProduct.price) {
      setIsLoading(true);
      try {
        const imageUrl = await getProductImage(newProduct.name);
        
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newProduct.name,
            price: Number(newProduct.price),
            description: newProduct.description || '',
            stockAmount: Number(newProduct.stockAmount) || 0,
            sellerId: currentUser.id,
            image: imageUrl,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add product');
        }

        await fetchProducts();
        setNewProduct({});
        toast.success('Product added successfully!');
      } catch (error) {
        console.error('Error adding product:', error);
        toast.error('Failed to add product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateStock = async (productId: string, newStockAmount: number) => {
    if (newStockAmount < 0) {
      toast.error('Stock amount cannot be negative');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/products/stock', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          stockAmount: newStockAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update stock');
      }

      await fetchProducts();
      toast.success('Stock updated successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editingProduct.name,
          price: Number(editingProduct.price),
          description: editingProduct.description || '',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }

      await fetchProducts();
      setEditingProduct(null);
      toast.success('Product updated successfully!');
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await fetchProducts();
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the ordersWithProducts mapping
  const ordersWithProducts = sellerOrders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId)
    }))
  }));

  const analyticsData = {
    ordersByStatus: {
      pending: ordersWithProducts.filter(o => o.status === 'pending').length,
      accepted: ordersWithProducts.filter(o => o.status === 'accepted').length,
      shipping: ordersWithProducts.filter(o => o.status === 'shipping').length,
      delivered: ordersWithProducts.filter(o => o.status === 'delivered').length
    },
    revenue: ordersWithProducts.reduce((total, order) => 
      total + order.items.reduce((sum, item) => 
        sum + ((item.product?.price || 0) * item.quantity), 0
      ), 0
    ),
    revenueByDate: ordersWithProducts
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(order => ({
        date: new Date(order.createdAt).toLocaleDateString(),
        revenue: order.items.reduce((sum, item) => 
          sum + ((item.product?.price || 0) * item.quantity), 0
        )
      }))
  };

  return (
    <Tabs defaultValue="products" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="products" className="text-sm sm:text-base">Products</TabsTrigger>
        <TabsTrigger value="orders" className="text-sm sm:text-base">Manage Orders</TabsTrigger>
        <TabsTrigger value="analytics" className="text-sm sm:text-base">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <div className="space-y-4 sm:space-y-6">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Total Products */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Total Products</p>
                  <h3 className="text-lg sm:text-2xl font-bold">{products.length}</h3>
                </div>
              </div>
            </Card>

            {/* Current Month Sales */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Current Month Sales</p>
                  {isLoadingAnalytics ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <h3 className="text-lg sm:text-2xl font-bold">
                        ৳{analytics?.currentMonth.total.toFixed(2) || '0.00'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {analytics?.currentMonth.orderCount || 0} orders
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Lifetime Sales */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-500">Lifetime Sales</p>
                  {isLoadingAnalytics ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <h3 className="text-lg sm:text-2xl font-bold">
                        ৳{analytics?.lifetime.total.toFixed(2) || '0.00'}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {analytics?.lifetime.orderCount || 0} orders
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Products Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold">Your Products</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Product Name"
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  />
                  <Input
                    type="number"
                    placeholder="Stock Amount"
                    value={newProduct.stockAmount || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, stockAmount: parseInt(e.target.value) })}
                  />
                  <Input
                    placeholder="Description"
                    value={newProduct.description || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleAddProduct} disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.description}</p>
                    </div>
                    <p className="font-bold">৳{product.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500">Stock: {product.stockAmount}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Update Stock
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Stock Amount</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input
                            type="number"
                            placeholder="New Stock Amount"
                            defaultValue={product.stockAmount}
                            onChange={(e) => {
                              const newAmount = parseInt(e.target.value);
                              if (!isNaN(newAmount)) {
                                handleUpdateStock(product.id, newAmount);
                              }
                            }}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="orders">
        <div className="space-y-4">
          {ordersWithProducts.length <= 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-muted-foreground text-sm sm:text-base">No orders found</p>
            </div>
          ) : (
            ordersWithProducts.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">Order #{order.id.slice(-8)}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                      <span className="text-xs sm:text-sm font-medium">Status:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order.id, value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Processing</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="shipping">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-t gap-3 sm:gap-0"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm sm:text-base">{item.product?.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-sm sm:text-base ml-13 sm:ml-0">
                          ৳{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex justify-end">
                    <p className="font-semibold text-sm sm:text-base">
                      Total: ৳
                      {order.items
                        .reduce(
                          (sum, item) => sum + ((item.product?.price || 0) * item.quantity),
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="analytics">
        <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="p-3 sm:p-6">
              <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Orders by Status</h3>
              <div className="w-full aspect-square sm:aspect-[4/3]">
                <Bar
                  data={{
                    labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],
                    datasets: [
                      {
                        label: 'Orders',
                        data: [
                          analyticsData.ordersByStatus.accepted,
                          analyticsData.ordersByStatus.pending,
                          analyticsData.ordersByStatus.shipping,
                          analyticsData.ordersByStatus.delivered,
                        ],
                        backgroundColor: [
                          'rgba(255, 159, 64, 0.5)',
                          'rgba(54, 162, 235, 0.5)',
                          'rgba(75, 192, 192, 0.5)',
                          'rgba(153, 102, 255, 0.5)',
                        ],
                        borderColor: [
                          'rgb(255, 159, 64)',
                          'rgb(54, 162, 235)',
                          'rgb(75, 192, 192)',
                          'rgb(153, 102, 255)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-6">
              <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Revenue Over Time</h3>
              <div className="w-full aspect-square sm:aspect-[4/3]">
                <Line
                  data={{
                    labels: analyticsData.revenueByDate.map(d => d.date),
                    datasets: [
                      {
                        label: 'Revenue',
                        data: analyticsData.revenueByDate.map(d => d.revenue),
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Product Name"
              value={editingProduct?.name || ''}
              onChange={(e) =>
                editingProduct && setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                })
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={editingProduct?.price || ''}
              onChange={(e) =>
                editingProduct && setEditingProduct({
                  ...editingProduct,
                  price: parseFloat(e.target.value),
                })
              }
            />
            <Input
              placeholder="Description"
              value={editingProduct?.description || ''}
              onChange={(e) =>
                editingProduct && setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setEditingProduct(null)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditProduct}
              disabled={isLoading || !editingProduct?.name || !editingProduct?.price}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}