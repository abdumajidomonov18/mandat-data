import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import './App.css'

const API = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [minScore, setMinScore] = useState('')
  const [maxScore, setMaxScore] = useState('')
  const [sort, setSort] = useState('score_desc')
  const [limit, setLimit] = useState(100)
  const [initialLoaded, setInitialLoaded] = useState(false)

  // Easter Egg
  useEffect(() => {
    console.log('%cTHIS WEB SITE WAS MADE FOR MY CRUSH "A"😊', 'color: #ff69b4; font-size: 20px; font-weight: bold; font-family: sans-serif; text-shadow: 1px 1px 2px #000;')
  }, [])

  // Statistikani yuklash
  useEffect(() => {
    axios.get(`${API}/stats`).then(res => setStats(res.data)).catch(console.error)
  }, [])

  // Dastlabki top natijalar
  useEffect(() => {
    loadTop()
  }, [sort, limit, minScore, maxScore])

  async function loadTop() {
    setLoading(true)
    try {
      const params = { limit, sort }
      if (minScore) params.minScore = minScore
      if (maxScore) params.maxScore = maxScore
      const res = await axios.get(`${API}/top`, { params })
      setResults(res.data)
      setInitialLoaded(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  // Qidiruv (debounce bilan)
  const debounce = useCallback((fn, delay) => {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }, [])

  const handleSearch = useCallback(
    debounce(async (q) => {
      if (!q.trim()) {
        loadTop()
        return
      }
      setLoading(true)
      try {
        const res = await axios.get(`${API}/search`, { params: { q, limit } })
        setResults(res.data)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }, 300),
    [limit]
  )

  function getMedal(rank) {
    rank = parseInt(rank)
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    if (rank <= 10) return '⭐'
    if (rank <= 100) return '🔥'
    return ''
  }

  function getDetailUrl(item) {
    if (item.abituriyent_id === '7473030') {
      return 'https://www.instagram.com/abdumajid_o18/'
    }
    return `https://mandat.uzbmb.uz/Bakalavr/MainSearch?entrantid=${item.abituriyent_id}&lang=uz`
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo">🎓</div>
          <h1>Abituriyentlar Natijasi 2024</h1>
          <p className="subtitle">Mandat ma'lumotlari qidiruv tizimi</p>
        </header>

        {/* Simple Stats Text */}
        {stats && (
          <div className="stats-text-container">
            <span className="stat-text-item">👥 Jami: <strong>{parseInt(stats.jami).toLocaleString()}</strong></span>
            <span className="stat-text-divider">•</span>
            <span className="stat-text-item">🏆 Eng yuqori: <strong>{stats.eng_yuqori}</strong></span>
            <span className="stat-text-divider">•</span>
            <span className="stat-text-item">📊 O'rtacha: <strong>{stats.o_rtacha}</strong></span>
            <span className="stat-text-divider">•</span>
            <span className="stat-text-item">📉 Eng past: <strong>{stats.eng_past}</strong></span>
          </div>
        )}

        {/* Search Box */}
        <div className="search-box">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="ID raqami yoki Ism-familiyani yozing..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label>Eng kam ball</label>
              <input
                type="number"
                placeholder="Masalan: 56.7"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Eng ko'p ball</label>
              <input
                type="number"
                placeholder="Masalan: 189"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label>Tartiblash</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="filter-select">
                <option value="score_desc">Ball (Kattadan kichikka)</option>
                <option value="score_asc">Ball (Kichikdan kattaga)</option>
                <option value="id_asc">ID (Kichikdan kattaga)</option>
                <option value="id_desc">ID (Kattadan kichikka)</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Nechta</label>
              <select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} className="filter-select">
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="table-container">
          {loading ? (
            <div className="loader">
              <div className="spinner"></div>
              <p>Yuklanmoqda...</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Reyting</th>
                  <th>ID</th>
                  <th>Ism Familiya</th>
                  <th>Ball</th>
                  <th>Batafsil</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, i) => (
                  <tr key={i} className={item.abituriyent_id === '7473030' ? 'hacker-row' : ''}>
                    <td>
                      <span className="rank-badge">
                        #{parseInt(item.reyting).toLocaleString()}
                      </span>
                      <span className="rank-total">
                        {stats ? `/ ${parseInt(stats.jami).toLocaleString()}` : ''} {getMedal(item.reyting)}
                      </span>
                    </td>
                    <td className="id-cell">{item.abituriyent_id}</td>
                    <td className="name-cell">{item.ism}</td>
                    <td className={`score-cell ${parseFloat(item.ball) > 0 ? 'score-positive' : 'score-zero'}`}>
                      {item.ball}
                    </td>
                    <td>
                      <a href={getDetailUrl(item)} target="_blank" rel="noopener noreferrer" className="btn-detail">
                        🔗 Batafsil
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && results.length === 0 && initialLoaded && (
            <div className="no-results">
              <p>😕 Natija topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
