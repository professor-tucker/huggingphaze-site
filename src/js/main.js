/*
File: main.js
Version: 1.0.0
Directory: huggingphaze.com/src/js/
Description: Handles the interactive logic for the HuggingPhaze Social Spark Generator.
Notes:
  - Manages UI state changes based on user input and simulated AI responses (green, yellow-gold, red themes).
  - Integrates haptic feedback (vibration API) and visual sound captions for accessibility.
  - Contains a placeholder `callAIAPI` function which must be replaced with an actual call to a secure serverless function proxy.
  - Includes client-side input validation for basic user guidance.
  - Dynamic updates to output and status messages.
  - The `playFeedback` function is currently a placeholder for actual audio playback; audio files would need to be added.
*/
document.addEventListener('DOMContentLoaded', () => {
    const generateSparkBtn = document.getElementById('generateSparkBtn');
    const outputArea = document.getElementById('outputArea');
    const statusMessage = document.getElementById('statusMessage');
    const postTopic = document.getElementById('postTopic');
    const targetPlatform = document.getElementById('targetPlatform');
    const desiredTone = document.getElementById('desiredTone');
    const body = document.body;
    const questionMarkBtn = document.querySelector('.question-mark-btn');
    const soundCaptionHeader = document.getElementById('soundCaptionHeader');
    const soundCaptionButton = document.getElementById('soundCaptionButton');

    // --- Audio and Haptic Feedback ---
    // Function to play sound and show caption
    const playFeedback = (type, captionText, captionElement) => {
        // Haptic feedback (vibrates if supported by device)
        if (navigator.vibrate) {
            switch (type) {
                case 'click':
                    navigator.vibrate(50); // Short vibration
                    break;
                case 'success':
                    navigator.vibrate([100, 30, 100]); // Two short vibrations
                    break;
                case 'warning':
                    navigator.vibrate(200); // Medium vibration
                    break;
                case 'error':
                    navigator.vibrate([200, 100, 200]); // Longer, distinct vibration
                    break;
            }
        }

        // Sound caption display
        if (captionElement) {
            captionElement.textContent = `(${captionText}!)`;
            captionElement.classList.add('active');
            setTimeout(() => {
                captionElement.classList.remove('active');
                captionElement.textContent = '';
            }, 1500); // Caption visible for 1.5 seconds
        }

        // Placeholder for actual audio playback
        // In a real scenario, you'd load and play audio files here:
        // const audio = new Audio(`sounds/${type}.mp3`);
        // audio.play();
    };

    // --- UI State Management (Color System) ---
    const setUIState = (state) => {
        body.className = ''; // Clear previous themes
        body.classList.add(`theme-${state}`);
        // Ensure all relevant elements update their colors via CSS variables or classes
        // The CSS is designed so that `body.theme-X` classes cascade correctly.
    };

    // Initial state
    setUIState('green');

    // --- Placeholder for API call ---
    const callAIAPI = async (topic, platform, tone) => {
        // THIS IS THE CRITICAL PART FOR INTEGRATION:
        // Replace this with your actual call to your serverless function proxy.
        // Example for a Cloudflare Worker at `/api/generate-spark`:
        /*
        try {
            const response = await fetch('/api/generate-spark', { // Or your full Worker URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, platform, tone }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API call failed:', error);
            return {
                success: false,
                error: true,
                message: `Failed to connect to AI: ${error.message || 'Network error'}`,
            };
        }
        */

        // For now, simulating network delay and different outcomes
        return new Promise(resolve => {
            setTimeout(() => {
                const randomOutcome = Math.random();
                if (randomOutcome < 0.7) { // 70% chance of success
                    resolve({
                        success: true,
                        posts: [
                            `Here's a fresh post about ${topic} for ${platform} in a ${tone} tone! #HuggingPhaze`,
                            `Another great idea for your ${platform} about ${topic}! Get inspired!`,
                            `Your AI-powered ${platform} post: ${topic} - ${tone} vibes only.`,
                        ]
                    });
                } else if (randomOutcome < 0.9) { // 20% chance of warning/complexity
                    resolve({
                        success: false,
                        warning: true,
                        message: "The AI found your request a bit complex. Try simplifying or adding more details. Here's what I got:",
                        posts: [
                            `A slightly less specific post for ${platform}: ${topic}.`,
                        ]
                    });
                } else { // 10% chance of error
                    resolve({
                        success: false,
                        error: true,
                        message: "Error! The AI encountered an unexpected issue. Please try again with a simpler request.",
                    });
                }
            }, 1500); // Simulate 1.5 second API call
        });
    };

    // --- Event Listeners ---
    generateSparkBtn.addEventListener('click', async () => {
        playFeedback('click', 'Click', soundCaptionButton);

        const topic = postTopic.value.trim();
        const platform = targetPlatform.value;
        const tone = desiredTone.value;

        if (!topic) {
            outputArea.innerHTML = '<p style="color: var(--color-red-bright);">Please tell us what your post is about!</p>';
            statusMessage.textContent = 'Action Required: Topic cannot be empty.';
            setUIState('red');
            playFeedback('error', 'Error', statusMessage); // Use statusMessage for error sound caption
            return;
        }

        outputArea.innerHTML = '<p>Sparking your ideas...</p>';
        statusMessage.textContent = 'Processing request...';
        setUIState('green'); // Reset to green while processing

        const result = await callAIAPI(topic, platform, tone);

        if (result.success) {
            outputArea.innerHTML = result.posts.map(post => `
                <div class="generated-post">
                    <p>${post}</p>
                    <button class="copy-btn">Copy</button>
                </div>
            `).join('');
            statusMessage.textContent = 'Success! You earned 10 Spark Points!';
            setUIState('green');
            playFeedback('success', 'Success', statusMessage);
        } else if (result.warning) {
            outputArea.innerHTML = result.posts.map(post => `
                <div class="generated-post">
                    <p>${post}</p>
                    <button class="copy-btn">Copy</button>
                </div>
            `).join('');
            statusMessage.textContent = result.message;
            setUIState('yellow-gold');
            playFeedback('warning', 'Warning', statusMessage);
        } else if (result.error) {
            outputArea.innerHTML = `<p style="color: var(--color-red-bright);">${result.message}</p>`;
            statusMessage.textContent = 'Please simplify your request and try again.';
            setUIState('red');
            playFeedback('error', 'Error', statusMessage);
        }

        // Add event listeners to new copy buttons
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                playFeedback('click', 'Click', soundCaptionButton); // Use soundCaptionButton for copy click feedback
                const textToCopy = e.target.previousElementSibling.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    e.target.textContent = 'Copied!';
                    setTimeout(() => e.target.textContent = 'Copy', 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
        });
    });

    questionMarkBtn.addEventListener('click', () => {
        playFeedback('click', 'Click', soundCaptionHeader);
        alert(
            "Welcome to HuggingPhaze!\n\n" +
            "This system helps you generate content using AI. Watch and feel the colors!\n\n" +
            "🟢 Green: Everything is good! Keep going.\n" +
            "🟡 Yellow: You're in advanced territory or the AI found your request a bit complex. Review your input.\n" +
            "🔴 Red: An error occurred or your request was too complex. Take a step back and simplify.\n\n" +
            "Happy sparking!"
        );
    });

    // --- Input field changes can trigger UI state changes (e.g., if too much text is entered) ---
    postTopic.addEventListener('input', () => {
        // Example threshold for yellow-gold state due to complexity
        if (postTopic.value.length > 200 && body.classList.contains('theme-green')) {
            statusMessage.textContent = "Your topic is getting quite detailed. AI works best with focused input.";
            setUIState('yellow-gold');
            playFeedback('warning', 'Warning', statusMessage);
        } else if (postTopic.value.length <= 200 && !body.classList.contains('theme-red-bright')) {
            // Revert to green if simplified, unless it's an active error state
            if (body.classList.contains('theme-yellow-gold')) { // Only play if actually changing state
                setUIState('green'); 
                statusMessage.textContent = ''; // Clear status unless there's another message
                playFeedback('success', 'Reset', statusMessage); // Indicate return to normal
            }
        }
    });

    // Add similar listeners for other inputs if their complexity can trigger state changes
});