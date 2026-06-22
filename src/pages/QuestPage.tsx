import { useState } from 'react';
import {
  GameFrame,
  GameScreen,
  GameHeader,
  GameBody,
  GameFooter,
  BottomNav,
  PageTitle,
  TabBar,
  GamePanel,
  GameButton,
  ProgressBar,
  AncientIcon,
} from '@/components';
import { PlayerHeader } from '@/components/game/PlayerHeader';
import { useGameStore } from '@/stores/gameStore';
import { useGameNav } from '@/hooks/useGameNav';
import { ACTIVITY_MILESTONES } from '@/data/quests';
import type { QuestType } from '@/types/game';

const QUEST_TABS: { id: QuestType; label: string }[] = [
  { id: 'daily', label: 'Hàng ngày' },
  { id: 'main', label: 'Chính tuyến' },
  { id: 'achievement', label: 'Thành tựu' },
];

export function QuestPage() {
  const player = useGameStore((s) => s.player)!;
  const claimQuest = useGameStore((s) => s.claimQuest);
  const claimActivityMilestone = useGameStore((s) => s.claimActivityMilestone);
  const { activeNav, navItems, handleNav } = useGameNav();
  const [tab, setTab] = useState<QuestType>('daily');

  const quests = player.quests.filter((q) => q.type === tab);

  return (
    <GameFrame>
      <GameScreen>
        <GameHeader><PlayerHeader /></GameHeader>

        <GameBody>
          <PageTitle title="Nhiệm vụ" showOrnament />

          <GamePanel title={`Điểm hoạt động: ${player.activityPoints}`}>
            <ProgressBar current={player.activityPoints} max={100} labelLeft="0" labelRight="100" />
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {ACTIVITY_MILESTONES.map((pts) => {
                const claimed = player.claimedMilestones.includes(pts);
                const canClaim = player.activityPoints >= pts && !claimed;
                return (
                  <GameButton
                    key={pts}
                    variant={canClaim ? 'claim' : 'secondary'}
                    style={{ fontSize: 10, padding: '4px 8px' }}
                    onClick={() => claimActivityMilestone(pts)}
                    disabled={claimed || !canClaim}
                  >
                    {claimed && <AncientIcon name="check" size={11} />} {pts}
                  </GameButton>
                );
              })}
            </div>
          </GamePanel>

          <TabBar
            tabs={QUEST_TABS.map((t) => ({ id: t.id, label: t.label }))}
            activeId={tab}
            onChange={(id) => setTab(id as QuestType)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {quests.map((q) => {
              const done = q.progress >= q.target;
              const canClaim = done && !q.claimed;
              return (
                <div key={q.id} className="list-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="entity-icon entity-icon--sm">{q.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-gold)' }}>{q.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{q.description}</div>
                    </div>
                    {canClaim ? (
                      <GameButton variant="claim" onClick={() => claimQuest(q.id)} style={{ fontSize: 10 }}>
                        Nhận
                      </GameButton>
                    ) : q.claimed ? (
                      <span style={{ fontSize: 10, color: 'var(--green-stat)' }}>Đã nhận</span>
                    ) : (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {q.progress}/{q.target}
                      </span>
                    )}
                  </div>
                  <ProgressBar current={q.progress} max={q.target} />
                </div>
              );
            })}
          </div>
        </GameBody>

        <GameFooter>
          <BottomNav items={navItems} activeId={activeNav} onChange={handleNav} />
        </GameFooter>
      </GameScreen>
    </GameFrame>
  );
}
