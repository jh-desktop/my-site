import { useState, useEffect, useMemo } from 'react'
import './FrameworkPage.css'

/* ── 간이 신택스 하이라이터 ───────────────── */
function hl(raw, lang) {
  let h = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 주석 (먼저 처리 — 내부 패턴 무시)
  h = h.replace(/(\/\/[^\n]*)/g, '<em class="tc">$1</em>')
  h = h.replace(/(\/\*[\s\S]*?\*\/)/g, '<em class="tc">$1</em>')
  h = h.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<em class="tc">$1</em>')

  // 문자열
  h = h.replace(/(`[^`\n]*`|"[^"\n]*"|'[^'\n]*')/g, '<em class="ts">$1</em>')

  if (lang === 'vue') {
    // Vue 디렉티브
    h = h.replace(/\b(v-[a-zA-Z:-]+|@[a-zA-Z:-]+)/g, '<em class="td">$1</em>')
    h = h.replace(/(?<==")([^"<]+)(?=")/g, '<em class="tv">$1</em>')
    // Composition API
    h = h.replace(
      /\b(ref|reactive|computed|watch|watchEffect|onMounted|onUnmounted|onUpdated|defineProps|defineEmits|defineComponent|nextTick)\b/g,
      '<em class="th">$1</em>'
    )
    // 템플릿 태그
    h = h.replace(/(&lt;\/?)(template|script|style)(&gt;|\s)/g, '<em class="tg">$1$2</em>$3')
  } else {
    // React Hooks
    h = h.replace(
      /\b(useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useLayoutEffect)\b/g,
      '<em class="th">$1</em>'
    )
    // JSX 컴포넌트 태그
    h = h.replace(/(&lt;\/?[A-Z][a-zA-Z]*)/g, '<em class="tg">$1</em>')
  }

  // 키워드
  h = h.replace(
    /\b(const|let|var|function|return|import|from|export|default|async|await|if|else|class|new|true|false|null|undefined|of|in|=&gt;)\b/g,
    '<em class="tk">$1</em>'
  )

  // 숫자
  h = h.replace(/\b(\d+)\b/g, '<em class="tn">$1</em>')

  return h
}

/* ── CodePanel ─────────────────────────────── */
function CodePanel({ lang, code }) {
  const [copied, setCopied] = useState(false)
  const isVue = lang === 'vue'

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`fw-panel ${isVue ? 'vue' : 'react'}`}>
      <div className="fw-panel-head">
        <span className={`fw-badge ${isVue ? 'vue' : 'react'}`}>
          <span className="fw-badge-dot" />
          {isVue ? 'Vue 3' : 'React 19'}
        </span>
        <button className="fw-copy-btn" onClick={copy}>
          {copied ? '✓ 복사됨' : '복사'}
        </button>
      </div>
      <pre className="fw-pre">
        <code dangerouslySetInnerHTML={{ __html: hl(code, lang) }} />
      </pre>
    </div>
  )
}

/* ── 특징 비교 행 ────────────────────────────── */
function Highlights({ items }) {
  return (
    <div className="fw-highlights">
      {items.map((item, i) => (
        <div key={i} className={`fw-hl-item ${item.lang}`}>
          <span className={`fw-hl-badge ${item.lang}`}>{item.lang === 'vue' ? 'Vue' : 'React'}</span>
          <span className="fw-hl-text">{item.text}</span>
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════
   DEMO COMPONENTS
══════════════════════════════════════════════ */

function CounterDemo() {
  const [count, setCount] = useState(0)
  const color = count > 0 ? 'var(--green)' : count < 0 ? '#f87171' : 'var(--muted2)'
  return (
    <div className="demo-row">
      <button className="demo-btn" onClick={() => setCount(c => c - 1)}>−</button>
      <span className="demo-count" style={{ color }}>{count}</span>
      <button className="demo-btn" onClick={() => setCount(c => c + 1)}>+</button>
      <button className="demo-btn ghost" onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}

function BindingDemo() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('upper')
  const transformed = useMemo(() => {
    if (!text) return ''
    return mode === 'upper' ? text.toUpperCase()
         : mode === 'lower' ? text.toLowerCase()
         : text.split('').reverse().join('')
  }, [text, mode])

  return (
    <div className="demo-binding">
      <input
        className="demo-input"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="텍스트를 입력하세요..."
      />
      <div className="demo-modes">
        {['upper', 'lower', 'reverse'].map(m => (
          <button
            key={m}
            className={`demo-mode-btn ${mode === m ? 'active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m === 'upper' ? 'ABC' : m === 'lower' ? 'abc' : '↔'}
          </button>
        ))}
      </div>
      <div className="demo-preview">
        {transformed
          ? <span style={{ color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{transformed}</span>
          : <span style={{ color: 'var(--muted)' }}>변환 결과가 여기에 표시됩니다</span>
        }
      </div>
    </div>
  )
}

