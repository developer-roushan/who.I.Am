(function() {
  const originalFetch = window.fetch;
  let dataPromise = null;
  window.fetch = function(url, options) {
    const urlStr = typeof url === 'string' ? url : (url && url.url) || '';
    if (urlStr.includes('/api/')) {
      if (options && options.method && options.method.toUpperCase() === 'POST') {
        return originalFetch(url, options);
      }
      if (!dataPromise) {
        dataPromise = originalFetch('/api/data.json').then(r => r.json());
      }
      let key = '';
      if (urlStr.includes('/api/about')) key = 'about';
      else if (urlStr.includes('/api/experience')) key = 'experience';
      else if (urlStr.includes('/api/contact-info')) key = 'contactInfo';
      else if (urlStr.includes('/api/project-config')) key = 'projectConfig';
      else if (urlStr.includes('/api/blog')) key = 'blog';
      else if (urlStr.includes('/api/status')) key = 'status';

      if (key) {
        return dataPromise.then(data => {
          const sectionData = data[key];
          const responsePayload = { success: true };
          if (key === 'blog') {
            responsePayload.data = sectionData.data;
            responsePayload.linkedinFeedUrl = sectionData.linkedinFeedUrl;
          } else if (key === 'experience') {
            responsePayload.data = sectionData.data;
            responsePayload.meta = sectionData.meta;
          } else {
            responsePayload.data = sectionData;
          }
          return new Response(JSON.stringify(responsePayload), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      }
    }
    return originalFetch(url, options);
  };
})();
