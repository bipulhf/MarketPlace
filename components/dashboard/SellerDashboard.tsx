'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Product, Order, OrderStatus, CartItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Package, Loader2, BarChart } from 'lucide-react';
import { getProductImage } from '@/lib/imageUtils';
import {
  Line,
  Bar
} from 'react-chartjs-2';
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface OrderItemWithProduct extends CartItem {
  product: Product;
}

interface OrderWithProducts extends Order {
  items: OrderItemWithProduct[];
}

interface NewProduct {
  name?: string;
  price?: number;
  description?: string;
}

export default function SellerDashboard() {
  const [newProduct, setNewProduct] = useState<NewProduct>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useStore(state => state.currentUser);
  const products = useStore(state => state.products);
  const sellerOrders = useStore(state => state.sellerOrders);
  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const deleteProduct = useStore(state => state.deleteProduct);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);
  const fetchProducts = useStore(state => state.fetchProducts);
  const fetchSellerOrders = useStore(state => state.fetchSellerOrders);

  useEffect(() => {
    if (currentUser?.role === 'seller') {
      fetchProducts();
      fetchSellerOrders();
    }
  }, [currentUser, fetchProducts, fetchSellerOrders]);

  const handleAddProduct = async () => {
    if (currentUser && newProduct.name && newProduct.price) {
      setIsLoading(true);
      try {
        const imageUrl = await getProductImage(newProduct.name);
        await addProduct({
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description || '',
          image: imageUrl,
          sellerId: currentUser.id,
        });
        setNewProduct({});
      } catch (error) {
        console.error('Error adding product:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditProduct = async () => {
    if (editingProduct && editingProduct.id) {
      setIsLoading(true);
      try {
        const imageUrl = await getProductImage(editingProduct.name);
        await updateProduct(editingProduct.id, { 
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
          image: imageUrl,
        });
        setEditingProduct(null);
      } catch (error) {
        console.error('Error updating product:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (id) {
      setIsLoading(true);
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Transform orders to include product information
  const ordersWithProducts: OrderWithProducts[] = sellerOrders.map(order => ({
    ...order,
    items: order.items.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId)!
    }))
  }));

  // Calculate analytics data
  const analyticsData = {
    ordersByStatus: {
      pending: ordersWithProducts.filter(o => o.status === 'pending').length,
      accepted: ordersWithProducts.filter(o => o.status === 'accepted').length,
      shipping: ordersWithProducts.filter(o => o.status === 'shipping').length,
      delivered: ordersWithProducts.filter(o => o.status === 'delivered').length
    },
    revenue: ordersWithProducts.reduce((total, order) => 
      total + order.items.reduce((sum, item) => 
        sum + (item.product.price * item.quantity), 0
      ), 0
    ),
    revenueByDate: ordersWithProducts
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map(order => ({
        date: new Date(order.createdAt).toLocaleDateString(),
        revenue: order.items.reduce((sum, item) => 
          sum + (item.product.price * item.quantity), 0
        )
      }))
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Manage Products</TabsTrigger>
          <TabsTrigger value="orders">Manage Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="grid gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Product Name"
                    value={newProduct.name || ''}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price || ''}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                  <Input
                    placeholder="Description"
                    value={newProduct.description || ''}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleAddProduct}
                    disabled={isLoading || !newProduct.name || !newProduct.price}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Product</DialogTitle>
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
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingProduct(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditProduct}
                    disabled={isLoading || !editingProduct?.name || !editingProduct?.price}
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          ৳{product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete {product.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently
                                delete the product.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {product.description || 'No description'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="space-y-4">
            {ordersWithProducts.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{order.id.slice(-8)}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">Status:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          updateOrderStatus(order.id, value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
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
                        className="flex justify-between items-center py-2 border-t"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium">
                        ৳{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <p className="font-semibold">
                      Total: ৳
                      {order.items
                        .reduce(
                          (sum, item) => sum + item.product.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Orders by Status</h3>
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
                          'rgba(255, 99, 132, 0.5)',
                        ],
                        borderColor: [
                          'rgb(255, 159, 64)',
                          'rgb(54, 162, 235)',
                          'rgb(75, 192, 192)',
                          'rgb(153, 102, 255)',
                          'rgb(255, 99, 132)',
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Revenue Over Time</h3>
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
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}