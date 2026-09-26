import { QuickTriageEngine } from '@/components/triage/QuickTriageEngine';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';

export default function Home() {
  return (
    <div className="space-y-8">
      <QuickTriageEngine />
      <KanbanBoard />
    </div>
  );
}
