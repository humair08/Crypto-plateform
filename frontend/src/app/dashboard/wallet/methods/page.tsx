'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Badge,
  Modal,
  Input,
} from '@/components/ui';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { useNotificationStore } from '@/store/notificationStore';
import { CreditCard, Trash2, Plus } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  lastDigits: string;
  expiryDate?: string;
  isDefault: boolean;
  createdAt: string;
}

export default function PaymentMethodsPage() {
  const { loading } = useRequireAuth();
  const { add: addNotification } = useNotificationStore();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa',
      lastDigits: '4242',
      expiryDate: '12/25',
      isDefault: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      type: 'bank',
      name: 'Chase Bank',
      lastDigits: '****9876',
      isDefault: false,
      createdAt: '2024-01-10',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card',
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const handleDeleteMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((m) => m.id !== id));
    addNotification({
      message: 'Payment method removed',
      type: 'success',
    });
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
    addNotification({
      message: 'Default payment method updated',
      type: 'success',
    });
  };

  const handleAddMethod = () => {
    if (!newMethod.cardholderName || !newMethod.cardNumber) {
      addNotification({
        message: 'Please fill in all required fields',
        type: 'warning',
      });
      return;
    }

    const lastDigits = newMethod.cardNumber.slice(-4);
    const method: PaymentMethod = {
      id: Math.random().toString(36),
      type: 'card',
      name: 'Card',
      lastDigits,
      expiryDate: newMethod.expiry,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPaymentMethods([...paymentMethods, method]);
    setShowAddModal(false);
    setNewMethod({
      type: 'card',
      cardholderName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    });

    addNotification({
      message: 'Payment method added successfully',
      type: 'success',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div>
            <Heading level={1} className="text-white">
              Payment Methods
            </Heading>
            <Text className="text-white/60 mt-2">
              Manage your saved payment methods
            </Text>
          </div>
          <Button
            variant="primary"
            icon={<Plus size={20} />}
            onClick={() => setShowAddModal(true)}
          >
            Add Method
          </Button>
        </motion.div>

        {/* Payment Methods Grid */}
        {paymentMethods.length > 0 ? (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {paymentMethods.map((method) => (
              <motion.div key={method.id} variants={itemVariants}>
                <Card hoverable className="border border-white/10 bg-[#08101d]/90 shadow-glass">
                  <CardBody className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-3xl bg-accent/10">
                          <CreditCard size={24} className="text-accent" />
                        </div>
                        <div>
                          <Text className="font-semibold text-white">
                            {method.name} ••••{method.lastDigits}
                          </Text>
                          {method.expiryDate && (
                            <Text className="text-xs text-white/60 mt-1">
                              Expires: {method.expiryDate}
                            </Text>
                          )}
                        </div>
                      </div>
                      {method.isDefault && (
                        <Badge color="success" variant="soft" size="sm">
                          Default
                        </Badge>
                      )}
                    </div>

                    <Text className="text-xs text-white/50">
                      Added on {new Date(method.createdAt).toLocaleDateString()}
                    </Text>
                  </CardBody>
                  <CardFooter className="flex gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        fullWidth
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={18} />}
                      onClick={() => handleDeleteMethod(method.id)}
                    />
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card>
              <CardBody className="text-center py-12">
                <Text className="text-white/60">
                  No payment methods added yet
                </Text>
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Your First Payment Method
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Add Payment Method Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Payment Method"
          size="md"
          footer={
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddMethod}
              >
                Add Method
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Cardholder Name"
              placeholder="HUMAIR TARIQ"
              value={newMethod.cardholderName}
              onChange={(e) =>
                setNewMethod({ ...newMethod, cardholderName: e.target.value })
              }
            />
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={newMethod.cardNumber}
              onChange={(e) =>
                setNewMethod({ ...newMethod, cardNumber: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry (MM/YY)"
                placeholder="12/25"
                value={newMethod.expiry}
                onChange={(e) =>
                  setNewMethod({ ...newMethod, expiry: e.target.value })
                }
              />
              <Input
                label="CVV"
                placeholder="123"
                type="password"
                value={newMethod.cvv}
                onChange={(e) =>
                  setNewMethod({ ...newMethod, cvv: e.target.value })
                }
              />
            </div>
          </div>
        </Modal>

        {/* Info Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <Heading level={5}>Security Information</Heading>
            </CardHeader>
            <CardBody className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  Your payment information is encrypted and secure
                </Text>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  We use industry-standard PCI compliance
                </Text>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0 mt-1" />
                <Text className="text-white/70">
                  Payment methods are stored securely
                </Text>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
