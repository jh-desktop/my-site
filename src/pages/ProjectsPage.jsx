import { useState } from 'react'
import { projects, CATEGORIES } from '../data/projects'

const ICONS = { tool: '🛠️', ai: '🤖', game: '🎮', default: '📦' }

export default function ProjectsPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)

  return (
    <div className="pt-nav content">
      <div className="projects-page">
        <div className="page-header">
          <h1 className="page-title">프로<span>젝트</span></h1>
          <p className="page-sub">직접 기획하고 만든 웹 서비스들이에요.</p>
        </div>

        <div className="filter-tabs">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={'filter-tab' + (filter === c.key ? ' active' : '')}
              onClick={() => setFilter(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map(p => (
            <div key={p.id} className="project-card">
              <div className="card-top">
                <div className="card-icon">{ICONS[p.category] || ICONS.default}</div>
                <span className="card-status">live</span>
              </div>

              <div>
                <div className="card-name">{p.name}</div>
                <div className="card-name-en">{p.nameEn}</div>
              </div>

              <p className="card-desc">{p.description}</p>

              <div className="card-tech">
                {p.tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
              </div>

              <div className="card-footer">
                <span className="card-cat">{p.category}</span>
                {p.url
                  ? <a href={p.url} target="_blank" rel="noreferrer" className="card-link">
                      바로가기 ↗
                    </a>
                  : <span className="card-no-link">비공개</span>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
