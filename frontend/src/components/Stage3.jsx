import ReactMarkdown from 'react-markdown';
import './Stage3.css';

const consensusProfiles = [
  {
    id: 'aligned',
    label: 'Strong consensus',
    tone: 'good',
    description: 'Jurors largely agreed on the top direction.',
    threshold: 0.6,
  },
  {
    id: 'mixed',
    label: 'Mixed opinions',
    tone: 'warn',
    description: 'Models diverged but found partial overlap.',
    threshold: 1.2,
  },
  {
    id: 'split',
    label: 'Split jury',
    tone: 'alert',
    description: 'Expect contrasting recommendations and caveats.',
    threshold: Infinity,
  },
];

function deriveConsensus(metadata) {
  const rankings = metadata?.aggregate_rankings;
  if (!rankings || rankings.length < 2) {
    return {
      profile: {
        id: 'pending',
        label: 'Awaiting judgement',
        tone: 'neutral',
        description: 'More signals needed to gauge consensus.',
      },
      leaders: [],
    };
  }

  const spread =
    rankings[rankings.length - 1].average_rank - rankings[0].average_rank;
  const profile =
    consensusProfiles.find((p) => spread <= p.threshold) ||
    consensusProfiles[consensusProfiles.length - 1];

  return {
    profile,
    leaders: rankings.slice(0, 3),
  };
}

export default function Stage3({ finalResponse, metadata }) {
  if (!finalResponse) {
    return null;
  }

  const consensus = deriveConsensus(metadata);

  return (
    <div className="stage stage3">
      <div className="stage-heading">
        <span className="stage-pill stage-pill--three">Stage 3</span>
        <div>
          <h3>Final verdict</h3>
          <p>
            The presiding chairman synthesizes the debate into a unified answer,
            plus a pulse on how aligned the jury felt.
          </p>
        </div>
      </div>

      <div className="verdict-meta">
        <div className={`consensus-badge consensus-badge--${consensus.profile.tone}`}>
          <span>{consensus.profile.label}</span>
          <p>{consensus.profile.description}</p>
        </div>
        {consensus.leaders.length > 0 && (
          <div className="leader-stack">
            <span className="leader-label">Top ranked jurors</span>
            <div className="leader-chips">
              {consensus.leaders.map((leader) => (
                <div key={leader.model} className="leader-chip">
                  <span>{leader.model.split('/')[1] || leader.model}</span>
                  <small>Avg {leader.average_rank.toFixed(2)}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="final-response">
        <div className="chairman-label">
          Chairman: {finalResponse.model.split('/')[1] || finalResponse.model}
        </div>
        <div className="final-text markdown-content">
          <ReactMarkdown>{finalResponse.response}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
