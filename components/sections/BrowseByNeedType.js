'use client';

import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Container from '../ui/Container';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const glowPulse = keyframes`
  0%, 100% { opacity: 0.45; transform: scale(1); }
  50%       { opacity: 0.85; transform: scale(1.1); }
`;

// ─── Section ──────────────────────────────────────────────────────────────────

const BrowseSection = styled.section`
  position: relative;
  padding: 88px 0 96px;
  overflow: hidden;
  background: #FFFFFF;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 5%  20%,  rgba(253, 224, 71,  0.09) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 95% 15%,  rgba(56,  189, 248, 0.08) 0%, transparent 55%),
      radial-gradient(ellipse 45% 45% at 50% 100%, rgba(244, 63,  94,  0.06) 0%, transparent 55%),
      radial-gradient(ellipse 40% 30% at 80% 65%,  rgba(34,  197, 94,  0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(15, 23, 42, 0.045) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    z-index: 0;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%);
  }
`;

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
  pointer-events: none;
  z-index: 0;
`;

const BlobA = styled(Blob)`
  width: 260px; height: 260px;
  background: rgba(253, 224, 71, 0.18);
  top: -70px; right: 5%;
  animation: ${glowPulse} 8s ease-in-out infinite;
`;

const BlobB = styled(Blob)`
  width: 200px; height: 200px;
  background: rgba(56, 189, 248, 0.14);
  bottom: -50px; left: 8%;
  animation: ${glowPulse} 11s ease-in-out infinite 4s;
`;

const Inner = styled(Container)`
  position: relative;
  z-index: 1;
`;

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = styled.div`
  text-align: center;
  margin-bottom: 52px;
`;

const Eyebrow = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 16px;
  background: rgba(245, 158, 11, 0.09);
  border: 1.5px solid rgba(245, 158, 11, 0.25);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #B45309;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 18px;
`;

const Title = styled(motion.h2)`
  font-family: 'Nunito', 'Poppins', sans-serif;
  font-size: clamp(26px, 3.8vw, 42px);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 14px;

  .accent {
    background: linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #EC4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 16px;
  color: #64748B;
  max-width: 440px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 500;
`;

// ─── Grid ─────────────────────────────────────────────────────────────────────

/**
 * STRICT mobile layout: exactly 3 columns at all breakpoints.
 * Tablet gets 3 cols too; desktop gets the wider 3-col premium layout.
 */
const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  /* Tablet: slightly more gap, same 3 cols */
  @media (min-width: 640px) {
    gap: 14px;
  }

  /* Desktop: richer spacing */
  @media (min-width: 1024px) {
    gap: 20px;
  }
`;

// ─── Category Card ────────────────────────────────────────────────────────────

const CardOuter = styled(motion.button)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  text-align: center;
  -webkit-tap-highlight-color: transparent;
  min-height: 44px; /* accessibility tap target */
`;

const IconShell = styled(motion.div)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(26px, 7vw, 44px);
  position: relative;
  overflow: hidden;
  box-shadow:
    0 4px 16px ${({ $shadow }) => $shadow || 'rgba(15,23,42,0.10)'},
    0 1px 4px rgba(15,23,42,0.06);
  transition: box-shadow 0.25s ease;
  border: 1.5px solid rgba(255,255,255,0.7);

  /* Inner shine */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(145deg, rgba(255,255,255,0.3) 0%, transparent 55%);
    pointer-events: none;
  }

  /* Desktop extra rounding */
  @media (min-width: 1024px) {
    border-radius: 24px;
  }
`;

const CardLabel = styled.span`
  display: block;
  font-family: 'Nunito', 'Poppins', sans-serif;
  font-size: clamp(11px, 3vw, 14px);
  font-weight: 800;
  color: #0F172A;
  margin-top: 8px;
  line-height: 1.2;
  letter-spacing: -0.01em;

  @media (min-width: 640px) {
    font-size: 14px;
    margin-top: 10px;
  }

  @media (min-width: 1024px) {
    font-size: 15px;
    margin-top: 12px;
  }
