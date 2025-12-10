// ========================================
// Floating Chat Widget - Digimetalab
// With Language Switcher (EN/ID)
// ========================================

class ChatWidget {
    constructor() {
        this.isMenuOpen = false;
        this.isChatOpen = false;
        this.isLoading = false;
        this.messages = [];
        this.whatsappNumber = '6289667332777';
        this.apiEndpoint = '/.netlify/functions/chat';
        this.currentLang = localStorage.getItem('chatLang') || 'en';

        // Translations
        this.translations = {
            en: {
                aiAssistant: 'AI Assistant',
                aiDesc: 'Chat with our AI Agent',
                whatsapp: 'WhatsApp',
                whatsappDesc: 'Chat with our team',
                chatTitle: 'Digimetalab AI',
                online: 'Online',
                welcomeTitle: 'Hi! I\'m Digimetalab AI Assistant',
                welcomeText: 'I\'m ready to help answer your questions about automation services, AI solutions, and business consulting.',
                quickAction1: 'What services does Digimetalab offer?',
                quickAction2: 'How much does consultation cost?',
                quickAction3: 'How do I get started?',
                placeholder: 'Type your message...',
                errorMsg: 'Sorry, an error occurred. Please try again or contact us via WhatsApp.',
                whatsappMsg: 'Hi, I would like to ask about Digimetalab services.'
            },
            id: {
                aiAssistant: 'AI Assistant',
                aiDesc: 'Chat dengan AI Agent kami',
                whatsapp: 'WhatsApp',
                whatsappDesc: 'Chat dengan tim kami',
                chatTitle: 'Digimetalab AI',
                online: 'Online',
                welcomeTitle: 'Halo! Saya AI Assistant Digimetalab',
                welcomeText: 'Saya siap membantu menjawab pertanyaan Anda tentang layanan automation, AI solutions, dan konsultasi bisnis.',
                quickAction1: 'Apa saja layanan Digimetalab?',
                quickAction2: 'Berapa biaya konsultasi?',
                quickAction3: 'Bagaimana cara memulai?',
                placeholder: 'Ketik pesan Anda...',
                errorMsg: 'Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.',
                whatsappMsg: 'Halo, saya ingin bertanya tentang layanan Digimetalab.'
            }
        };

        this.init();
    }

    t(key) {
        return this.translations[this.currentLang][key] || key;
    }

