// Categories
const allCategories = [
  'Business','Economics','Entertainment','Finance','Health','Politics','Science',
  'Sports','Tech','Crime','Lifestyle','Automotive','Travel','Weather','General'
];

const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJNYXJpYW1TaGluZHkiLCJqdGkiOiI2NWRlMmY3Yi0zNzhlLTRjMWUtYWViZS04ZWEyYjA0NTliNDAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzQ5MzYwMzQ1LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MjkxIiwiYXVkIjoiTXlTZWN1cmVkQVBJU1VzZXJzIn0.y59bXZAOaz74Wjk_1AYO2ayTqkQ01h0xA8DHDK7luqk';

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

// Fetch & display
// async function fetchNews() {
//   loader.classList.remove('hidden');
//   errorDiv.classList.add('hidden');
//   newsList.innerHTML = '';

//   const q = encodeURIComponent(searchInput.value.trim());
  
//   // Choose URL
//   const base = selectedCategory
//     ? 'https://localhost:7291/api/newsTwo/category/${encodeURIComponent(selectedCategory)}'
//     : 'https://localhost:7291/api/newsTwo/all?pageSize=110&pageNumber=1';
//   const url = new URL(base);
//   if (selectedCategory) url.searchParams.set('category', selectedCategory);
//   if (q) url.searchParams.set('q', q);

//   try {
//     const res  = await fetch(url);
//     const data = await res.json();
//     const articles = data.recommendations || [];

//     // Simulate save to JSON file
//     console.log('SAVE recommended_1.json →', { recommendations: articles });

//     if (!articles.length) {
//       newsList.innerHTML = '<li>No articles found.</li>';
//     } else {
//       articles.forEach(a => {
//         const li = document.createElement('li');
//         li.textContent = a.title;
//         li.onclick = () => window.open(a.url, '_blank');
//         newsList.appendChild(li);
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     errorDiv.classList.remove('hidden');
//   } finally {
//     loader.classList.add('hidden');
//   }
// }
async function fetchNews() {
  loader.classList.remove('hidden');
  errorDiv.classList.add('hidden');
  newsList.innerHTML = '';

  const q = encodeURIComponent(searchInput.value.trim());
  
  // Choose URL
  const base = selectedCategory
    ? 'https://localhost:7291/api/newsTwo/category/${encodeURIComponent(selectedCategory)}'
    : 'https://localhost:7291/api/newsTwo/all?pageSize=110&pageNumber=1';
  const url = new URL(base);
  if (selectedCategory) url.searchParams.set('category', selectedCategory);
  if (q) url.searchParams.set('q', q);

  try {
    const res  = await fetch(url);
    const data = await res.json();
    const articles = data.recommendations || [];

    if (!articles.length) {
      newsList.innerHTML = '<li>No articles found.</li>';
    } else {
      articles.forEach(a => {
        const li = document.createElement('li');
        li.textContent = a.title;
        li.onclick = () => window.open(a.url, '_blank');
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












