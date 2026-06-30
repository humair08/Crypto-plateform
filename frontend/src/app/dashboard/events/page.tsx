'use client';

import React, { useState, useEffect } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Input,
  Button,
  Badge,
  Pagination,
} from '@/components/ui';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useRequireAuth } from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/store/notificationStore';
import { Search, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  sport: string;
  league: string;
  startTime: string;
  status: 'upcoming' | 'live' | 'closed';
  odds: {
    home: number;
    away: number;
  };
  participants: string[];
  imageUrl?: string;
}

export default function EventsPage() {
  const router = useRouter();
  const { loading } = useRequireAuth();
  const { add: addNotification } = useNotificationStore();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = useSearchStore((s) => s.searchQuery);
  const setSearchQuery = useSearchStore((s) => s.setSearchQuery);
  const [filterSport, setFilterSport] = useState('all');
  const [filterStatus, setFilterStatus] = useState('upcoming');

  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchQuery, filterSport, filterStatus]);

  const loadEvents = async () => {
    try {
      // TODO: Replace with actual API call
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Manchester United vs Liverpool',
          sport: 'Football',
          league: 'Premier League',
          startTime: '2024-02-15T15:00:00',
          status: 'upcoming',
          odds: { home: 2.1, away: 1.8 },
          participants: ['Manchester United', 'Liverpool'],
        },
        {
          id: '2',
          title: 'Real Madrid vs Barcelona',
          sport: 'Football',
          league: 'La Liga',
          startTime: '2024-02-15T20:00:00',
          status: 'upcoming',
          odds: { home: 1.9, away: 2.0 },
          participants: ['Real Madrid', 'Barcelona'],
        },
        {
          id: '3',
          title: 'Lakers vs Celtics',
          sport: 'Basketball',
          league: 'NBA',
          startTime: '2024-02-14T22:00:00',
          status: 'live',
          odds: { home: 1.95, away: 1.95 },
          participants: ['Lakers', 'Celtics'],
        },
        {
          id: '4',
          title: 'Arsenal vs Chelsea',
          sport: 'Football',
          league: 'Premier League',
          startTime: '2024-02-14T17:30:00',
          status: 'closed',
          odds: { home: 2.2, away: 1.75 },
          participants: ['Arsenal', 'Chelsea'],
        },
        {
          id: '5',
          title: 'Juventus vs AC Milan',
          sport: 'Football',
          league: 'Serie A',
          startTime: '2024-02-16T19:00:00',
          status: 'upcoming',
          odds: { home: 1.85, away: 2.1 },
          participants: ['Juventus', 'AC Milan'],
        },
        {
          id: '6',
          title: 'Bayern Munich vs Dortmund',
          sport: 'Football',
          league: 'Bundesliga',
          startTime: '2024-02-16T15:00:00',
          status: 'upcoming',
          odds: { home: 1.75, away: 2.2 },
          participants: ['Bayern Munich', 'Dortmund'],
        },
      ];
      setEvents(mockEvents);
    } catch (error) {
      addNotification({ message: 'Failed to load events', type: 'error' });
    }
  };

  const filterEvents = () => {
    const filtered = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.sport.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSport = filterSport === 'all' || event.sport === filterSport;
      const matchesStatus = event.status === filterStatus;

      return matchesSearch && matchesSport && matchesStatus;
    });

    setFilteredEvents(filtered);
    setCurrentPage(1);
  };

  const handlePlaceBet = (eventId: string) => {
    router.push(`/dashboard/bets/place?eventId=${eventId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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

  const sports = ['all', ...new Set(events.map((e) => e.sport))];

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
            Betting Events
          </Heading>
          <Text className="text-white/60 mt-2">
            Browse and place bets on upcoming events
          </Text>
        </motion.div>

        {/* Filters */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Input
            label="Search Events"
            placeholder="Search by team or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />

          <div>
            <label className="block text-sm font-medium text-white mb-2">Sport</label>
            <select
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-white focus:outline-none focus:border-accent"
            >
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-white focus:outline-none focus:border-accent"
            >
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {paginatedEvents.map((event) => (
            <motion.div key={event.id} variants={itemVariants}>
              <Card hoverable className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Heading level={5} className="text-white">
                        {event.title}
                      </Heading>
                      <Text className="text-xs text-white/60 mt-1">
                        {event.league}
                      </Text>
                    </div>
                    <Badge
                      color={
                        event.status === 'live'
                          ? 'danger'
                          : event.status === 'upcoming'
                          ? 'accent'
                          : 'warning'
                      }
                      variant="soft"
                      size="sm"
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardBody className="flex-1 space-y-3">
                  <div className="space-y-2">
                    <Text className="text-xs text-white/60 flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(event.startTime).toLocaleString()}
                    </Text>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {event.participants.map((participant, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-secondary/50 border border-border/30"
                      >
                        <Text className="text-sm text-white/70">{participant}</Text>
                        <Text className="text-lg font-bold text-accent mt-1">
                          {idx === 0 ? event.odds.home : event.odds.away}
                        </Text>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-border/30">
                    <Text className="text-xs text-white/50">
                      Sport: <span className="text-accent">{event.sport}</span>
                    </Text>
                  </div>
                </CardBody>

                <div className="p-4 border-t border-border/30">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => handlePlaceBet(event.id)}
                    disabled={event.status === 'closed'}
                  >
                    {event.status === 'closed' ? 'Event Closed' : 'Place Bet'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {paginatedEvents.length === 0 && (
          <motion.div variants={itemVariants} className="text-center py-12">
            <Text className="text-white/60">No events found matching your filters</Text>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div variants={itemVariants} className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