    init() {
        this.createWidget();
        this.bindEvents();
        this.addWelcomeMessage();
        this.updateLanguage();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'chat-widget';
        widget.id = 'chatWidget';

        widget.innerHTML = `
            <!-- Floating Action Button -->
            <button class="chat-fab" id="chatFab" aria-label="Open chat menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>

            <!-- Chat Menu Popup -->
            <div class="chat-menu" id="chatMenu">
                <button class="chat-option-big whatsapp" id="openWhatsapp">
                    <div class="chat-option-big-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                    </div>
                    <div class="chat-option-big-text">
                        <h4 data-i18n="whatsapp">WhatsApp</h4>
                        <p data-i18n="whatsappDesc">Chat with our team</p>
                    </div>
                </button>
                
                <button class="chat-option-big ai-agent" id="openAiChat">
                    <div class="chat-option-big-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>
                        </svg>
                    </div>
                    <div class="chat-option-big-text">
                        <h4 data-i18n="aiAssistant">AI Assistant</h4>
                        <p data-i18n="aiDesc">Chat with our AI Agent</p>
                    </div>
                </button>
            </div>

            <!-- AI Chat Window -->
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <div class="chat-header-info">
                        <div class="chat-header-avatar">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
                            </svg>
                        </div>
                        <div class="chat-header-text">
                            <h4 data-i18n="chatTitle">Digimetalab AI</h4>
                            <p><span class="online-dot"></span><span data-i18n="online">Online</span></p>
                        </div>
                    </div>
                    <div class="chat-header-actions">
                        <div class="lang-switcher" id="langSwitcher">
                            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" data-lang="en">
                                <span class="flag-icon">🇺🇸</span>
                                <span>EN</span>
                            </button>
                            <button class="lang-btn ${this.currentLang === 'id' ? 'active' : ''}" data-lang="id">
                                <span class="flag-icon">🇮🇩</span>
                                <span>ID</span>
                            </button>
                        </div>
                        <button class="chat-close-btn" id="closeChatWindow" aria-label="Close chat">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <!-- Messages will be added here -->
                </div>
                
                <div class="chat-input-area">
                    <div class="chat-input-wrapper">
                        <textarea 
                            class="chat-input" 
                            id="chatInput" 
                            data-i18n-placeholder="placeholder"
                            placeholder="Type your message..."
                            rows="1"
                        ></textarea>
                        <button class="chat-send-btn" id="chatSendBtn" aria-label="Send message">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 2L11 13"/>
                                <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(widget);

        // Cache DOM elements
        this.fab = document.getElementById('chatFab');
        this.menu = document.getElementById('chatMenu');
        this.chatWindow = document.getElementById('chatWindow');
        this.messagesContainer = document.getElementById('chatMessages');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSendBtn');
    }

    bindEvents() {
        // FAB click - toggle menu
        this.fab.addEventListener('click', () => this.toggleMenu());

        // AI Chat option
        document.getElementById('openAiChat').addEventListener('click', () => {
            this.closeMenu();
            this.openChat();
        });

        // WhatsApp option
        document.getElementById('openWhatsapp').addEventListener('click', () => {
            this.openWhatsApp();
        });

        // Close chat window
        document.getElementById('closeChatWindow').addEventListener('click', () => {
            this.closeChat();
        });

        // Send message
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Enter to send (Shift+Enter for new line)
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.input.addEventListener('input', () => {
            this.input.style.height = 'auto';
            this.input.style.height = Math.min(this.input.scrollHeight, 120) + 'px';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const widget = document.getElementById('chatWidget');
            if (!widget.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Quick action buttons (after they're added)
        this.messagesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const message = e.target.textContent;
                this.input.value = message;
                this.sendMessage();
            }
        });

        // Language switcher
        document.getElementById('langSwitcher').addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-btn');
            if (btn) {
                const lang = btn.dataset.lang;
                this.switchLanguage(lang);
            }
        });
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('chatLang', lang);
        this.updateLanguage();

        // Update active state
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'switch_language', {
                'event_category': 'Chat Widget',
                'event_label': lang.toUpperCase()
            });
        }
    }

    updateLanguage() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.translations[this.currentLang][key]) {
                el.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.dataset.i18nPlaceholder;
            if (this.translations[this.currentLang][key]) {
                el.placeholder = this.translations[this.currentLang][key];
            }
        });

        // Update welcome message if visible
        const welcome = this.messagesContainer.querySelector('.chat-welcome');
        if (welcome) {
            this.addWelcomeMessage();
        }
    }

    toggleMenu() {
        if (this.isChatOpen) {
            this.closeChat();
            return;
        }

        this.isMenuOpen = !this.isMenuOpen;
        this.menu.classList.toggle('active', this.isMenuOpen);
        this.fab.classList.toggle('active', this.isMenuOpen);
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.menu.classList.remove('active');
        this.fab.classList.remove('active');
    }

    openChat() {
        this.isChatOpen = true;
        this.chatWindow.classList.add('active');
        this.fab.classList.add('active');
        this.input.focus();
    }

    closeChat() {
        this.isChatOpen = false;
        this.chatWindow.classList.remove('active');
        this.fab.classList.remove('active');
    }

    openWhatsApp() {
        const message = encodeURIComponent(this.t('whatsappMsg'));
        const url = `https://wa.me/${this.whatsappNumber}?text=${message}`;
        window.open(url, '_blank');
        this.closeMenu();

        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                'event_category': 'Chat Widget',
                'event_label': 'WhatsApp'
            });
        }
    }

    addWelcomeMessage() {
        const welcomeHTML = `
            <div class="chat-welcome">
                <div class="chat-welcome-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"/>
                    </svg>
                </div>
                <h4>${this.t('welcomeTitle')}</h4>
                <p>${this.t('welcomeText')}</p>
                <div class="chat-quick-actions">
                    <button class="quick-action-btn">${this.t('quickAction1')}</button>
                    <button class="quick-action-btn">${this.t('quickAction2')}</button>
                    <button class="quick-action-btn">${this.t('quickAction3')}</button>
                </div>
            </div>
        `;

        this.messagesContainer.innerHTML = welcomeHTML;
    }

    addMessage(content, isUser = false) {
        // Remove welcome message if it exists
        const welcome = this.messagesContainer.querySelector('.chat-welcome');
        if (welcome) {
            welcome.remove();
        }

        const messageHTML = `
            <div class="chat-message ${isUser ? 'user' : 'bot'}">
                <div class="chat-message-avatar">
                    ${isUser ?
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>' :
                '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>'
            }
                </div>
                <div class="chat-message-bubble">${this.escapeHTML(content)}</div>
            </div>
        `;

        this.messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    addTypingIndicator() {
        const typingHTML = `
            <div class="chat-message bot" id="typingIndicator">
                <div class="chat-message-avatar">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
                    </svg>
                </div>
                <div class="chat-message-bubble">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;

        this.messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    addErrorMessage(message) {
        const errorHTML = `<div class="chat-error">${message || this.t('errorMsg')}</div>`;
        this.messagesContainer.insertAdjacentHTML('beforeend', errorHTML);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage(message, true);
        this.input.value = '';
        this.input.style.height = 'auto';

        // Show loading state
        this.isLoading = true;
        this.sendBtn.classList.add('loading');
        this.sendBtn.disabled = true;
        this.addTypingIndicator();

        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'send_message', {
                'event_category': 'Chat Widget',
                'event_label': 'AI Chat'
            });
        }

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    language: this.currentLang,
                    history: this.messages.slice(-10)
                })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            this.removeTypingIndicator();
            this.addMessage(data.reply);

            // Store messages for context
            this.messages.push({ role: 'user', content: message });
            this.messages.push({ role: 'assistant', content: data.reply });

        } catch (error) {
            console.error('Chat error:', error);
            this.removeTypingIndicator();
            this.addErrorMessage();
        } finally {
            this.isLoading = false;
            this.sendBtn.classList.remove('loading');
            this.sendBtn.disabled = false;
            this.input.focus();
        }
    }
}

// Initialize widget when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new ChatWidget();
    }, 1000);
});
