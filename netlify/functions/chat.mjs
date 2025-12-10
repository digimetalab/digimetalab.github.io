// Netlify Function: Chat with Groq API
// Endpoint: /.netlify/functions/chat
// All parameters are configurable via environment variables

export default async (request, context) => {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { message, history = [], language = 'id' } = await request.json();

        if (!message || typeof message !== 'string') {
            return new Response(JSON.stringify({ error: 'Message is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get configuration from environment variables
        const GROQ_API_KEY = Netlify.env.get('GROQ_API_KEY');
        const GROQ_MODEL = Netlify.env.get('GROQ_MODEL') || 'llama-3.3-70b-versatile';
        const GROQ_MAX_TOKENS = parseInt(Netlify.env.get('GROQ_MAX_TOKENS') || '500', 10);
        const GROQ_TEMPERATURE = parseFloat(Netlify.env.get('GROQ_TEMPERATURE') || '0.7');
        const GROQ_TOP_P = parseFloat(Netlify.env.get('GROQ_TOP_P') || '1.0');
        const WHATSAPP_NUMBER = Netlify.env.get('WHATSAPP_NUMBER') || '6289667332777';

        // Get system prompt from env or use default
        let systemPrompt = Netlify.env.get('GROQ_SYSTEM_PROMPT');

        if (!systemPrompt) {
            systemPrompt = `Kamu adalah AI Assistant untuk Digimetalab, sebuah AI Automation Agency di Indonesia yang beroperasi di bawah PT. Digital Meta Solutions.

TENTANG DIGIMETALAB:
- Spesialisasi: Workflow Automation, Process Optimization, AI-Powered Business Solutions
- Layanan utama:
  1. Intelligent Workflow Automation - Otomatisasi tugas repetitif dan workflow kompleks
  2. Digital Process Optimization - Streamline proses bisnis dengan data-driven insights
  3. AI-Powered Business Solutions - Solusi AI untuk tantangan bisnis kompleks
  4. Enterprise System Integration - Koneksi dan sinkronisasi sistem existing
  5. Data-Driven Decision Support - Transform data menjadi insights
  6. Custom Automation Development - Solusi automation yang disesuaikan
- Website: digimetalab.my.id
- Email: contact@digimetalab.my.id

STATISTIK:
- 100+ proyek terselesaikan
- 50+ klien puas
- 85% peningkatan efisiensi rata-rata
- ROI terlihat dalam 3-6 bulan

PROSES KERJA:
1. Discover - Analisis proses bisnis dan identifikasi pain points
2. Analyze - Deep dive ke workflow dan desain solusi optimal
3. Build - Develop automation system sesuai kebutuhan
4. Deploy - Launch dengan full support dan training

TEKNOLOGI: GPT, Claude, TensorFlow, Zapier, Make, n8n, AWS, Google Cloud, Azure, PostgreSQL, MongoDB, Python, dan lainnya.

INSTRUKSI:
- Jawab dengan ramah, profesional, dan dalam Bahasa Indonesia
- Berikan informasi yang helpful tentang layanan Digimetalab
- Jika ditanya tentang harga spesifik, arahkan untuk konsultasi gratis
- Jika pertanyaan di luar scope, tetap bantu sebisa mungkin atau arahkan ke WhatsApp untuk pertanyaan lebih lanjut
- Respons singkat dan to the point (maksimal 2-3 paragraf)
- Gunakan emoji secukupnya untuk membuat respons lebih friendly`;
        } else {
            // Replace escaped newlines with actual newlines
            systemPrompt = systemPrompt.replace(/\\n/g, '\n');
        }

        // Add language instruction if English
        if (language === 'en') {
            systemPrompt += '\n\nIMPORTANT: Respond in English for this conversation.';
        }

        if (!GROQ_API_KEY) {
            console.error('GROQ_API_KEY not configured');
            return new Response(JSON.stringify({ error: 'API not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Build messages array
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        // Build request body
        const requestBody = {
            model: GROQ_MODEL,
            messages: messages,
            max_tokens: GROQ_MAX_TOKENS,
            temperature: GROQ_TEMPERATURE,
            top_p: GROQ_TOP_P,
        };

        console.log(`Calling Groq API with model: ${GROQ_MODEL}, temp: ${GROQ_TEMPERATURE}, max_tokens: ${GROQ_MAX_TOKENS}`);

        // Call Groq API
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!groqResponse.ok) {
            const errorData = await groqResponse.text();
            console.error('Groq API error:', errorData);
            return new Response(JSON.stringify({
                error: 'AI service temporarily unavailable',
                reply: language === 'en'
                    ? `Sorry, the AI service is temporarily unavailable. Please try again or contact us via WhatsApp at +${WHATSAPP_NUMBER}.`
                    : `Maaf, layanan AI sedang mengalami gangguan. Silakan coba lagi atau hubungi kami via WhatsApp di +${WHATSAPP_NUMBER}.`
            }), {
                status: 200, // Return 200 with fallback message
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await groqResponse.json();
        const reply = data.choices?.[0]?.message?.content || (language === 'en'
            ? 'Sorry, I could not process your request at this time.'
            : 'Maaf, saya tidak dapat memproses permintaan Anda saat ini.');

        return new Response(JSON.stringify({
            reply,
            model: GROQ_MODEL,
            usage: data.usage
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });

    } catch (error) {
        console.error('Function error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            reply: 'Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