const INITIAL_TASKS = [
  { id: 1, text: 'React useState 이해하기', done: true,  tag: 'React' },
  { id: 2, text: 'Vue ref/reactive 이해하기', done: false, tag: 'Vue' },
  { id: 3, text: 'Composition API 비교', done: false, tag: 'Vue' },
  { id: 4, text: 'Hooks 패턴 분석', done: true,  tag: 'React' },
  { id: 5, text: '프로젝트에 적용하기', done: false, tag: '공통' },
]

function ListDemo() {
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [filter, setFilter] = useState('all')

  const toggle = id => setTasks(prev =>
    prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
  )

  const filtered = useMemo(() =>
    filter === 'done' ? tasks.filter(t => t.done)
    : filter === 'todo' ? tasks.filter(t => !t.done)
    : tasks,
    [tasks, filter]
  )

  const doneCount = tasks.filter(t => t.done).length

  return (
    <div className="demo-list">
      <div className="demo-list-top">
        <div className="demo-filters">
          {[['all','전체'], ['todo','미완료'], ['done','완료']].map(([v, l]) => (
            <button
              key={v}
              className={`demo-filter ${filter === v ? 'active' : ''}`}
              onClick={() => setFilter(v)}
            >{l}</button>
          ))}
        </div>
        <span className="demo-progress">{doneCount}/{tasks.length}</span>
      </div>
      <ul className="demo-items">
        {filtered.map(task => (
          <li key={task.id} className={`demo-item ${task.done ? 'done' : ''}`} onClick={() => toggle(task.id)}>
            <span className="demo-check">{task.done ? '✓' : '○'}</span>
            <span className="demo-item-text">{task.text}</span>
            <span className={`demo-tag tag-${task.tag === 'React' ? 'r' : task.tag === 'Vue' ? 'v' : 'c'}`}>
              {task.tag}
            </span>
          </li>
        ))}
      </ul>
      <div className="demo-list-bar">
        <div className="demo-bar-fill" style={{ width: `${(doneCount / tasks.length) * 100}%` }} />
      </div>
    </div>
  )
}

