'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FiShield, FiHeart, FiCheckCircle } from 'react-icons/fi';
import Container from '../ui/Container';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const glowPulse = keyframes`
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50%       { opacity: 0.9; transform: scale(1.1); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;

const floatY = keyframes`
  0%, 100% { transform: translateY(0px);   }
  50%       { transform: translateY(-10px); }
`;

// ─── Section ──────────────────────────────────────────────────────────────────

const MissionSection = styled.section`
  position: relative;
  padding: 96px 0 104px;
  overflow: hidden;
  background: #FDFCFF;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 65% 45% at 0%   25%, rgba(253,224,71, 0.10) 0%, transparent 60%),
      radial-gradient(ellipse 55% 40% at 100% 15%, rgba(56, 189,248, 0.09) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 55% 100%, rgba(244,63, 94,  0.07) 0%, transparent 55%),
      radial-gradient(ellipse 40% 35% at 80%  70%, rgba(34, 197,94,  0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(15,23,42,0.045) 1px, transparent 1px);
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

const BlobAmber = styled(Blob)`
  width: 300px; height: 300px;
  background: rgba(253,224,71,0.18);
  top: -80px; left: -60px;
  animation: ${glowPulse} 8s ease-in-out infinite;
`;

const BlobBlue = styled(Blob)`
  width: 240px; height: 240px;
  background: rgba(56,189,248,0.14);
  top: 40px; right: -50px;
  animation: ${glowPulse} 10s ease-in-out infinite 3s;
`;

const BlobGreen = styled(Blob)`
  width: 180px; height: 180px;
  background: rgba(34,197,94,0.12);
  bottom: 60px; left: 25%;
  animation: ${glowPulse} 13s ease-in-out infinite 6s;
`;

const Inner = styled(Container)`
  position: relative;
  z-index: 1;
`;

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = styled.div`
  text-align: center;
  max-width: 720px;
  margin: 0 auto 56px;
`;

const Eyebrow = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 16px;
  background: rgba(244,63,94,0.08);
  border: 1.5px solid rgba(244,63,94,0.22);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #BE123C;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 18px;
`;

const SectionTitle = styled(motion.h2)`
  font-family: 'Nunito', 'Poppins', sans-serif;
  font-size: clamp(26px, 3.8vw, 44px);
  font-weight: 800;
  color: #0F172A;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 16px;

  .accent {
    background: linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #EC4899 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ${shimmer} 4s linear infinite;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 17px;
  color: #64748B;
  line-height: 1.65;
  font-weight: 500;
  margin-bottom: 16px;
`;

const ExplanationText = styled(motion.p)`
  font-size: 15px;
  color: #94A3B8;
  line-height: 1.7;
  font-weight: 500;
  max-width: 660px;
  margin: 0 auto;
`;

// ─── Impact Cards ─────────────────────────────────────────────────────────────

const ImpactGrid = styled(motion.div)`
  display: grid;
  gap: 16px;
  margin-bottom: 56px;
  margin-top: 8px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`;

const ImpactCard = styled(motion.div)`
  position: relative;
  border-radius: 20px;
  padding: 28px 20px 24px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255,255,255,0.8);
  box-shadow: 0 4px 20px rgba(15,23,42,0.07), 0 1px 4px rgba(15,23,42,0.04);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 20px; right: 20px;
    height: 2px;
    background: ${({ $accent }) => $accent};
    border-radius: 0 0 2px 2px;
    opacity: 0.75;
  }
`;

const ImpactIconWrap = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: ${({ $bg }) => $bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  animation: ${floatY} 5s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
  box-shadow: 0 4px 14px ${({ $shadow }) => $shadow || 'rgba(15,23,42,0.10)'};
`;

const ImpactTitle = styled.h4`
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  line-height: 1.3;
`;

const ImpactDesc = styled.p`
  font-size: 13.5px;
  color: #64748B;
  line-height: 1.55;
  margin: 0;
  font-weight: 500;
`;

// ─── Donation Grid ────────────────────────────────────────────────────────────

/**
 * STRICT: 2 cols on mobile, 3 on tablet, 5 on desktop
 */
const DonationGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 40px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
  }
`;

const DonationCard = styled(motion.div)`
  position: relative;
  border-radius: 20px;
  padding: 22px 14px 18px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255,255,255,0.75);
  box-shadow: 0 4px 18px rgba(15,23,42,0.08), 0 1px 4px rgba(15,23,42,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  transition: box-shadow 0.25s ease;

  &:hover {
    box-shadow: 0 10px 36px ${({ $shadow }) => $shadow || 'rgba(15,23,42,0.13)'}, 0 2px 8px rgba(15,23,42,0.06);
  }

  /* Gradient top accent */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 14px; right: 14px;
    height: 2.5px;
    background: ${({ $accent }) => $accent};
    border-radius: 0 0 2px 2px;
  }
