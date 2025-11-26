import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import StageTimeline from './StageTimeline';
import PromptHelper from './PromptHelper';
import './ChatInterface.css';

export default function ChatInterface({
  conversation,
  onSendMessage,
  isLoading,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const heroStats = [
    { label: 'Jurors on duty', value: '4', detail: 'GPT · Gemini · Claude · Grok 4.1' },
    { label: 'Acts per case', value: '3', detail: 'Testimony • Review • Verdict' },
    { label: 'Response style', value: 'Live', detail: 'Streaming updates in-sequence' },
  ];

  const heroTags = ['Stage 1 · Testimony', 'Stage 2 · Cross-review', 'Stage 3 · Final verdict'];

  const HeroPanel = () => (
    <div className="jury-hero">
      <div className="hero-copy">
        <p className="eyebrow">Live deliberation chamber</p>
        <h2>Bring your boldest cases to the LLM Jury</h2>
        <p>
          Each prompt becomes a mini courtroom drama: every model testifies,
          critiques the others, and a chairman delivers the final verdict.
        </p>
        <div className="hero-tags">
          {heroTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="hero-stats">
        {heroStats.map((stat) => (
          <div key={stat.label} className="hero-stat">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <p>{stat.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const latestAssistantMessage = conversation?.messages
    ?.slice()
    .reverse()
    .find((msg) => msg.role === 'assistant');

  const stageState = ['stage1', 'stage2', 'stage3'].reduce(
    (acc, key) => {
      if (!latestAssistantMessage) {
        acc[key] = 'queued';
      } else if (latestAssistantMessage.loading?.[key]) {
        acc[key] = 'running';
      } else if (latestAssistantMessage[key]) {
        acc[key] = 'complete';
      } else {
        acc[key] = 'queued';
      }
      return acc;
    },
    {}
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTemplateSelect = (template) => {
    setInput(template);
  };

  const handleSnippetAppend = (snippet) => {
    setInput((prev) => {
      if (!prev) {
        return snippet;
      }
      return `${prev.trim()}\n${snippet}`;
    });
  };

  if (!conversation) {
    return (
      <div className="chat-interface">
        <HeroPanel />
        <div className="chat-panel">
          <div className="messages-container">
            <div className="empty-state">
              <h2>Welcome to LLM Jury</h2>
              <p>Open a new case or pick an existing conversation to begin.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <HeroPanel />
      {conversation && <StageTimeline stageState={stageState} />}
      <div className="chat-panel">
        <div className="messages-container">
          {conversation.messages.length === 0 ? (
            <div className="empty-state">
              <h2>Draft your opening statement</h2>
              <p>Drop a question or case file to consult the jury.</p>
            </div>
          ) : (
            conversation.messages.map((msg, index) => (
              <div key={index} className="message-group">
                {msg.role === 'user' ? (
                  <div className="user-message">
                    <div className="message-label">You</div>
                    <div className="message-content">
                      <div className="markdown-content">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="assistant-message">
                    <div className="message-label">LLM Jury</div>
                    <div className="assistant-shell">
                      {msg.loading?.stage1 && (
                        <div className="stage-loading">
                          <div className="spinner"></div>
                          <span>
                            Running Stage 1: Collecting individual responses...
                          </span>
                        </div>
                      )}
                      {msg.stage1 && <Stage1 responses={msg.stage1} />}

                      {msg.loading?.stage2 && (
                        <div className="stage-loading">
                          <div className="spinner"></div>
                          <span>Running Stage 2: Peer rankings...</span>
                        </div>
                      )}
                      {msg.stage2 && (
                        <Stage2
                          rankings={msg.stage2}
                          labelToModel={msg.metadata?.label_to_model}
                          aggregateRankings={msg.metadata?.aggregate_rankings}
                        />
                      )}

                      {msg.loading?.stage3 && (
                        <div className="stage-loading">
                          <div className="spinner"></div>
                          <span>Running Stage 3: Final synthesis...</span>
                        </div>
                      )}
                      {msg.stage3 && (
                        <Stage3 finalResponse={msg.stage3} metadata={msg.metadata} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>The jury is deliberating...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      {conversation && (
        <div className="composer">
          <PromptHelper
            onTemplateSelect={handleTemplateSelect}
            onSnippetAppend={handleSnippetAppend}
          />
          <form className="input-form" onSubmit={handleSubmit}>
            <textarea
              className="message-input"
              placeholder="Drop your case file... (Shift+Enter for new line, Enter to send)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={4}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!input.trim() || isLoading}
            >
              Send to jury
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