function LifecycleDemo() {
  const [running, setRunning] = useState(true)
  const [time, setTime] = useState(new Date())
  const [events, setEvents] = useState([{ type: 'mount', msg: 'onMounted / useEffect([]) 실행' }])

  const addEvent = msg => setEvents(prev => [...prev.slice(-5), { type: 'log', msg }])

  useEffect(() => {
    if (!running) {
      addEvent('watch/useEffect — running 변경 감지 → 타이머 중지')
      return
    }
    addEvent('watch/useEffect — running 변경 감지 → 타이머 시작')
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => {
      addEvent('cleanup 실행 (onUnmounted / return fn)')
      clearInterval(id)
    }
  }, [running])

  const fmt = d => d.toLocaleTimeString('ko-KR')

  return (
    <div className="demo-lifecycle">
      <div className="demo-lc-top">
        <div className="demo-clock">{fmt(time)}</div>
        <button
          className={`demo-btn ${running ? 'stop' : ''}`}
          onClick={() => setRunning(r => !r)}
        >
          {running ? '⏸ 정지' : '▶ 시작'}
        </button>
      </div>
      <div className="demo-event-log">
        <div className="demo-log-title">라이프사이클 이벤트 로그</div>
        {events.map((e, i) => (
          <div key={i} className={`demo-log-line ${e.type}`}>
            <span className="demo-log-dot" />
            <span>{e.msg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   예제 데이터
══════════════════════════════════════════════ */

const EXAMPLES = [
  {
    id: 'state',
    num: '01',
    title: '반응형 상태 관리',
    desc: '데이터가 변경될 때 UI가 자동으로 업데이트되는 핵심 메커니즘의 차이',
    vueCode: `<template>
  <div class="counter">
    <button @click="decrement">−</button>
    <span :class="countColor">{{ count }}</span>
    <button @click="increment">+</button>
    <button @click="count = 0">Reset</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const count = ref(0)
const increment = () => count.value++
const decrement = () => count.value--

const countColor = computed(() =>
  count.value > 0 ? 'positive' :
  count.value < 0 ? 'negative' : 'zero'
)
</script>`,
    reactCode: `import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  const countColor =
    count > 0 ? 'positive' :
    count < 0 ? 'negative' : 'zero'

  return (
    <div className="counter">
      <button onClick={() => setCount(c => c - 1)}>−</button>
      <span className={countColor}>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  )
}`,
    Demo: CounterDemo,
    highlights: [
      { lang: 'vue',   text: 'ref()로 감싸고 .value로 접근. 템플릿에서는 자동 언래핑. computed()로 파생값 선언.' },
      { lang: 'react', text: '[값, 세터] 구조분해. 세터 호출 시 리렌더. 파생값은 렌더 중 인라인 계산.' },
    ],
  },
  {
    id: 'binding',
    num: '02',
    title: '양방향 데이터 바인딩',
    desc: '입력값과 상태를 연결하는 방식 — Vue의 v-model vs React의 제어 컴포넌트 패턴',
    vueCode: `<template>
  <input v-model="text" placeholder="입력..." />

  <div class="modes">
    <button
      v-for="m in modes"
      :key="m.value"
      :class="{ active: mode === m.value }"
      @click="mode = m.value"
    >{{ m.label }}</button>
  </div>

  <p>{{ transformed }}</p>
</template>

<script setup>
import { ref, computed } from 'vue'

const text = ref('')
const mode = ref('upper')
const modes = [
  { value: 'upper', label: 'ABC' },
  { value: 'lower', label: 'abc' },
  { value: 'reverse', label: '↔' },
]

const transformed = computed(() => {
  if (!text.value) return ''
  if (mode.value === 'upper') return text.value.toUpperCase()
  if (mode.value === 'lower') return text.value.toLowerCase()
  return text.value.split('').reverse().join('')
})
</script>`,
    reactCode: `import { useState, useMemo } from 'react'

function BindingDemo() {
  const [text, setText] = useState('')
  const [mode, setMode] = useState('upper')

  const modes = [
    { value: 'upper', label: 'ABC' },
    { value: 'lower', label: 'abc' },
    { value: 'reverse', label: '↔' },
  ]

  const transformed = useMemo(() => {
    if (!text) return ''
    if (mode === 'upper') return text.toUpperCase()
    if (mode === 'lower') return text.toLowerCase()
    return text.split('').reverse().join('')
  }, [text, mode])

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="입력..."
      />
      <div className="modes">
        {modes.map(m => (
          <button
            key={m.value}
            className={mode === m.value ? 'active' : ''}
            onClick={() => setMode(m.value)}
          >{m.label}</button>
        ))}
      </div>
      <p>{transformed}</p>
    </>
  )
}`,
    Demo: BindingDemo,
    highlights: [
      { lang: 'vue',   text: 'v-model은 :value + @input 단축 문법. 한 줄로 양방향 바인딩 완성.' },
      { lang: 'react', text: 'value + onChange를 명시적으로 연결. 제어 컴포넌트(Controlled) 패턴 강제.' },
    ],
  },
  {
    id: 'list',
    num: '03',
    title: '리스트 렌더링 + 계산된 필터',
    desc: 'v-for 디렉티브 vs JavaScript .map(). useMemo vs computed의 메모이제이션 비교',
    vueCode: `<template>
  <div class="filters">
    <button
      v-for="f in filters" :key="f.value"
      :class="{ active: filter === f.value }"
      @click="filter = f.value"
    >{{ f.label }}</button>
  </div>

  <ul>
    <li
      v-for="task in filteredTasks"
      :key="task.id"
      :class="{ done: task.done }"
      @click="toggle(task.id)"
    >
      <span>{{ task.done ? '✓' : '○' }}</span>
      {{ task.text }}
      <span class="tag">{{ task.tag }}</span>
    </li>
  </ul>
</template>

<script setup>
import { ref, computed } from 'vue'

const filter = ref('all')
const tasks = ref([/* ... */])

const filteredTasks = computed(() =>
  filter.value === 'done' ? tasks.value.filter(t => t.done)
  : filter.value === 'todo' ? tasks.value.filter(t => !t.done)
  : tasks.value
)

const toggle = (id) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.done = !task.done  // 직접 변이 가능
}
</script>`,
    reactCode: `import { useState, useMemo } from 'react'

function TaskList() {
  const [tasks, setTasks] = useState([/* ... */])
  const [filter, setFilter] = useState('all')

  const filteredTasks = useMemo(() =>
    filter === 'done' ? tasks.filter(t => t.done)
    : filter === 'todo' ? tasks.filter(t => !t.done)
    : tasks,
    [tasks, filter]  // 의존성 명시 필요
  )

  const toggle = (id) => {
    setTasks(prev =>   // 불변 업데이트
      prev.map(t =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    )
  }

  return (
    <>
      <div className="filters">
        {filters.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}>
            {f.label}
          </button>
        ))}
      </div>
      <ul>
        {filteredTasks.map(task => (
          <li key={task.id} onClick={() => toggle(task.id)}>
            {task.text}
          </li>
        ))}
      </ul>
    </>
  )
}`,
    Demo: ListDemo,
    highlights: [
      { lang: 'vue',   text: 'v-for로 선언적 반복. 반응형 배열은 직접 변이(push, splice) 가능. computed 자동 추적.' },
      { lang: 'react', text: '.map()은 순수 JS. 상태 불변 원칙 — 항상 새 배열 반환. useMemo에 의존성 명시.' },
    ],
  },
  {
    id: 'lifecycle',
    num: '04',
    title: '생명주기와 사이드 이펙트',
    desc: 'onMounted / watch vs useEffect — 컴포넌트 마운트, 정리(cleanup), 의존성 추적 비교',
    vueCode: `<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const running = ref(true)
const time = ref(new Date())
let timer = null

// 마운트 시 1회 실행
onMounted(() => {
  console.log('컴포넌트 마운트됨')
  startTimer()
})

// 언마운트 시 정리
onUnmounted(() => {
  clearInterval(timer)
  console.log('cleanup 실행')
})

// running 변화 감지
watch(running, (newVal) => {
  clearInterval(timer)
  if (newVal) startTimer()
})

function startTimer() {
  timer = setInterval(() => {
    time.value = new Date()
  }, 1000)
}
</script>`,
    reactCode: `import { useState, useEffect } from 'react'

function LifecycleDemo() {
  const [running, setRunning] = useState(true)
  const [time, setTime] = useState(new Date())

  // [] → 마운트/언마운트
  // [running] → running 변화 시 재실행
  useEffect(() => {
    console.log('effect 실행, running:', running)
    if (!running) return

    const id = setInterval(() => {
      setTime(new Date())
    }, 1000)

    // cleanup — 다음 effect 전 or 언마운트 시
    return () => {
      clearInterval(id)
      console.log('cleanup 실행')
    }
  }, [running])  // 의존성 배열

  return <div>{time.toLocaleTimeString()}</div>
}`,
    Demo: LifecycleDemo,
    highlights: [
      { lang: 'vue',   text: 'onMounted/onUnmounted/watch를 목적별로 분리. watch는 의존성을 자동으로 추적.' },
      { lang: 'react', text: 'useEffect 하나로 마운트+업데이트+cleanup 통합. 의존성 배열을 수동으로 명시해야 함.' },
    ],
  },
]

/* ── 하단 요약 테이블 ─────────────────────── */
const SUMMARY = [
  { feature: '학습 곡선',      vue: '✓ 완만 — HTML 친화적',     react: '△ 중간 — JS 깊이 요구' },
  { feature: '상태 선언',      vue: 'ref() / reactive()',        react: 'useState()' },
  { feature: '파생값',         vue: 'computed() 자동추적',       react: 'useMemo() 수동 의존성' },
  { feature: '사이드이펙트',   vue: 'watch / onMounted 분리',   react: 'useEffect 통합' },
  { feature: '데이터 바인딩',  vue: 'v-model 양방향',            react: 'value+onChange 단방향' },
  { feature: '리스트',         vue: 'v-for 디렉티브',            react: '.map() JS 표현식' },
  { feature: '상태 변이',      vue: '직접 변이 허용',            react: '불변 업데이트 필수' },
  { feature: '생태계',         vue: 'Nuxt, Pinia, VueRouter',    react: 'Next.js, Zustand, React Router' },
  { feature: '기업 채택',      vue: 'Alibaba, Xiaomi',           react: 'Meta, Airbnb, Netflix' },
]

/* ── 메인 페이지 ─────────────────────────── */
export default function FrameworkPage() {
  return (
    <div className="fw-page pt-nav">
      {/* Hero */}
      <div className="fw-hero">
        <div className="fw-hero-inner">
          <div className="fw-hero-badges">
            <span className="fw-hero-badge vue">Vue 3</span>
            <span className="fw-hero-vs">vs</span>
            <span className="fw-hero-badge react">React 19</span>
          </div>
          <h1 className="fw-hero-title">
            무엇이 다르고<br />
            <span>무엇을 선택할까?</span>
          </h1>
          <p className="fw-hero-desc">
            같은 기능을 Vue와 React로 나란히 구현하며 두 프레임워크의
            철학과 문법 차이를 직접 확인해보세요.
            아래 예제들은 모두 실시간으로 동작합니다.
          </p>
          <div className="fw-hero-meta">
            <span>4가지 핵심 예제</span>
            <span>·</span>
            <span>라이브 데모 포함</span>
            <span>·</span>
            <span>코드 복사 가능</span>
          </div>
        </div>
      </div>

      {/* 예제 섹션 */}
      <div className="fw-main">
        {EXAMPLES.map(ex => (
          <section key={ex.id} className="fw-section">
            <div className="fw-section-label">
              <span className="fw-section-num">{ex.num}</span>
              <div>
                <h2 className="fw-section-title">{ex.title}</h2>
                <p className="fw-section-desc">{ex.desc}</p>
              </div>
            </div>

            {/* 코드 분할 뷰 */}
            <div className="fw-split">
              <CodePanel lang="vue"   code={ex.vueCode} />
              <CodePanel lang="react" code={ex.reactCode} />
            </div>

            {/* 특징 */}
            <Highlights items={ex.highlights} />

            {/* 라이브 데모 — Vue / React 각각 */}
            <div className="fw-demo-split">
              <div className="fw-demo-wrap">
                <div className="fw-demo-label">
                  <span className="fw-demo-dot" />
                  <span className="fw-badge vue">Vue 3</span>
                  <span className="fw-demo-same-note">동일한 결과물</span>
                </div>
                <div className="fw-demo-body">
                  <ex.Demo />
                </div>
              </div>
              <div className="fw-demo-wrap">
                <div className="fw-demo-label">
                  <span className="fw-demo-dot react" />
                  <span className="fw-badge react">React 19</span>
                  <span className="fw-demo-same-note">동일한 결과물</span>
                </div>
                <div className="fw-demo-body">
                  <ex.Demo />
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* 요약 테이블 */}
        <section className="fw-summary-section">
          <h2 className="fw-summary-title">한눈에 비교</h2>
          <p className="fw-summary-desc">두 프레임워크의 주요 특성 요약</p>
          <div className="fw-table-wrap">
            <table className="fw-table">
              <thead>
                <tr>
                  <th>항목</th>
                  <th><span className="fw-badge vue">Vue 3</span></th>
                  <th><span className="fw-badge react">React 19</span></th>
                </tr>
              </thead>
              <tbody>
                {SUMMARY.map(row => (
                  <tr key={row.feature}>
                    <td className="fw-table-feature">{row.feature}</td>
                    <td className="fw-table-vue">{row.vue}</td>
                    <td className="fw-table-react">{row.react}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
