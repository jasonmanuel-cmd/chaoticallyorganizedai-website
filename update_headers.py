import os
import glob
import re

header_html = '''    <header>
        <div class="nav-container" role="navigation" aria-label="Main Navigation">
            <a href="index.html" class="logo">
                <img src="logo.png" alt="Chaotically Organized AI logo" loading="lazy" width="48" height="48">
                <span class="logo-text">CHAOTICALLY ORGANIZED AI</span>
            </a>
            <div class="nav-main">
                <ul class="nav-links" role="menubar">
                    <li><a href="index.html" role="menuitem" tabindex="0">Home</a></li>
                    <li><a href="services.html" role="menuitem" tabindex="0">Services</a></li>
                    <li><a href="portfolio.html" role=\"menuitem\" tabindex=\"0\">Case Studies</a></li>
                    <li><a href="careers.html" role="menuitem" tabindex="0">Careers</a></li>
                    <li><a href="resources.html" role="menuitem" tabindex="0">Resources</a></li>
                    <li><a href="contact.html" role="menuitem" tabindex="0">Contact</a></li>
                </ul>
                <a href="intake.html" class="btn btn-primary header-cta" tabindex="0">Get Free Audit</a>
            </div>
            <button class="menu-toggle" aria-label="Open navigation menu" aria-expanded="false" aria-controls="main-menu">☰</button>
        </div>
    </header>'''

for file in glob.glob('*.html'):
    if file == 'index.html': continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace header block
    new_content = re.sub(r'<header>.*?</header>', header_html, content, flags=re.DOTALL)
    
    # Mark specific page active
    page_name = file
    new_content = new_content.replace(f'href="{page_name}" role="menuitem"', f'href="{page_name}" class="active" role="menuitem"')
    
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file}')
