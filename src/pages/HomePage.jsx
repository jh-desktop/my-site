import { Link } from 'react-router-dom'
import { projects } from '../data/projects'

export default function HomePage() {
  return (
    <div className="pt-nav content">
      <section className="hero">
        <div className="hero-eyebrow">whoami</div>

        <h1 className="hero-title">
          <span className="name">안녕하세요,<br /></span>
          <span className="accent">박윤재</span>
          <span className="name">입니다.</span>
        </h1>

        <p className="hero-desc">
          아이디어를 <strong>실제로 동작하는 것</strong>으로 만드는 걸 좋아하는 개발자예요.<br />
          React, Firebase, AI API를 주로 활용해 <strong>실용적인 웹 툴</strong>을 만들고 있어요.
        </p>

        <div className="hero-cta">
          <Link to="/projects" className="btn-primary">
            프로젝트 보기 →
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">{projects.length}<span>+</span></div>
            <div className="stat-label">프로젝트</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">2<span>+</span></div>
            <div className="stat-label">라이브 서비스</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">React</div>
            <div className="stat-label">주 스택</div>
          </div>
        </div>
      </section>
    </div>
  )
}
