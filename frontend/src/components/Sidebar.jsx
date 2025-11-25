import './Sidebar.css';

const jurorsOnDuty = [
  { emoji: '🧠', name: 'GPT-5.1', role: 'Strategist' },
  { emoji: '✨', name: 'Gemini 3 Pro', role: 'Visionary' },
  { emoji: '🕊️', name: 'Claude Sonnet 4.5', role: 'Diplomat' },
  { emoji: '⚡', name: 'Grok 4', role: 'Wildcard' },
];

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}) {
  const openCases = conversations.length;
  const totalMessages = conversations.reduce(
    (sum, conv) => sum + (conv.message_count || 0),
    0
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-identity">
          <span className="logo-mark">⚖️</span>
          <div>
            <p className="logo-eyebrow">Interactive court</p>
            <h1>LLM Jury</h1>
          </div>
        </div>
        <p className="sidebar-tagline">
          Bring your trickiest prompts to trial and watch the models deliberate.
        </p>
        <button className="new-conversation-btn" onClick={onNewConversation}>
          + Open a new case
        </button>
      </div>

      <div className="sidebar-info-card">
        <div className="sidebar-stats">
          <div className="stat-card">
            <span className="stat-label">Open cases</span>
            <strong>{openCases}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Jurors</span>
            <strong>{jurorsOnDuty.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Delibs logged</span>
            <strong>{totalMessages}</strong>
          </div>
        </div>

        <div className="sidebar-jurors">
          <p className="section-label">Jurors on call</p>
          <div className="juror-chip-list">
            {jurorsOnDuty.map((juror) => (
              <div key={juror.name} className="juror-chip">
                <span className="juror-emoji">{juror.emoji}</span>
                <div>
                  <p className="juror-name">{juror.name}</p>
                  <p className="juror-role">{juror.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="conversation-section">
        <div className="section-header">
          <p className="section-label">Case files</p>
          <span className="section-hint">Click to revisit a verdict</span>
        </div>
        <div className="conversation-list">
          {conversations.length === 0 ? (
            <div className="no-conversations">
              No cases yet — spin up your first trial.
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${
                  conv.id === currentConversationId ? 'active' : ''
                }`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="conversation-title">
                  {conv.title || 'Untitled case'}
                </div>
                <div className="conversation-meta">
                  <span>{conv.message_count} messages</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="sidebar-tip">
        <p>💡 Pro tip: The jury thrives on oddly specific cases.</p>
        <p className="tip-subtext">Add context, evidence, or wild hypotheticals.</p>
      </div>
    </div>
  );
}
