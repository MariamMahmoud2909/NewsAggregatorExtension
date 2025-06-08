// All Categories
const allCategories = [
  'Business','Economics','Entertainment','Finance','Health','Politics','Science',
  'Sports','Tech','Crime','Lifestyle','Automotive','Travel','Weather','General'
];

let expanded = false;
let selectedCategory = null;

// DOM refs
const categoriesDiv    = document.getElementById('categories');
const toggleBtn        = document.getElementById('toggleCategories');
const refreshBtn       = document.getElementById('refresh-btn');
const loader           = document.getElementById('loader');
const errorDiv         = document.getElementById('error');
const newsList         = document.getElementById('news-list');
const searchInput      = document.getElementById('search-input');

function renderCategories() {
  categoriesDiv.innerHTML = '';
  allCategories.slice(0, 3).forEach(c => categoriesDiv.appendChild(makeBtn(c)));
  if (expanded) allCategories.slice(3).forEach(c => categoriesDiv.appendChild(makeBtn(c)));
  toggleBtn.textContent = expanded ? 'See less ▲' : 'See more ▾';
}

function makeBtn(cat) {
  const btn = document.createElement('button');
  btn.textContent = cat;
  btn.classList.toggle('active', selectedCategory === cat);
  btn.onclick = () => {
    selectedCategory = (selectedCategory === cat ? null : cat);
    renderCategories();
    fetchNews();
  };
  return btn;
}

toggleBtn.onclick = () => {
  expanded = !expanded;
  renderCategories();
};
const API_TOKEN = "DKDU6nIVitZa9d6y85yTCs6htRzW9vKZ1BZJINtQoIM"
async function fetchNews() {
  loader.classList.remove('hidden');
  errorDiv.classList.add('hidden');
  newsList.innerHTML = '';

  const q = encodeURIComponent(searchInput.value.trim());
  const query = q || selectedCategory || 'news';  // Fallback to 'news' if nothing selected

  const url = new URL('https://v3-api.newscatcherapi.com/api/search');
  url.searchParams.set('q', query);
  url.searchParams.set('lang', 'en'); 

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-token': API_TOKEN
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const articles = data.articles || [];

    if (!articles.length) {
      newsList.innerHTML = '<li>No articles found.</li>';
    } else {
      articles.forEach(a => {
        const li = document.createElement('li');
        li.textContent = a.title;
        li.onclick = () => window.open(a.link, '_blank');
        newsList.appendChild(li);
      });
    }
  } catch (err) {
    console.error(err);
    errorDiv.classList.remove('hidden');
  } finally {
    loader.classList.add('hidden');
  }
}

refreshBtn.onclick = fetchNews;
searchInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') fetchNews();
});

// Init
renderCategories();
fetchNews();