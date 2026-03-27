document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('promptInput');
    const homeView = document.getElementById('homeView');
    const loadingView = document.getElementById('loadingView');
    const studioView = document.getElementById('studioView');
    const loadingSteps = document.getElementById('loadingSteps').children;
    
    // Settings Elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const saveApiBtn = document.getElementById('saveApiBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');

    // Studio Controls
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const activeSlideContainer = document.getElementById('activeSlideContainer');
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');
    const slideCounter = document.getElementById('slideCounter');
    const closeStudioBtn = document.getElementById('closeStudioBtn');
    
    // Fullscreen Controls
    const presentBtn = document.getElementById('presentBtn');
    const fullscreenView = document.getElementById('fullscreenView');
    const fullscreenSlideContainer = document.getElementById('fullscreenSlideContainer');
    const exitFullscreenBtn = document.getElementById('exitFullscreenBtn');

    let currentSlideIndex = 0;
    let generatedSlides = [];
    let uploadedTemplateBase64 = null;
    let uploadedTemplateMime = null;

    const templateUpload = document.getElementById('templateUpload');
    const uploadStatus = document.getElementById('uploadStatus');

    if(templateUpload) {
        templateUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if(file.name.match(/\.(ppt|pptx)$/i)) {
                    alert("PPT/PPTX files cannot be analyzed directly in the browser yet. Please save your template as a PDF or Image and upload that instead!");
                    e.target.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(event) {
                    uploadedTemplateBase64 = event.target.result.split(',')[1];
                    uploadedTemplateMime = file.type;
                    uploadStatus.textContent = "Template Attached: " + file.name;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Settings / API Key Logic
    let GEMINI_API_KEY = '';
    
    settingsBtn.addEventListener('click', () => {
        apiKeyInput.value = GEMINI_API_KEY;
        settingsModal.classList.remove('hidden');
    });
    
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    saveApiBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if(key) {
            GEMINI_API_KEY = key;
            settingsModal.classList.add('hidden');
            alert('API Key Saved for this session!');
        } else {
            alert('Please enter a valid key.');
        }
    });

    // Generation Logic
    const demoBtn = document.getElementById('demoBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            promptInput.value = "Global Warming: Factors, Causes, and Solutions";
            
            // Bypass API check entirely and spoof loading
            homeView.classList.add('hidden');
            loadingView.style.display = 'flex';
            loadingView.classList.remove('hidden');
            resetLoadingSteps();
            
            updateLoadingStep(0);
            
            setTimeout(() => {
                updateLoadingStep(1);
                
                // Hardcoded structured mock response
                const isTemplateUploaded = uploadedTemplateBase64 !== null;
                const demoTheme = isTemplateUploaded 
                    ? { "backgroundColor": "#f8fafc", "textColor": "#0f172a", "accentColor": "#2563eb" } // Clean light theme representing an extracted PPT template
                    : { "backgroundColor": "#0b132b", "textColor": "#e5e5e5", "accentColor": "#ef476f" }; // Original cinematic dark theme

                const demoResponse = {
                  "theme": demoTheme,
                  "slides": [
                    {
                      "type": "title",
                      "title": "Global Warming: The Impending Crisis",
                      "subtitle": "Understanding Factors, Causes, and Solutions",
                      "background": isTemplateUploaded ? `data:${uploadedTemplateMime};base64,${uploadedTemplateBase64}` : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920"
                    },
                    {
                      "type": "content",
                      "title": "What is Global Warming?",
                      "points": [
                          "A long-term heating of Earth's climate system.",
                          "Observed since the pre-industrial period (between 1850 and 1900).",
                          "Primarily driven by human activities and fossil fuel combustion."
                      ],
                      "visualType": "image",
                      "media": "https://images.unsplash.com/photo-1615092296061-e2ccfeb2f3d6?w=1000&q=80"
                    },
                    {
                       "type": "content",
                       "title": "The Greenhouse Effect",
                       "points": [
                           "Solar radiation passes through the atmosphere.",
                           "Earth's surface absorbs energy and warms.",
                           "Greenhouse gases (CO2, Methane) trap outgoing heat."
                       ],
                       "visualType": "simulation",
                       "media": "https://www.youtube.com/embed/sTvqIijqvTg"
                    },
                    {
                       "type": "content",
                       "title": "Primary Causes",
                       "points": [
                           "Fossil Fuels: Coal, oil, and gas account for over 75% of global emissions.",
                           "Deforestation: Trees that absorb carbon are cut down.",
                           "Agriculture: Industrial farming releases massive amounts of methane."
                       ],
                       "visualType": "image",
                       "media": "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1000&q=80"
                    },
                    {
                       "type": "content",
                       "title": "Impact on Ecosystems",
                       "points": [
                           "Rising Sea Levels: Resulting from melting glaciers.",
                           "Extreme Weather: Increased frequency of hurricanes and droughts.",
                           "Ocean Acidification: Threatening marine life and coral reefs."
                       ],
                       "visualType": "simulation",
                       "media": "https://www.youtube.com/embed/G4H1N_yXBiA"
                    },
                    {
                       "type": "content",
                       "title": "Actionable Solutions",
                       "points": [
                           "Renewable Energy: Shifting to solar, wind, and geothermal power.",
                           "Reforestation: Planting trees to capture carbon naturally.",
                           "Policy Changes: Implementing carbon taxes and international treaties."
                       ],
                       "visualType": "image",
                       "media": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1000&q=80"
                    }
                  ]
                };

                setTimeout(() => {
                    updateLoadingStep(2);
                    
                    const theme = demoResponse.theme;
                    generatedSlides = demoResponse.slides.map(slide => {
                        const prompt = (slide.imagePrompt || slide.title).substring(0, 200).replace(/[^\w\s]/gi, '');
                        if(slide.type === 'title') {
                            return {
                                ...slide,
                                theme: theme,
                                background: slide.background || `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' title slide presentation abstract')}`
                            };
                        } else {
                            return {
                                ...slide,
                                theme: theme,
                                visualType: slide.visualType === 'simulation' ? 'simulation' : 'image',
                                media: slide.media || (slide.visualType === 'simulation' 
                                        ? slide.title 
                                        : `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' realistic presentation diagram')}`)
                            };
                        }
                    });

                    setTimeout(() => {
                        loadingView.style.display = 'none';
                        studioView.classList.remove('hidden');
                        renderThumbnails();
                        renderSlide(0);
                    }, 800);
                }, 1000);
            }, 800);
        });
    }

    generateBtn.addEventListener('click', async () => {
        const promptText = promptInput.value.trim();
        if(!promptText) {
            alert("Please enter a presentation topic.");
            return;
        }

        // We no longer strictly block if there is no API key! We will use the free Pollinations AI fallback.
        
        // Hide Home, Show Loading
        homeView.classList.add('hidden');
        loadingView.style.display = 'flex';
        loadingView.classList.remove('hidden');
        resetLoadingSteps();
        
        // Simulating the AI Multi-Agent execution steps visually while waiting
        updateLoadingStep(0); // "Receiving Request"

        try {
            updateLoadingStep(1); // "Content Agent: Synthesizing Textbook Data"
            
            const aiResponse = await callGeminiAPI(promptText, uploadedTemplateBase64, uploadedTemplateMime);
            const parsedData = parseGeminiResponse(aiResponse);
            const theme = parsedData.theme || { backgroundColor: '#111114', textColor: '#e4e4e7', accentColor: '#0ea5e9' };
            const slidesData = parsedData.slides || [];
            
            updateLoadingStep(2); // "Visual Agent: Generating Diagrams"
            
            // Map the parsed JSON to our frontend format, applying Pollinations AI for images
            generatedSlides = slidesData.map((slide, index) => {
                const prompt = (slide.imagePrompt || slide.title).substring(0, 200).replace(/[^\w\s]/gi, '');
                
                if(slide.type === 'title') {
                    return {
                        ...slide,
                        theme: theme,
                        background: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' title slide presentation abstract')}`
                    };
                } else {
                    return {
                        ...slide,
                        theme: theme,
                        visualType: slide.visualType === 'simulation' ? 'simulation' : 'image',
                        media: slide.visualType === 'simulation' 
                                ? slide.title 
                                : `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' realistic presentation diagram')}`
                    };
                }
            });

            // Finish Loading
            setTimeout(() => {
                loadingView.style.display = 'none';
                studioView.classList.remove('hidden');
                renderThumbnails();
                renderSlide(0);
            }, 500); // small delay to see the final step complete

        } catch (error) {
            console.error(error);
            alert("Error generating presentation: " + error.message + "\\n\\nThe API or parser failed. Check the console for exact details.");
            homeView.classList.remove('hidden');
            loadingView.style.display = 'none';
            loadingView.classList.add('hidden');
        }
    });

    async function callGeminiAPI(userPrompt, base64Image, mimeType) {
        const systemPrompt = `You are the master EduGen AI Architect.
The user will give you a topic for a lecture presentation.
You MUST reply with a pure JSON object containing a "theme" and "slides" array.
Do NOT output markdown formatting like \`\`\`json. Just the raw object.

Structure expected:
{
  "theme": {
     "backgroundColor": "#111114",
     "textColor": "#e4e4e7",
     "accentColor": "#0ea5e9"
  },
  "slides": [
    {
      "type": "title",
      "title": "Main Presentation Title",
      "subtitle": "Subtitle here",
      "imagePrompt": "Detailed visual prompt for the title slide background"
    },
    {
      "type": "content",
      "title": "Slide Topic",
      "points": ["Bullet 1", "Bullet 2", "Bullet 3"],
      "visualType": "image",
      "imagePrompt": "Detailed visual prompt for generating an image to accompany this slide. Make it highly descriptive."
    }
  ]
}
`;
        
        const payload = {
            contents: [{ parts: [{ text: systemPrompt + "\\n\\nUser Topic: " + userPrompt }] }]
        };

        if (base64Image && mimeType) {
            payload.contents[0].parts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: base64Image
                }
            });
            payload.contents[0].parts[0].text += "\\n\\nThe user has attached a template image. Extract the core themes, ideas, or visual structure from it and weave it into your slide structure and imagePrompts.";
        }

        let fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };

        const endpointsToTry = [
            "v1beta/models/gemini-1.5-flash",
            "v1/models/gemini-1.5-flash",
            "v1beta/models/gemini-1.5-flash-latest",
            "v1beta/models/gemini-1.5-pro",
            "v1beta/models/gemini-2.0-flash",
            "v1beta/models/gemini-pro"
        ];

        let finalResponse = null;
        let lastErrorText = "Unknown API Error";

        // If we have an API key, try Gemini's endpoints first
        if (GEMINI_API_KEY) {
            for (const endpoint of endpointsToTry) {
                let currentPayload = payload;
                if (endpoint.includes('gemini-pro') && !endpoint.includes('1.5')) {
                    currentPayload = { contents: [{ parts: [{ text: systemPrompt + "\\n\\nUser Topic: " + userPrompt }] }] };
                }
                fetchOptions.body = JSON.stringify(currentPayload);

                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/${endpoint}:generateContent?key=${GEMINI_API_KEY}`, fetchOptions);
                    if (response.ok) {
                        finalResponse = response;
                        break; 
                    } else {
                        const errPayload = await response.clone().json().catch(() => ({}));
                        if (errPayload.error && errPayload.error.message) {
                            lastErrorText = errPayload.error.message;
                        }
                    }
                } catch (e) {
                    console.warn("Network error attempting endpoint: " + endpoint);
                }
            }
        }

        // If Gemini failed (or no key was provided), fallback to entirely free Pollinations Text AI!
        if (!finalResponse || !finalResponse.ok) {
            console.warn("Gemini unavailable or missing. Falling back to keyless Pollinations AI Text generation...");
            const pollinationsUrl = `https://text.pollinations.ai/prompt/${encodeURIComponent(systemPrompt + "\\n\\nUser Topic: " + userPrompt)}?jsonMode=true&seed=${Math.floor(Math.random()*1000)}`;
            
            const fallbackResponse = await fetch(pollinationsUrl);
            if (!fallbackResponse.ok) {
                throw new Error("Both Gemini and the Keyless Pollinations Fallback failed to generate text.");
            }
            
            const textResponse = await fallbackResponse.text();
            return textResponse; // Pollinations returns the raw text directly!
        }

        // If Gemini succeeded, parse its specific structure
        const data = await finalResponse.json();
        
        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
            throw new Error("Gemini returned an empty or blocked response. It may have hit safety filters.");
        }
        
        return data.candidates[0].content.parts[0].text;
    }

    function parseGeminiResponse(text) {
        try {
            // First attempt to extract just the JSON object from the AI's response text using regex
            const jsonMatch = text.match(/\\{[\\s\\S]*\\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            // Fallback: try parsing the whole thing
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse JSON. Raw AI Output was:\\n", text);
            throw new Error("AI output was not valid JSON format. Try again.");
        }
    }

    function resetLoadingSteps() {
        for(let i=0; i<loadingSteps.length; i++) {
            loadingSteps[i].className = 'pending';
        }
    }

    function updateLoadingStep(index) {
        if(index > 0) {
            loadingSteps[index-1].className = 'done';
        }
        if(index < loadingSteps.length) {
            loadingSteps[index].className = 'active';
        }
    }

    // --- RENDER LOGIC ---

    function generateSlideHTML(slide, isThumbnail = false) {
        const t = slide.theme || { backgroundColor: '#111114', textColor: '#e4e4e7', accentColor: '#0ea5e9' };

        if (slide.type === 'title') {
            return `
                <div class="slide slide-title-layout" style="--bg-image: url('${slide.background}'); background-color: ${t.backgroundColor};">
                    <div class="slide-title-content">
                        <h1 style="color: ${t.textColor}">${slide.title}</h1>
                        <p style="color: ${t.accentColor}">${slide.subtitle || ''}</p>
                    </div>
                </div>
            `;
        } else if (slide.type === 'content') {
            let visualHTML = '';
            
            if (slide.visualType === 'image') {
                visualHTML = `<img src="${slide.media}" alt="${slide.title} Diagram" onerror="this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80';">`;
            } else if (slide.visualType === 'simulation') {
                let videoSrc = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(slide.title + " global warming educational animation")}&autoplay=0`;
                if(slide.media && slide.media.includes('youtube.com')) {
                    videoSrc = slide.media;
                }
                
                visualHTML = `
                    <div class="simulation-marker" style="margin-bottom:10px;"><span class="sim-dot" style="background:red;"></span> Academic Video Agent</div>
                    <div style="width: 100%; height: 100%; min-height: 250px; border-radius: 12px; overflow: hidden; background: #000; display:flex; align-items:center; justify-content:center;">
                        <iframe width="100%" height="100%" src="${videoSrc}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border:none;"></iframe>
                    </div>
                `;
            }

            const listItems = slide.points.map(p => `<li>${p}</li>`).join('');

            return `
                <div class="slide slide-content-layout" style="background-color: ${t.backgroundColor}; color: ${t.textColor}; --accent-secondary: ${t.accentColor};">
                    <h2 class="slide-header" style="border-bottom-color: ${t.accentColor}; color: ${t.textColor};">${slide.title}</h2>
                    <div class="content-split">
                        <div class="text-pane">
                            <ul>${listItems}</ul>
                        </div>
                        <div class="visual-pane">
                            ${visualHTML}
                            <div class="ai-tag" style="background: ${t.backgroundColor}; color: ${t.textColor}; padding: 2px 6px; border-radius: 4px;">Generated by Visual Agent</div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    function renderThumbnails() {
        thumbnailContainer.innerHTML = '';
        generatedSlides.forEach((slide, index) => {
            const thumbHTML = `
                <div class="thumb-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <span class="thumb-number">Slide ${index + 1}</span>
                    <div class="thumb-box">
                        ${slide.type === 'title' ? `<img src="${slide.background}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=40';">` : 
                          (slide.visualType === 'image' ? `<img src="${slide.media}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&q=40';">` : `<div class="placeholder-preview">▶ Video Simulation</div>`)
                        }
                    </div>
                </div>
            `;
            thumbnailContainer.innerHTML += thumbHTML;
        });

        document.querySelectorAll('.thumb-item').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                renderSlide(idx);
            });
        });
    }

    function renderSlide(index) {
        currentSlideIndex = index;
        const slide = generatedSlides[index];
        activeSlideContainer.innerHTML = generateSlideHTML(slide);
        
        slideCounter.textContent = `${index + 1} / ${generatedSlides.length}`;
        
        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
        document.querySelector(`.thumb-item[data-index="${index}"]`).classList.add('active');

        prevSlideBtn.style.opacity = index === 0 ? '0.3' : '1';
        nextSlideBtn.style.opacity = index === generatedSlides.length - 1 ? '0.3' : '1';
    }

    // Navigation Controls
    prevSlideBtn.addEventListener('click', () => {
        if(currentSlideIndex > 0) renderSlide(currentSlideIndex - 1);
    });
    
    nextSlideBtn.addEventListener('click', () => {
        if(currentSlideIndex < generatedSlides.length - 1) renderSlide(currentSlideIndex + 1);
    });

    closeStudioBtn.addEventListener('click', () => {
        studioView.classList.add('hidden');
        homeView.classList.remove('hidden');
    });

    document.addEventListener('keydown', (e) => {
        if (!studioView.classList.contains('hidden') && fullscreenView.classList.contains('hidden')) {
            if (e.key === 'ArrowRight') nextSlideBtn.click();
            if (e.key === 'ArrowLeft') prevSlideBtn.click();
        } else if (!fullscreenView.classList.contains('hidden')) {
            if (e.key === 'ArrowRight' && currentSlideIndex < generatedSlides.length - 1) {
                renderSlide(currentSlideIndex + 1);
                renderFullscreenSlide();
            }
            if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
                renderSlide(currentSlideIndex - 1);
                renderFullscreenSlide();
            }
            if (e.key === 'Escape') {
                exitFullscreenBtn.click();
            }
        }
    });

    // Fullscreen Mode
    function renderFullscreenSlide() {
        fullscreenSlideContainer.innerHTML = generateSlideHTML(generatedSlides[currentSlideIndex]);
    }

    presentBtn.addEventListener('click', () => {
        fullscreenView.classList.remove('hidden');
        renderFullscreenSlide();
        if (fullscreenView.requestFullscreen) {
            fullscreenView.requestFullscreen().catch(err => {
                console.log("Error attempting to activate fullscreen:", err);
            });
        }
    });

    exitFullscreenBtn.addEventListener('click', () => {
        fullscreenView.classList.add('hidden');
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    });

    // --- PDF / PRINT LOGIC ---
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        // Create container for print slides
        const printContainer = document.createElement('div');
        printContainer.id = 'printContainer';
        document.body.appendChild(printContainer);

        downloadPdfBtn.addEventListener('click', () => {
            if (generatedSlides.length === 0) {
                alert("Please generate a presentation first.");
                return;
            }
            
            // Build printable versions of the slides sequentially
            printContainer.innerHTML = '';
            generatedSlides.forEach(slide => {
                const slideHTML = generateSlideHTML(slide);
                printContainer.innerHTML += `<div class="print-slide"><div class="slide-wrapper">${slideHTML}</div></div>`;
            });

            // Trigger print dialog
            setTimeout(() => {
                window.print();
                printContainer.innerHTML = ''; // Clean up heavy DOM post-print
            }, 300);
        });
    }
});