`;

const CardDesc = styled.span`
  display: none;

  @media (min-width: 640px) {
    display: block;
    font-size: 11.5px;
    color: #94A3B8;
    font-weight: 600;
    margin-top: 3px;
    line-height: 1.3;
    letter-spacing: 0.01em;
  }

  @media (min-width: 1024px) {
    font-size: 12.5px;
    margin-top: 4px;
  }
`;

// ─── View All CTA ─────────────────────────────────────────────────────────────

const CTARow = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-top: 44px;
`;

const ViewAllBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
  color: white;
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: 800;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.30);
  letter-spacing: 0.01em;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 8px 28px rgba(239, 68, 68, 0.40);
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: 'Money',
    description: 'Rent, medical & bills',
    emoji: '💰',
    bg: 'linear-gradient(145deg, #FEF9C3 0%, #FDE68A 100%)',
    shadow: 'rgba(245,158,11,0.22)',
    slug: 'money',
  },
  {
    name: 'Services',
    description: 'Moving, repairs, tutoring',
    emoji: '🔧',
    bg: 'linear-gradient(145deg, #DBEAFE 0%, #BFDBFE 100%)',
    shadow: 'rgba(56,189,248,0.22)',
    slug: 'services',
  },
  {
    name: 'Items',
    description: 'Food, clothing, furniture',
    emoji: '📦',
    bg: 'linear-gradient(145deg, #FCE7F3 0%, #FBCFE8 100%)',
    shadow: 'rgba(236,72,153,0.18)',
    slug: 'items',
  },
  {
    name: 'Health',
    description: 'Medical care & meds',
    emoji: '❤️',
    bg: 'linear-gradient(145deg, #FEE2E2 0%, #FECACA 100%)',
    shadow: 'rgba(239,68,68,0.20)',
    slug: 'health',
  },
  {
    name: 'Community',
    description: 'Volunteers & events',
    emoji: '🤝',
    bg: 'linear-gradient(145deg, #D1FAE5 0%, #A7F3D0 100%)',
    shadow: 'rgba(34,197,94,0.20)',
    slug: 'community',
  },
  {
    name: 'Education',
    description: 'School supplies & tuition',
    emoji: '📚',
    bg: 'linear-gradient(145deg, #EDE9FE 0%, #DDD6FE 100%)',
    shadow: 'rgba(99,102,241,0.20)',
    slug: 'education',
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.48, ease: [0.2, 0.9, 0.2, 1] },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BrowseByCategory() {
  const router = useRouter();

  const handleCategory = (slug) => {
    router.push(`/sponsorships?category=${slug}`);
  };

  const handleViewAll = () => {
    router.push('/sponsorships');
  };

  return (
    <BrowseSection>
      <BlobA />
      <BlobB />

      <Inner>
        {/* Header */}
        <Header>
          <Eyebrow
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            🗂️ Categories
          </Eyebrow>

          <Title
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.07 }}
          >
            Browse by <span className="accent">Need Type</span>
          </Title>

          <Subtitle
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.14 }}
          >
            Find campaigns that match what you care about most.
          </Subtitle>
        </Header>

        {/* 3-Column Grid — all breakpoints */}
        <Grid
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-48px' }}
        >
          {CATEGORIES.map((cat) => (
            <CardOuter
              key={cat.slug}
              variants={cardVariants}
              onClick={() => handleCategory(cat.slug)}
              aria-label={`Browse ${cat.name} campaigns`}
              whileTap={{ scale: 0.94 }}
            >
              <IconShell
                $bg={cat.bg}
                $shadow={cat.shadow}
                whileHover={{
                  scale: 1.06,
                  boxShadow: `0 10px 32px ${cat.shadow}, 0 2px 8px rgba(15,23,42,0.08)`,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                {cat.emoji}
              </IconShell>
              <CardLabel>{cat.name}</CardLabel>
              <CardDesc>{cat.description}</CardDesc>
            </CardOuter>
          ))}
        </Grid>

        {/* View All CTA */}
        <CTARow
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48, delay: 0.2 }}
        >
          <ViewAllBtn
            onClick={handleViewAll}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            View All Campaigns →
          </ViewAllBtn>
        </CTARow>
      </Inner>
    </BrowseSection>
  );
}