`;

const DonationEmoji = styled.div`
  font-size: clamp(28px, 6vw, 36px);
  line-height: 1;
  animation: ${floatY} 6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay || '0s'};
`;

const PlatformName = styled.h3`
  font-family: 'Nunito', sans-serif;
  font-size: clamp(13px, 3.5vw, 15px);
  font-weight: 800;
  color: #0F172A;
  margin: 0;
  line-height: 1.2;
`;

const HandleChip = styled.span`
  font-size: clamp(10px, 2.5vw, 12px);
  color: #64748B;
  font-weight: 600;
  background: #F1F5F9;
  border: 1px solid #E2E8F0;
  padding: 3px 9px;
  border-radius: 7px;
  word-break: break-all;
  line-height: 1.4;
`;

const ActionBtn = styled(motion.button)`
  width: 100%;
  padding: 9px 10px;
  background: ${({ $bg, $copied }) => $copied ? '#22C55E' : $bg};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: clamp(11px, 2.5vw, 13px);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  letter-spacing: 0.01em;
  box-shadow: 0 2px 10px ${({ $shadow }) => $shadow || 'rgba(0,0,0,0.15)'};
  transition: opacity 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    opacity: 0.9;
    box-shadow: 0 4px 16px ${({ $shadow }) => $shadow || 'rgba(0,0,0,0.20)'};
  }
`;

const ActionLinkBtn = styled(motion.a)`
  width: 100%;
  padding: 9px 10px;
  background: ${({ $bg }) => $bg};
  color: white;
  border-radius: 10px;
  font-size: clamp(11px, 2.5vw, 13px);
  font-weight: 700;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  letter-spacing: 0.01em;
  box-shadow: 0 2px 10px ${({ $shadow }) => $shadow || 'rgba(0,0,0,0.15)'};
  transition: opacity 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    opacity: 0.9;
    color: white;
    text-decoration: none;
    box-shadow: 0 4px 16px ${({ $shadow }) => $shadow || 'rgba(0,0,0,0.20)'};
  }
`;

const CopiedTooltip = styled(motion.div)`
  position: absolute;
  bottom: -38px;
  left: 50%;
  transform: translateX(-50%);
  background: #0F172A;
  color: white;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  z-index: 20;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -4px; left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px; height: 8px;
    background: #0F172A;
  }
`;

// ─── Trust Strip ──────────────────────────────────────────────────────────────

const TrustStrip = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 40px;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #64748B;

  svg {
    width: 14px; height: 14px;
    color: #22C55E;
    flex-shrink: 0;
  }
`;

// ─── Disclaimer ───────────────────────────────────────────────────────────────

const Disclaimer = styled.p`
  font-size: 12px;
  color: #94A3B8;
  text-align: center;
  max-width: 580px;
  margin: 0 auto 48px;
  line-height: 1.55;
`;

// ─── Quote Block ──────────────────────────────────────────────────────────────

const QuoteCard = styled(motion.div)`
  position: relative;
  max-width: 720px;
  margin: 0 auto 48px;
  border-radius: 24px;
  padding: 36px 40px;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border: 1.5px solid rgba(255,255,255,0.08);
  box-shadow: 0 20px 60px rgba(15,23,42,0.22), 0 4px 16px rgba(15,23,42,0.12);
  text-align: center;
  overflow: hidden;

  /* Decorative glow */
  &::before {
    content: '';
    position: absolute;
    top: -30px; left: 50%;
    transform: translateX(-50%);
    width: 200px; height: 80px;
    background: linear-gradient(90deg, rgba(245,158,11,0.35), rgba(239,68,68,0.30), rgba(99,102,241,0.25));
    filter: blur(28px);
    z-index: 0;
  }
`;

const QuoteDecorator = styled.div`
  position: relative;
  z-index: 1;
  font-family: Georgia, serif;
  font-size: 80px;
  line-height: 0.5;
  color: #F59E0B;
  opacity: 0.25;
  margin-bottom: 8px;
  user-select: none;
`;

const QuoteTextEl = styled.blockquote`
  position: relative;
  z-index: 1;
  font-size: clamp(15px, 2.5vw, 18px);
  color: #F1F5F9;
  font-style: italic;
  line-height: 1.65;
  margin: 0 0 20px;
  font-weight: 500;
`;

