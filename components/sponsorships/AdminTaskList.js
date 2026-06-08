'use client'

import React from 'react'
import styled from 'styled-components'
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, TRANSITIONS } from '@/styles/tokens'
import { CheckCircle2, Circle, Clock } from 'lucide-react'

const TaskListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SPACING[2]};
`

const TaskItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${SPACING[3]};
  padding: ${SPACING[3]};
  border-radius: ${BORDER_RADIUS.MD};
  background: ${(props) => (props.$complete ? COLORS.SUCCESS_BG : COLORS.BG)};
  border: 1px solid ${(props) => (props.$complete ? COLORS.SUCCESS_LIGHT : COLORS.BORDER)};
  transition: all ${TRANSITIONS.BASE};
  cursor: ${(props) => (props.$complete ? 'default' : 'pointer')};

  &:hover {
    border-color: ${(props) => (props.$complete ? COLORS.SUCCESS : COLORS.PRIMARY_LIGHT)};
  }
`

const TaskCheckbox = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${(props) => (props.$complete ? COLORS.SUCCESS : COLORS.MUTED)};
  transition: color ${TRANSITIONS.FAST};
  flex-shrink: 0;
  margin-top: 1px;

  &:hover {
    color: ${(props) => (props.$complete ? COLORS.SUCCESS_DARK : COLORS.PRIMARY)};
  }
`

const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`

const TaskText = styled.span`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  color: ${(props) => (props.$complete ? COLORS.MUTED_TEXT : COLORS.TEXT)};
  text-decoration: ${(props) => (props.$complete ? 'line-through' : 'none')};
  line-height: ${TYPOGRAPHY.LINE_HEIGHT_NORMAL};
`

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${SPACING[1]};
  margin-top: ${SPACING[1]};
  font-size: ${TYPOGRAPHY.SIZE_XS};
  color: ${COLORS.MUTED};
`

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${COLORS.DISABLED};
  border-radius: ${BORDER_RADIUS.FULL};
  overflow: hidden;
  margin-bottom: ${SPACING[3]};
`

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${COLORS.SUCCESS} 0%, ${COLORS.SUCCESS_DARK} 100%);
  border-radius: ${BORDER_RADIUS.FULL};
  width: ${(props) => props.$percent}%;
  transition: width 0.4s ease;
`

const ProgressLabel = styled.div`
  font-size: ${TYPOGRAPHY.SIZE_SM};
  font-weight: ${TYPOGRAPHY.WEIGHT_MEDIUM};
  color: ${COLORS.MUTED_TEXT};
  margin-bottom: ${SPACING[2]};
  display: flex;
  justify-content: space-between;
`

export default function AdminTaskList({ tasks = [], onCompleteTask, loading = false }) {
  const completedCount = tasks.filter((t) => t.isComplete).length
  const totalCount = tasks.length
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div>
      <ProgressLabel>
        <span>Tasks Progress</span>
        <span>{completedCount}/{totalCount} complete</span>
      </ProgressLabel>
      <ProgressBar>
        <ProgressFill $percent={percent} />
      </ProgressBar>

      <TaskListContainer>
        {tasks.map((task, index) => (
          <TaskItem
            key={task._id || index}
            $complete={task.isComplete}
            onClick={() => !task.isComplete && !loading && onCompleteTask?.(index)}
          >
            <TaskCheckbox
              $complete={task.isComplete}
              disabled={task.isComplete || loading}
              onClick={(e) => {
                e.stopPropagation()
                if (!task.isComplete && !loading) onCompleteTask?.(index)
              }}
            >
              {task.isComplete ? <CheckCircle2 size={20} /> : <Circle size={20} />}
            </TaskCheckbox>
            <TaskContent>
              <TaskText $complete={task.isComplete}>{task.taskDescription}</TaskText>
              {task.isComplete && task.completedAt && (
                <TaskMeta>
                  <Clock size={10} />
                  Completed {new Date(task.completedAt).toLocaleDateString()}
                </TaskMeta>
              )}
            </TaskContent>
          </TaskItem>
        ))}
      </TaskListContainer>
    </div>
  )
}
