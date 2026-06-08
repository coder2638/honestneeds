import Link from 'next/link'
import styled from 'styled-components'
import Button from '@/components/ui/Button'
import { Search, Home, Compass } from 'lucide-react'

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for could not be found.',
}

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);

  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`

const ContentWrapper = styled.div`
  max-width: 28rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: center;
`

const IconSection = styled.div`
  display: flex;
  justify-content: center;
`

const IconWrapper = styled.div`
  position: relative;
`

const IconText = styled.div`
  font-size: 5rem;
  font-weight: 700;
  color: rgba(99, 102, 241, 0.2);
`

const IconOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const SearchIcon = styled(Search)`
  width: 3rem;
  height: 3rem;
  color: rgba(99, 102, 241, 0.6);
`

const MessageSection = styled.div``

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
`

const Description = styled.p`
  margin-top: 0.5rem;
  color: #64748b;
`

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`

const SuggestionBox = styled.div`
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
`

const SuggestionTitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.75rem;
`

const StyledLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6366f1;
  text-decoration: none;
  cursor: pointer;
  border-radius: 0.25rem;
  padding: 0.5rem;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #6366f1;
  }
`

const SupportText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
`

const SupportLink = styled(Link)`
  color: #6366f1;
  text-decoration: none;
  cursor: pointer;
  border-radius: 0.25rem;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #6366f1;
  }
`

export default function NotFound() {
  return (
    <PageContainer>
      <ContentWrapper>
        {/* 404 Icon */}
        <IconSection>
          <IconWrapper>
            <IconText>404</IconText>
            <IconOverlay>
              <SearchIcon />
            </IconOverlay>
          </IconWrapper>
        </IconSection>

        {/* Error Message */}
        <MessageSection>
          <Title>
            Page Not Found
          </Title>
          <Description>
            Sorry, the page you're looking for doesn't exist or has been moved.
          </Description>
        </MessageSection>

        {/* Actions */}
        <ActionsContainer>
          <Button
            variant="primary"
            as="link"
            href="/"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Home size={18} />
            Go Home
          </Button>
          <Button
            variant="outline"
            as="link"
            href="/campaigns"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Compass size={18} />
            Browse Campaigns
          </Button>
        </ActionsContainer>

        {/* Search Suggestion */}
        <SuggestionBox>
          <SuggestionTitle>Or search for campaigns:</SuggestionTitle>
          <StyledLink href="/campaigns">
            <Search size={16} />
            Search campaigns
          </StyledLink>
        </SuggestionBox>

        {/* Support Link */}
        <SupportText>
          Need help?{' '}
          <SupportLink href="/contact">
            Contact us
          </SupportLink>
        </SupportText>
      </ContentWrapper>
    </PageContainer>
  )
}
