"use client";

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Product, Order } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SellerDashboard() {
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const currentUser = useStore(state => state.currentUser);
  const products = useStore(state => state.products);
  const orders = useStore(state => state.orders);
  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const updateOrderStatus = useStore(state => state.updateOrderStatus);

  const handleAddProduct = () => {
    if (currentUser && newProduct.name && newProduct.price) {
      addProduct({
        ...newProduct,
        sellerId: currentUser.id,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      } as Omit<Product, 'id'>);
      setNewProduct({});
    }
  };

  const handleEditProduct = () => {
    if (editingProduct && editingProduct.id) {
      updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    }
  };

  const sellerOrders = orders.filter(order => order.sellerId === currentUser?.id);

  return (
    <Tabs defaultValue="products">
      <TabsList>
        <TabsTrigger value="products">Manage Products</TabsTrigger>
        <TabsTrigger value="orders">Manage Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="products" className="mt-6">
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
          <div className="space-y-4">
            <Input
              placeholder="Product Name"
              value={newProduct.name || ''}
              onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newProduct.price || ''}
              onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            />
            <Input
              placeholder="Description"
              value={newProduct.description || ''}
              onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <Button onClick={handleAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products
            .filter(product => product.sellerId === currentUser?.id)
            .map(product => (
              <Card key={product.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-600">${product.price}</p>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                  <div className="space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Input
                            placeholder="Product Name"
                            value={editingProduct?.name || ''}
                            onChange={e => setEditingProduct(prev => 
                              prev ? { ...prev, name: e.target.value } : null
                            )}
                          />
                          <Input
                            type="number"
                            placeholder="Price"
                            value={editingProduct?.price || ''}
                            onChange={e => setEditingProduct(prev => 
                              prev ? { ...prev, price: Number(e.target.value) } : null
                            )}
                          />
                          <Input
                            placeholder="Description"
                            value={editingProduct?.description || ''}
                            onChange={e => setEditingProduct(prev => 
                              prev ? { ...prev, description: e.target.value } : null
                            )}
                          />
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button onClick={handleEditProduct}>
                                Save Changes
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </TabsContent>

      <TabsContent value="orders" className="mt-6">
        <div className="space-y-4">
          {sellerOrders.map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Total: ${order.total}</p>
                </div>
                <div>
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => updateOrderStatus(order.id, 'accepted')}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Accept Order
                    </Button>
                  )}
                  <p className="text-sm font-medium mt-2">
                    Status: {order.status}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}