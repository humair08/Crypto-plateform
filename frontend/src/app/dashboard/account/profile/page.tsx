'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Input,
  Button,
  Tabs,
  Avatar,
} from '@/components/ui';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { Mail, User, MapPin, Calendar, Phone, Copy, Check } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';

export default function ProfilePage() {
  const { loading, user } = useRequireAuth();
  const { add: addNotification } = useNotificationStore();
  const [editMode, setEditMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    birthDate: user?.birthDate || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    // TODO: Implement API call to update profile
    addNotification({
      message: 'Profile updated successfully',
      type: 'success',
    });
    setEditMode(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
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

  const profileTabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      content: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!editMode}
                icon={<User size={18} />}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!editMode}
                icon={<User size={18} />}
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editMode}
              icon={<Mail size={18} />}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!editMode}
              icon={<Phone size={18} />}
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={!editMode}
                icon={<MapPin size={18} />}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="Birth Date"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                disabled={!editMode}
                icon={<Calendar size={18} />}
              />
            </motion.div>
          </div>
        </motion.div>
      ),
    },
    {
      id: 'security',
      label: 'Security & Privacy',
      content: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <Heading level={5}>Two-Factor Authentication</Heading>
              </CardHeader>
              <CardBody className="flex items-center justify-between">
                <div>
                  <Text className="text-white/70 text-sm">
                    Enhance your account security with 2FA
                  </Text>
                </div>
                <Button variant="secondary" size="sm">
                  Enable
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <Heading level={5}>Change Password</Heading>
              </CardHeader>
              <CardBody>
                <Button variant="secondary" size="sm">
                  Update Password
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <Heading level={5}>Active Sessions</Heading>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="p-3 bg-secondary/50 rounded-lg">
                  <Text className="text-sm font-medium">Chrome on Windows</Text>
                  <Text className="text-xs text-white/60 mt-1">Last active: 5 minutes ago</Text>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      content: (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardBody className="flex items-center justify-between">
                <div>
                  <Text className="text-white font-medium">Email Notifications</Text>
                  <Text className="text-white/60 text-sm">Receive updates via email</Text>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5"
                />
              </CardBody>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardBody className="flex items-center justify-between">
                <div>
                  <Text className="text-white font-medium">Bet Reminders</Text>
                  <Text className="text-white/60 text-sm">Get notified about upcoming bets</Text>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5"
                />
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Heading level={1} className="text-white">
            Profile Settings
          </Heading>
          <Text className="text-white/60 mt-2">
            Manage your account information and preferences
          </Text>
        </motion.div>

        {/* Profile Card */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardBody className="flex items-start gap-6 flex-col md:flex-row">
              <div className="flex-shrink-0">
                <Avatar
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size="lg"
                  status="online"
                />
              </div>

              <div className="flex-1">
                <Heading level={3} className="text-white">
                  {user?.firstName} {user?.lastName}
                </Heading>
                <Text className="text-white/60 mt-1">{user?.email}</Text>

                <div className="mt-4 flex items-center gap-2">
                  <Text className="text-sm text-white/60">Member ID:</Text>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/50 border border-border/30">
                    <Text className="text-sm font-mono">{user?.id}</Text>
                    <button
                      onClick={() => copyToClipboard(user?.id || '')}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {copied ? (
                        <Check size={16} className="text-success" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                variant={editMode ? 'danger' : 'primary'}
                onClick={() => (editMode ? setEditMode(false) : setEditMode(true))}
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </CardBody>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardBody>
              <Tabs tabs={profileTabs} defaultTab="personal" />
            </CardBody>
          </Card>
        </motion.div>

        {/* Save Button */}
        {editMode && (
          <motion.div
            variants={itemVariants}
            className="flex gap-4 justify-end"
          >
            <Button
              variant="ghost"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
