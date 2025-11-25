import './PromptHelper.css';

const promptModes = [
  {
    id: 'cross',
    label: 'Cross-exam',
    description: 'Challenge assumptions and surface contradictions.',
    template: `Act like a skeptical analyst. Examine the following situation and list hidden risks, missing data, and assumptions to test:\n\nContext:\n- `,
  },
  {
    id: 'brainstorm',
    label: 'Brainstorm',
    description: 'Generate bold, divergent ideas with pros and cons.',
    template: `I need a blue-sky brainstorm. Offer at least 4 creative directions, each with potential upside, risks, and concrete next steps. Topic:\n- `,
  },
  {
    id: 'research',
    label: 'Research memo',
    description: 'Summarize evidence-backed insights and citations.',
    template: `Compile a concise research memo covering:\n1. Key facts or statistics\n2. Contrasting expert opinions\n3. Actionable recommendations\n\nSubject: `,
  },
];

const contextSnippets = [
  'Consider user personas and constraints.',
  'Highlight ethical or societal impacts.',
  'Note resource, time, or compliance limits.',
  'Compare with historical or competitive benchmarks.',
];

export default function PromptHelper({ onTemplateSelect, onSnippetAppend }) {
  return (
    <div className="prompt-helper">
      <div className="prompt-header">
        <p className="prompt-eyebrow">Case builder</p>
        <h4>Shape the brief</h4>
        <p className="prompt-subtitle">
          Pick a mode or drop in context hints to steer the jury.
        </p>
      </div>
      <div className="prompt-grid">
        {promptModes.map((mode) => (
          <button
            key={mode.id}
            className="prompt-card"
            type="button"
            onClick={() => onTemplateSelect(mode.template)}
          >
            <span className="prompt-label">{mode.label}</span>
            <p>{mode.description}</p>
          </button>
        ))}
      </div>
      <div className="snippet-row">
        {contextSnippets.map((snippet) => (
          <button
            key={snippet}
            className="snippet-chip"
            type="button"
            onClick={() => onSnippetAppend(snippet)}
          >
            {snippet}
          </button>
        ))}
      </div>
    </div>
  );
}

