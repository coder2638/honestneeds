'use client';

import styled from 'styled-components';
import { GripVertical, X, Layout } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * Dashboard Customizer Component
 * Allows users to customize dashboard layout by enabling/disabling widgets and drag-and-drop reordering
 */

export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  position?: number;
  size?: 'small' | 'medium' | 'large';
}

interface DashboardCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  widgets: DashboardWidget[];
  onSave?: (widgets: DashboardWidget[]) => Promise<void>;
  onReset?: () => Promise<void>;
}

const Overlay = styled.div<{ isOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transition: opacity 200ms;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: slideUp 300ms ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @media (max-width: 768px) {
    width: 95%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }
`;

const Content = styled.div`
  padding: 24px;
  flex: 1;
`;

const Section = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px 0;
`;

const WidgetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WidgetItem = styled.div<{ isDragging?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: ${(props) => (props.isDragging ? '#eff6ff' : 'white')};
  cursor: ${(props) => (props.isDragging ? 'grabbing' : 'grab')};
  transition: all 200ms;
  user-select: none;

  &:hover {
    border-color: #3b82f6;
    background: #f9fafb;
  }

  &.dragging {
    opacity: 0.5;
  }
`;

const DragHandle = styled(GripVertical)`
  flex-shrink: 0;
  color: #9ca3af;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const WidgetToggle = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
  flex-shrink: 0;
`;

const WidgetInfo = styled.div`
  flex: 1;
`;

const WidgetTitle = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: #1f2937;
  margin-bottom: 2px;
`;

const WidgetDescription = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const SizeSelector = styled.select`
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  color: #1f2937;
  background: white;
  cursor: pointer;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #0c2d6b;
  line-height: 1.5;
`;

const WarningBox = styled.div`
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #92400e;
  line-height: 1.5;
`;

const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms;

  ${(props) => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;

          &:hover {
            background: #2563eb;
          }

          &:active {
            background: #1d4ed8;
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;

          &:hover {
            background: #dc2626;
          }

          &:active {
            background: #b91c1c;
          }
        `;
      default:
        return `
          background: #e5e7eb;
          color: #1f2937;

          &:hover {
            background: #d1d5db;
          }

          &:active {
            background: #bfdbfe;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function DashboardCustomizer({
  isOpen,
  onClose,
  widgets,
  onSave,
  onReset,
}: DashboardCustomizerProps) {
  const [localWidgets, setLocalWidgets] = useState<DashboardWidget[]>(widgets);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalWidgets(widgets);
  }, [widgets, isOpen]);

  const handleToggleWidget = (id: string) => {
    setLocalWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const handleSizeChange = (id: string, size: 'small' | 'medium' | 'large') => {
    setLocalWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIndex = localWidgets.findIndex((w) => w.id === draggedItem);
    const targetIndex = localWidgets.findIndex((w) => w.id === targetId);

    const newWidgets = [...localWidgets];
    const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, draggedWidget);

    setLocalWidgets(newWidgets);
    setDraggedItem(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(localWidgets);
      }
      onClose();
    } catch (error) {
      console.error('Error saving customization:', error);
      alert('Failed to save customization. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm('Reset dashboard to default layout?')) {
      try {
        if (onReset) {
          await onReset();
        }
        onClose();
      } catch (error) {
        console.error('Error resetting dashboard:', error);
        alert('Failed to reset dashboard. Please try again.');
      }
    }
  };

  const enabledCount = localWidgets.filter((w) => w.enabled).length;

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <Layout size={20} />
            Customize Dashboard
          </Title>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </CloseButton>
        </Header>

        <Content>
          {/* Info Box */}
          <Section>
            <InfoBox>
              💡 Drag widgets to reorder them on your dashboard. Toggle checkboxes to show/hide widgets.
              You have <strong>{enabledCount}</strong> widget{enabledCount !== 1 ? 's' : ''} enabled.
            </InfoBox>
          </Section>

          {/* Widget List */}
          <Section>
            <SectionTitle>Dashboard Widgets</SectionTitle>
            <WidgetList>
              {localWidgets.map((widget) => (
                <WidgetItem
                  key={widget.id}
                  draggable
                  onDragStart={() => handleDragStart(widget.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(widget.id)}
                  className={draggedItem === widget.id ? 'dragging' : ''}
                >
                  <DragHandle size={18} />

                  <WidgetToggle
                    type="checkbox"
                    checked={widget.enabled}
                    onChange={() => handleToggleWidget(widget.id)}
                    disabled={enabledCount === 1 && widget.enabled}
                    title={
                      enabledCount === 1 && widget.enabled
                        ? 'At least one widget must be enabled'
                        : ''
                    }
                  />

                  <WidgetInfo>
                    <WidgetTitle>{widget.title}</WidgetTitle>
                    <WidgetDescription>{widget.description}</WidgetDescription>
                  </WidgetInfo>

                  <SizeSelector
                    value={widget.size || 'medium'}
                    onChange={(e) =>
                      handleSizeChange(widget.id, e.target.value as 'small' | 'medium' | 'large')
                    }
                    disabled={!widget.enabled}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </SizeSelector>
                </WidgetItem>
              ))}
            </WidgetList>
          </Section>

          {/* Warning */}
          <Section>
            <WarningBox>
              ⚠️ Changes will be saved to your account and applied across all devices.
            </WarningBox>
          </Section>
        </Content>

        <Footer>
          <Button onClick={handleReset}>Reset to Default</Button>
          <Button onClick={onClose}>Cancel</Button>
          <Button $variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
}
