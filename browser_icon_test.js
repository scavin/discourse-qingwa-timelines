// Browser Console Icon Testing Script
// Copy and paste this into your browser's developer console when on a Discourse page

(function() {
  console.log('=== Discourse Icon Testing Script ===');
  
  // Test icons to try
  const testIcons = [
    'stream',
    'clock', 
    'calendar-alt',
    'list',
    'chevron-right',
    'plus',
    'arrow-right',
    'caret-right',
    'angle-right',
    'play'
  ];
  
  // Create test container
  const testContainer = document.createElement('div');
  testContainer.id = 'icon-test-container';
  testContainer.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: white;
    border: 2px solid #333;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    z-index: 9999;
    max-width: 300px;
    font-family: Arial, sans-serif;
  `;
  
  // Dark mode support
  if (document.body.classList.contains('dark-mode')) {
    testContainer.style.background = '#2a2a2a';
    testContainer.style.color = '#fff';
    testContainer.style.borderColor = '#666';
  }
  
  // Title
  const title = document.createElement('h3');
  title.textContent = 'Icon Test Results';
  title.style.cssText = 'margin: 0 0 15px 0; font-size: 16px;';
  testContainer.appendChild(title);
  
  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666;
  `;
  closeBtn.onclick = () => document.body.removeChild(testContainer);
  testContainer.appendChild(closeBtn);
  
  // Test each icon
  testIcons.forEach(iconName => {
    const testRow = document.createElement('div');
    testRow.style.cssText = `
      display: flex;
      align-items: center;
      margin: 8px 0;
      padding: 5px;
      border-radius: 4px;
    `;
    
    // Icon test with multiple class formats
    const iconTests = [
      `d-icon d-icon-${iconName}`,
      `fa fa-${iconName}`,
      `fas fa-${iconName}`,
      `far fa-${iconName}`
    ];
    
    let workingClass = null;
    let workingElement = null;
    
    iconTests.forEach(className => {
      const testIcon = document.createElement('i');
      testIcon.className = className;
      testIcon.style.cssText = `
        margin-right: 10px;
        font-size: 16px;
        width: 20px;
        text-align: center;
      `;
      
      // Test if icon renders (has content or proper font)
      document.body.appendChild(testIcon);
      const style = window.getComputedStyle(testIcon);
      const hasFont = style.fontFamily.includes('Font Awesome') || style.fontFamily.includes('Discourse');
      const hasContent = style.content && style.content !== 'none';
      
      if (hasFont || hasContent) {
        workingClass = className;
        workingElement = testIcon.cloneNode(true);
      }
      
      document.body.removeChild(testIcon);
    });
    
    // If no working class found, create a placeholder
    if (!workingElement) {
      workingElement = document.createElement('span');
      workingElement.textContent = '❌';
      workingElement.style.cssText = `
        margin-right: 10px;
        color: red;
        font-weight: bold;
      `;
      testRow.style.background = '#ffebee';
    } else {
      testRow.style.background = '#e8f5e8';
    }
    
    testRow.appendChild(workingElement);
    
    // Icon name and result
    const label = document.createElement('span');
    label.textContent = `${iconName} (${workingClass || 'FAILED'})`;
    label.style.cssText = `
      font-size: 12px;
      flex: 1;
    `;
    testRow.appendChild(label);
    
    testContainer.appendChild(testRow);
  });
  
  // Add Font Awesome info
  const infoSection = document.createElement('div');
  infoSection.style.cssText = `
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #ccc;
    font-size: 11px;
  `;
  
  // Check FontAwesome
  const faInfo = document.createElement('div');
  faInfo.innerHTML = `<strong>Font Awesome:</strong> ${typeof FontAwesome !== 'undefined' ? 'LOADED' : 'NOT FOUND'}`;
  infoSection.appendChild(faInfo);
  
  // Check Discourse icon system
  const discourseInfo = document.createElement('div');
  discourseInfo.innerHTML = `<strong>Discourse Icons:</strong> ${typeof Discourse !== 'undefined' ? 'LOADED' : 'NOT FOUND'}`;
  infoSection.appendChild(discourseInfo);
  
  // Check current theme
  const themeInfo = document.createElement('div');
  themeInfo.innerHTML = `<strong>Theme:</strong> ${document.body.classList.contains('dark-mode') ? 'DARK' : 'LIGHT'}`;
  infoSection.appendChild(themeInfo);
  
  testContainer.appendChild(infoSection);
  
  // Add to page
  document.body.appendChild(testContainer);
  
  console.log('Icon test completed. Check the popup in the top-right corner.');
  console.log('Working icons should appear with green background and checkmarks.');
  console.log('Failed icons will have red background and X marks.');
  
  return {
    testIcons,
    container: testContainer
  };
})();