import './StageTimeline.css';

const stageMeta = [
  {
    key: 'stage1',
    label: 'Testimony',
    caption: 'Each model responds independently',
    icon: '🗣️',
  },
  {
    key: 'stage2',
    label: 'Cross-review',
    caption: 'Jurors critique and rank peers',
    icon: '🔍',
  },
  {
    key: 'stage3',
    label: 'Verdict',
    caption: 'Chairman synthesizes the outcome',
    icon: '⚖️',
  },
];

export default function StageTimeline({ stageState }) {
  return (
    <div className="stage-timeline">
      {stageMeta.map((stage, index) => {
        const status = stageState?.[stage.key] || 'queued';
        return (
          <div key={stage.key} className="timeline-item">
            {index > 0 && (
              <div
                className={`timeline-connector timeline-connector--${stageState?.[stageMeta[index - 1].key] || 'queued'}`}
              />
            )}
            <div className={`timeline-node timeline-node--${status}`}>
              <span className="timeline-icon">{stage.icon}</span>
              <div className="timeline-pip" />
            </div>
            <div className="timeline-copy">
              <p className="timeline-label">{stage.label}</p>
              <p className="timeline-caption">{stage.caption}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