const QuoteAuthor = styled.cite`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  font-style: normal;
  background: linear-gradient(135deg, #F59E0B, #EF4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// ─── Bottom CTA ───────────────────────────────────────────────────────────────

const BottomCTA = styled.div`
  text-align: center;
`;

const StartCampaignLink = styled(motion.a)`
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
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(239,68,68,0.28);
  transition: box-shadow 0.2s ease;
  letter-spacing: 0.01em;

  &:hover {
    color: white;
    text-decoration: none;
    box-shadow: 0 8px 28px rgba(239,68,68,0.38);
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const IMPACT_ITEMS = [
  {
    emoji: '🎁',
    title: 'Fund Community Giveaways',
    desc: 'Your gift helps us surprise families with cash, meals, and resources they never expected.',
    bg: 'linear-gradient(145deg, #FEF9C3, #FDE68A)',
    shadow: 'rgba(245,158,11,0.22)',
    accent: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
    delay: '0s',
  },
  {
    emoji: '📹',
    title: 'Power Our Outreach Videos',
    desc: 'We document real acts of kindness. Your support keeps the stories coming and hearts moving.',
    bg: 'linear-gradient(145deg, #DBEAFE, #BFDBFE)',
    shadow: 'rgba(56,189,248,0.22)',
    accent: 'linear-gradient(90deg, #38BDF8, #6366F1)',
    delay: '1s',
  },
  {
    emoji: '🤲',
    title: 'Multiply Every Dollar',
    desc: 'Through community partnerships, every $1 donated creates $3+ in real community impact.',
    bg: 'linear-gradient(145deg, #D1FAE5, #A7F3D0)',
    shadow: 'rgba(34,197,94,0.22)',
    accent: 'linear-gradient(90deg, #22C55E, #06B6D4)',
    delay: '2s',
  },
];

const DONATION_METHODS = [
  {
    platform: 'PayPal',
    handle: 'jbowser727@gmail.com',
    emoji: '💳',
    deepLink: 'https://paypal.me/jbowser727',
    buttonText: 'Send via PayPal',
    accent: 'linear-gradient(90deg, #003087, #009CDE)',
    btnBg: '#003087',
    shadow: 'rgba(0,48,135,0.28)',
    delay: '0s',
  },
  {
    platform: 'Venmo',
    handle: '@HonestNeed',
    emoji: '💜',
    deepLink: 'https://venmo.com/HonestNeed',
    buttonText: 'Send via Venmo',
    accent: 'linear-gradient(90deg, #3D95CE, #5AC8FA)',
    btnBg: '#3D95CE',
    shadow: 'rgba(61,149,206,0.28)',
    delay: '0.1s',
  },
  {
    platform: 'Cash App',
    handle: '$jbowser727',
    emoji: '💚',
    deepLink: 'https://cash.app/$jbowser727',
    buttonText: 'Send via Cash App',
    accent: 'linear-gradient(90deg, #00C244, #00A03B)',
    btnBg: '#00C244',
    shadow: 'rgba(0,194,68,0.28)',
    delay: '0.2s',
  },
  {
    platform: 'Zelle',
    handle: '209-622-9391',
    emoji: '⚡',
    deepLink: null,
    buttonText: 'Copy Number',
    copyValue: '2096229391',
    accent: 'linear-gradient(90deg, #6D1ED4, #9333EA)',
    btnBg: '#6D1ED4',
    shadow: 'rgba(109,30,212,0.28)',
    delay: '0.3s',
  },
  {
    platform: 'Chime',
    handle: '@HonestNeed',
    emoji: '🟡',
    deepLink: null,
    buttonText: 'Copy Handle',
    copyValue: '@HonestNeed',
    accent: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
    btnBg: '#D97706',
    shadow: 'rgba(217,119,6,0.28)',
    delay: '0.4s',
  },
];

// ─── Framer Variants ──────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, delay, ease: [0.2, 0.9, 0.2, 1] } },
});

const gridVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 22, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.2, 0.9, 0.2, 1] } },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SupportMission() {
  const [copiedMethod, setCopiedMethod] = useState(null);

  const handleCopy = (platform, value) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedMethod(platform);
      setTimeout(() => setCopiedMethod(null), 2200);
    }).catch(console.error);
  };

  return (
    <MissionSection id="support-mission">
      <BlobAmber />
      <BlobBlue />
      <BlobGreen />

      <Inner>
        {/* ── Header ──────────────────────────────────────────────── */}
        <Header>
          <Eyebrow {...fadeUp(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            ❤️ Support the Mission
          </Eyebrow>
          <SectionTitle {...fadeUp(0.07)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Help Us <span className="accent">Bless More Communities</span>
          </SectionTitle>
          <SectionSubtitle {...fadeUp(0.14)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Your gift creates giveaways, supports families, and funds the outreach stories that prove kindness still exists.
          </SectionSubtitle>
          <ExplanationText {...fadeUp(0.2)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Every dollar donated goes directly toward community giveaways, surprise blessings, family support events, and the videos that inspire thousands. When you give to our mission, you become part of the story — one act of generosity at a time.
          </ExplanationText>
        </Header>

        {/* ── Impact Cards ────────────────────────────────────────── */}
        <ImpactGrid
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {IMPACT_ITEMS.map((item) => (
            <ImpactCard
              key={item.title}
              variants={cardVariants}
              $accent={item.accent}
              whileHover={{ y: -4, boxShadow: `0 14px 40px ${item.shadow}` }}
            >
              <ImpactIconWrap $bg={item.bg} $shadow={item.shadow} $delay={item.delay}>
                {item.emoji}
              </ImpactIconWrap>
              <ImpactTitle>{item.title}</ImpactTitle>
              <ImpactDesc>{item.desc}</ImpactDesc>
            </ImpactCard>
          ))}
        </ImpactGrid>

        {/* ── Donation Grid — 2 cols mobile / 3 tablet / 5 desktop ─ */}
        <DonationGrid
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {DONATION_METHODS.map((method) => {
            const isCopied = copiedMethod === method.platform;
            return (
              <DonationCard
                key={method.platform}
                variants={cardVariants}
                $accent={method.accent}
                $shadow={method.shadow}
                whileHover={{ y: -4 }}
              >
                <DonationEmoji $delay={method.delay}>{method.emoji}</DonationEmoji>
                <PlatformName>{method.platform}</PlatformName>
                <HandleChip>{method.handle}</HandleChip>

                {method.deepLink ? (
                  <ActionLinkBtn
                    href={method.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    $bg={method.btnBg}
                    $shadow={method.shadow}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    {method.buttonText}
                    <ArrowUpRight size={12} />
                  </ActionLinkBtn>
                ) : (
                  <div style={{ width: '100%', position: 'relative' }}>
                    <ActionBtn
                      onClick={() => handleCopy(method.platform, method.copyValue)}
                      $bg={method.btnBg}
                      $shadow={method.shadow}
                      $copied={isCopied}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      {isCopied ? 'Copied! ✅' : method.buttonText}
                    </ActionBtn>
                    <AnimatePresence>
                      {isCopied && (
                        <CopiedTooltip
                          initial={{ opacity: 0, y: 8, scale: 0.94 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.94 }}
                          transition={{ duration: 0.15 }}
                        >
                          Copied! Open your {method.platform} app and paste.
                        </CopiedTooltip>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </DonationCard>
            );
          })}
        </DonationGrid>

        {/* ── Trust Strip ─────────────────────────────────────────── */}
        <TrustStrip
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48, delay: 0.1 }}
        >
          <TrustItem><FiShield />Secure Payments</TrustItem>
          <TrustItem><FiCheckCircle />100% Direct to Mission</TrustItem>
          <TrustItem><FiHeart />No Hidden Fees</TrustItem>
        </TrustStrip>

        {/* ── Disclaimer ──────────────────────────────────────────── */}
        <Disclaimer>
          * HonestNeed is a for-profit platform. Donations to our mission fund support platform operations, outreach content, and community giveaways directly managed by HonestNeed Inc.
        </Disclaimer>

        {/* ── Quote Block ─────────────────────────────────────────── */}
        <QuoteCard
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.58 }}
        >
          <QuoteDecorator>&ldquo;</QuoteDecorator>
          <QuoteTextEl>
            No amount is too small. A $5 gift today can become part of a $500 community blessing tomorrow. Thank you for believing in this mission.
          </QuoteTextEl>
          <QuoteAuthor>— James Scott Bowser, Founder of HonestNeed</QuoteAuthor>
        </QuoteCard>

        {/* ── Bottom CTA ──────────────────────────────────────────── */}
        <BottomCTA>
          <StartCampaignLink
            href="/campaigns/new"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Start Your Own Campaign →
          </StartCampaignLink>
        </BottomCTA>
      </Inner>
    </MissionSection>
  );
}