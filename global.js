console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'projects/index.html', title: 'Projects' },
  { url: 'Resume/index.html', title: 'Resume' },
  { url: 'contact/index.html', title: 'Contact' },
  { url: 'meta/index.html', title: 'Meta' }, 
  { url: 'https://github.com/edmondjy', title: 'GitHub' },
];

const BASE_PATH = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? '/'
  : `/${location.pathname.split('/')[1] || ''}/`;

function normalizePath(pathname) {
  return pathname.replace(/index\.html$/, '');
}

function initColorSchemeSwitcher() {
  const label = document.createElement('label');
  label.className = 'color-scheme';
  label.textContent = 'Theme: ';

  const select = document.createElement('select');
  const options = [
    { value: 'light dark', text: 'Automatic' },
    { value: 'light', text: 'Light' },
    { value: 'dark', text: 'Dark' },
  ];

  for (let optionData of options) {
    const option = document.createElement('option');
    option.value = optionData.value;
    option.textContent = optionData.text;
    select.append(option);
  }

  label.append(select);
  document.body.prepend(label);

  const savedScheme = 'colorScheme' in localStorage ? localStorage.colorScheme : 'light dark';
  select.value = savedScheme;
  document.documentElement.style.setProperty('color-scheme', select.value);

  select.addEventListener('input', (event) => {
    const scheme = event.target.value;
    document.documentElement.style.setProperty('color-scheme', scheme);
    localStorage.colorScheme = scheme;
  });
}

initColorSchemeSwitcher();

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  a.classList.toggle(
    'current',
    a.host === location.host && normalizePath(a.pathname) === normalizePath(location.pathname),
  );

  if (a.host !== location.host) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }

  nav.append(a);
}

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    
    console.log(response);
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  
  if (!projects || projects.length === 0) {
    containerElement.innerHTML = '<p>No projects to display.</p>';
    return;
  }
  
  for (let project of projects) {
    const article = document.createElement('article');
    

    const imageHtml = project.image 
      ? `<img src="${project.image}" alt="${project.title}">` 
      : '';
    
    let highlightsHtml = '';
    if (project.highlights && project.highlights.length > 0) {
      highlightsHtml = '<ul>' + project.highlights.map(h => `<li>${h}</li>`).join('') + '</ul>';
    } else if (project.description) {
      highlightsHtml = `<p>${project.description}</p>`;
    }
    
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      ${imageHtml}
      ${highlightsHtml}
    `;
    
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
