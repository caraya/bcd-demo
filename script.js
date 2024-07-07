import bcd from 'https://esm.run/@mdn/browser-compat-data';

const form = document.getElementById('compatibility-form');
const categorySelect = document.getElementById('category');
const subcategorySelect = document.getElementById('subcategory');
const propertySelect = document.getElementById('property');
const compatibilityDataDiv = document.getElementById('compatibility-data');

const categories = {
    css: bcd.css,
    html: bcd.html,
    javascript: bcd.javascript
};

const subcategories = {
    css: Object.keys(bcd.css),
    html: Object.keys(bcd.html),
    javascript: Object.keys(bcd.javascript)
};

function populateSubcategories(category) {
    const subcats = subcategories[category];
    subcategorySelect.innerHTML = subcats.map(subcat => `<option value="${subcat}">${subcat}</option>`).join('');
    populateProperties(category, subcats[0]);
}

function populateProperties(category, subcategory) {
    const properties = Object.keys(categories[category][subcategory]);
    propertySelect.innerHTML = properties.map(prop => `<option value="${prop}">${prop}</option>`).join('');
}

function renderSupportTable(support, browsers) {
    const browserRow = browsers.map(browser => `<th>${browser}</th>`).join('');
    const supportRow = browsers.map(browser => {
        const info = support[browser];
        const supportText = info && info.version_added
            ? `✅<br>${info.version_added}`
            : '❌';
        return `<td>${supportText}</td>`;
    }).join('');

    return `
        <table>
            <tr>${browserRow}</tr>
            <tr>${supportRow}</tr>
        </table>
    `;
}

function renderCompatibilityData(data) {
    if (!data || !data.__compat) return '<p>No compatibility data available for this selection.</p>';

    const description = data.__compat.description || 'No description available';
    const specUrl = data.__compat.spec_url || '#';
    const notes = data.__compat.notes || [];
    const support = data.__compat.support;

    const desktopBrowsers = ['chrome', 'safari', 'ie', 'firefox', 'opera'];
    const mobileBrowsers = ['safari_ios', 'chrome_android', 'firefox_android', 'webview_android', 'opera_android'];

    const desktopTable = renderSupportTable(support, desktopBrowsers);
    const mobileTable = renderSupportTable(support, mobileBrowsers);

    const notesHtml = notes.length ? `<p>Compatibility Notes: ${notes.join('<br>')}</p>` : '';

    return `
        <h2>${data.__compat.mdn_url.split('/').pop()}</h2>
        <p>${description}</p>
        <p><a href="${specUrl}" target="_blank">Specification Link</a></p>
        ${notesHtml}
        <h3>Desktop Browsers</h3>
        ${desktopTable}
        <h3>Mobile Browsers</h3>
        ${mobileTable}
    `;
}

function displayCompatibilityData(category, subcategory, property) {
    const data = categories[category][subcategory][property];
    console.log('Displaying data for:', category, subcategory, property, data); // Debugging line
    if (data) {
        compatibilityDataDiv.innerHTML = renderCompatibilityData(data);
    } else {
        compatibilityDataDiv.innerHTML = '<p>No compatibility data available for this selection.</p>';
    }
}

categorySelect.addEventListener('change', () => {
    populateSubcategories(categorySelect.value);
});

subcategorySelect.addEventListener('change', () => {
    populateProperties(categorySelect.value, subcategorySelect.value);
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const category = categorySelect.value;
    const subcategory = subcategorySelect.value;
    const property = propertySelect.value;
    displayCompatibilityData(category, subcategory, property);
});

// Initial population of subcategories and properties
populateSubcategories(categorySelect.value);
