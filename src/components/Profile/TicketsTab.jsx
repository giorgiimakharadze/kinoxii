import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../../services/api';
import TicketCard from './TicketCard';
import './TicketsTab.css';

export default function TicketsTab({ onUpcomingCountChange }) {
  const [subTab, setSubTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refundingRef, setRefundingRef] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await ticketsApi.getTickets(); // fetch all
      const list = res?.data || [];
      setTickets(list);

      const upcomingCount = list.filter((t) => t.isUpcoming).length;
      onUpcomingCountChange?.(upcomingCount);
    } catch (err) {
      console.warn('Could not load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const upcomingTickets = tickets.filter((t) => t.isUpcoming);
  const pastTickets = tickets.filter((t) => !t.isUpcoming);

  const handleRefund = async (orderRef) => {
    setRefundingRef(orderRef);
    try {
      const res = await ticketsApi.refundOrder(orderRef);
      if (res?.data) {
        setTickets((prev) =>
          prev.map((t) => (t.reference === orderRef ? res.data : t))
        );
        const newUpcomingCount = upcomingTickets.filter((t) => t.reference !== orderRef).length;
        onUpcomingCountChange?.(newUpcomingCount);
      }
    } finally {
      setRefundingRef(null);
    }
  };

  const displayedList = subTab === 'upcoming' ? upcomingTickets : pastTickets;

  return (
    <div className="tickets-tab-wrapper">
      {/* upcoming and past pill bar */}
      <div className="tickets-subtabs-nav">
        <button
          type="button"
          className={`tickets-subtab-pill ${subTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setSubTab('upcoming')}
        >
          <span>Upcoming</span>
          <span className="subtab-count-badge">{upcomingTickets.length}</span>
        </button>

        <button
          type="button"
          className={`tickets-subtab-pill ${subTab === 'past' ? 'active' : ''}`}
          onClick={() => setSubTab('past')}
        >
          <span>Past</span>
          <span className="subtab-count-badge past">{pastTickets.length}</span>
        </button>
      </div>

      {/* tickets list */}
      <div className="tickets-cards-list">
        {loading ? (
          <div className="tickets-loading-text">Loading your tickets...</div>
        ) : displayedList.length === 0 ? (
          <div className="tickets-empty-box">
            <p>No {subTab} tickets found.</p>
          </div>
        ) : (
          displayedList.map((order) => (
            <TicketCard
              key={order.id || order.reference}
              order={order}
              isPast={subTab === 'past'}
              onRefund={handleRefund}
              isRefunding={refundingRef === order.reference}
            />
          ))
        )}
      </div>
    </div>
  );
}
