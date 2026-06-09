const DOCS = [
  {
    id: 1,
    title: 'Clark Travel Guide',
    desc: '클락 여행 가이드 PPT',
    file: '/clark-travel-guide.pptx',
    icon: '📊',
  },
]

const LINKS = [
  {
    id: 'blog',
    title: '네이버 블로그',
    desc: '일상, 포커, 개발 이야기를 기록하는 블로그',
    url: 'https://blog.naver.com/yoonja_dwan',
    icon: '📝',
  },
  {
    id: 'prime1',
    title: 'Prime Poker 다운로드',
    desc: '다바오 웹 전용 앱 다운로드 페이지',
    url: 'https://muz.so/Prime1',
    icon: '♠️',
  },
  {
    id: 'protonvpn',
    title: 'ProtonVPN 설치파일',
    desc: 'ProtonVPN Windows 64bit v4.4.0',
    url: 'https://protonvpn.com/download/ProtonVPN_v4.4.0_x64.exe',
    icon: '🔒',
    label: '⬇ 설치하기',
  },
  {
    id: 'disney',
    title: '디즈니+ 홈',
    desc: '디즈니플러스 홈페이지 바로가기',
    url: 'https://www.disneyplus.com',
    icon: '🏰',
  },
  {
    id: 'netflix',
    title: '넷플릭스 홈',
    desc: '넷플릭스 홈페이지 바로가기',
    url: 'https://www.netflix.com',
    icon: '🎬',
  },
]

const BASE_URL = 'https://my-site-six-sepia.vercel.app'

export default function DocsPage() {
  return (
    <div className="pt-nav content">
      <div className="projects-page">
        <div className="page-header">
          <h1 className="page-title">참고<span>자료</span></h1>
          <p className="page-sub">공유 문서 및 자료들이에요.</p>
        </div>

        <div className="docs-list">
          {LINKS.map(link => (
            <div key={link.id} className="doc-card">
              <div className="doc-icon">{link.icon}</div>
              <div className="doc-info">
                <div className="doc-title">{link.title}</div>
                <div className="doc-desc">{link.desc}</div>
              </div>
              <div className="doc-actions">
                <a href={link.url} target="_blank" rel="noreferrer" className="card-link">
                  {link.label || '방문하기 ↗'}
                </a>
              </div>
            </div>
          ))}

          {DOCS.map(doc => {
            const fullUrl = `${BASE_URL}${doc.file}`
            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`
            return (
              <div key={doc.id} className="doc-card">
                <div className="doc-icon">{doc.icon}</div>
                <div className="doc-info">
                  <div className="doc-title">{doc.title}</div>
                  <div className="doc-desc">{doc.desc}</div>
                </div>
                <div className="doc-actions">
                  <a href={viewerUrl} target="_blank" rel="noreferrer" className="card-link">
                    보기 ↗
                  </a>
                  <a href={doc.file} download className="card-no-link" style={{ cursor: 'pointer', textDecoration: 'none' }}>
                    ⬇ 다운로드
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
