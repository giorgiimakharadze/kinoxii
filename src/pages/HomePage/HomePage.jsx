import React from 'react';
import Hero from '../../components/Hero/Hero';
import RecentlyViewed from '../../components/RecentlyViewed/RecentlyViewed';
import NowPlaying from '../../components/NowPlaying/NowPlaying';
import ComingSoon from '../../components/ComingSoon/ComingSoon';

export default function HomePage({
  onSelectMovie,
  onNavigateToSessions,
  onRequireAuth,
}) {
  return (
    <main className="home-page-container">
      {/* hero carousel */}
      <Hero
        onBuyTickets={(movie) => onSelectMovie?.(movie)}
        onAllSessions={() => onNavigateToSessions?.()}
      />

      {/* recently viewed */}
      <RecentlyViewed
        onSelectMovie={(movie) => onSelectMovie?.(movie)}
      />

      {/* now playing */}
      <NowPlaying
        onSelectMovie={(movie) => onSelectMovie?.(movie)}
        onSeeAll={() => onNavigateToSessions?.()}
      />

      {/* coming soon */}
      <ComingSoon
        onSelectMovie={(movie) => onSelectMovie?.(movie)}
        onSeeAll={() => onNavigateToSessions?.()}
        onRequireAuth={onRequireAuth}
      />
    </main>
  );
}
