import React, { useMemo } from 'react';
import MovieDetailSessionCard from './MovieDetailSessionCard';

export default function MovieDetailVenueGroup({
  venueGroup,
  isBlockedByAge,
  ageRestrictionMessage,
  onSelectSession,
}) {
  // pregroup sessions by hall
  const halls = useMemo(() => {
    const map = {};
    venueGroup.sessions?.forEach((s) => {
      const hallName = s.hall?.name || 'Main Hall';
      if (!map[hallName]) map[hallName] = [];
      map[hallName].push(s);
    });
    return Object.entries(map); // array of [hallName, sessionsList]
  }, [venueGroup.sessions]);

  return (
    <div className="detail-venue-group">
      <h3 className="detail-venue-name">{venueGroup.venue?.name}</h3>

      <div className="detail-halls-grid">
        {halls.map(([hallName, hallSessions]) => (
          <div key={hallName} className="detail-hall-card">
            <span className="detail-hall-label">{hallName}</span>
            <div className="detail-hall-sessions-row">
              {hallSessions.map((session) => (
                <MovieDetailSessionCard
                  key={session.id}
                  session={session}
                  isBlockedByAge={isBlockedByAge}
                  ageRestrictionMessage={ageRestrictionMessage}
                  onSelectSession={onSelectSession}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
