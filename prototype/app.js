document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('roadmap-form');
    const generateBtn = document.getElementById('generate-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    const inputSection = document.getElementById('input-section');
    const outputSection = document.getElementById('output-section');
    
    // Output Elements
    const roadmapTitle = document.getElementById('roadmap-title');
    const roadmapSubtitle = document.getElementById('roadmap-subtitle');
    const currentSkillsTags = document.getElementById('current-skills-tags');
    const missingSkillsTags = document.getElementById('missing-skills-tags');
    const skillSummary = document.getElementById('skill-summary');
    const timelineContainer = document.getElementById('timeline');

    // Buttons
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const resetBtn = document.getElementById('reset-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentSkills = document.getElementById('current-skills').value;
        const targetRole = document.getElementById('target-role').value;
        const timeline = parseInt(document.getElementById('timeline').value);

        if(!currentSkills || !targetRole || !timeline) return;

        // UI Transition to Loading State
        form.classList.add('hidden');
        generateBtn.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        try {
            // Fetch mock AI data
            const data = await generateMockRoadmap(currentSkills, targetRole, timeline);
            
            // Populate UI with Data
            renderOutput(data);

            // UI Transition to Output State
            inputSection.classList.add('hidden');
            outputSection.classList.remove('hidden');
            outputSection.classList.add('slide-up');
        } catch (error) {
            console.error("Error generating roadmap:", error);
            alert("An error occurred while generating your roadmap. Please try again.");
            // Reset UI
            form.classList.remove('hidden');
            generateBtn.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    });

    function renderOutput(data) {
        roadmapTitle.textContent = `Roadmap to ${data.targetRole}`;
        roadmapSubtitle.textContent = `Estimated Timeline: ${data.timeline}`;

        // Render Skills Gap
        currentSkillsTags.innerHTML = '';
        data.skillGapAnalysis.currentSkills.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = skill;
            currentSkillsTags.appendChild(span);
        });

        missingSkillsTags.innerHTML = '';
        data.skillGapAnalysis.missingSkills.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = skill;
            missingSkillsTags.appendChild(span);
        });

        skillSummary.textContent = data.skillGapAnalysis.summary;

        // Render Timeline
        timelineContainer.innerHTML = '';
        data.roadmap.forEach((module, index) => {
            const sideClass = index % 2 === 0 ? 'left' : 'right';
            
            let resourcesHTML = '';
            if (module.resources && module.resources.length > 0) {
                resourcesHTML = `
                    <div class="resources-section">
                        <h5>Curated Resources</h5>
                        <ul class="resource-list">
                            ${module.resources.map(res => `
                                <li>
                                    <a href="${res.link}" target="_blank" rel="noopener noreferrer">
                                        <i class="fa-brands fa-${res.type.toLowerCase() === 'youtube' ? 'youtube' : 'readme'}"></i>
                                        ${res.title}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            }

            let projectHTML = '';
            if (module.miniProject) {
                projectHTML = `
                    <div class="project-section">
                        <h5>Hands-On Mini Project</h5>
                        <div class="project-card">
                            <i class="fa-solid fa-laptop-code"></i> ${module.miniProject}
                        </div>
                    </div>
                `;
            }

            const item = document.createElement('div');
            item.className = `timeline-item ${sideClass}`;
            item.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-month">Month ${module.month}</div>
                    <h3>${module.title}</h3>
                    <p>${module.description}</p>
                    ${resourcesHTML}
                    ${projectHTML}
                </div>
            `;
            timelineContainer.appendChild(item);
        });
    }

    // Export to PDF functionality
    exportPdfBtn.addEventListener('click', () => {
        const element = document.getElementById('pdf-content');
        
        // Add specific class to modify styles for PDF (e.g., change dark mode to light mode for printing)
        element.classList.add('pdf-export-mode');
        const originalBg = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'white';

        const opt = {
            margin:       0.5,
            filename:     'Career_Roadmap.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Change button text
        const originalText = exportPdfBtn.innerHTML;
        exportPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating PDF...';
        exportPdfBtn.disabled = true;

        html2pdf().set(opt).from(element).save().then(() => {
            // Revert styles
            element.classList.remove('pdf-export-mode');
            document.body.style.backgroundColor = originalBg;
            exportPdfBtn.innerHTML = originalText;
            exportPdfBtn.disabled = false;
        }).catch(err => {
            console.error("PDF Export failed", err);
            element.classList.remove('pdf-export-mode');
            document.body.style.backgroundColor = originalBg;
            exportPdfBtn.innerHTML = originalText;
            exportPdfBtn.disabled = false;
        });
    });

    // Reset Functionality
    resetBtn.addEventListener('click', () => {
        form.reset();
        outputSection.classList.add('hidden');
        outputSection.classList.remove('slide-up');
        
        form.classList.remove('hidden');
        generateBtn.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
        
        inputSection.classList.remove('hidden');
        inputSection.classList.add('slide-up');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
