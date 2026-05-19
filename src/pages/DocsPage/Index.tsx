import { motion } from 'framer-motion';
import { Copy, Check, Moon, Sun, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import styles from './Index.module.css';
import Logo from '../../components/Logo';
import { useTheme } from '../../contexts/ThemeContext';

const CodeBlock = ({ language, code }: { language: string, code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLabel}>{language}</span>
        <button className={styles.copyBtn} onClick={handleCopy} aria-label="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

const DocsPage = () => {
  const [copiedText, setCopiedText] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const handleCopyPageText = () => {
    const text = document.querySelector('main')?.innerText || document.body.innerText;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const codeBlocks = {
    pythonBasic: `from openai import OpenAI

client = OpenAI(
    base_url="https://crof.ai/v1",
    api_key="api-key-here"
)
response = client.chat.completions.create(
    model="MODEL-FROM-LIST",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.choices[0].message.content)`,
    
    pythonStreaming: `from openai import OpenAI

client = OpenAI(
    base_url="https://crof.ai/v1",
    api_key="api-key-here"
)

response = client.chat.completions.create(
    model="MODEL-FROM-LIST",
    messages=[
        {"role": "user", "content": "Howdy there! How are you?"}
    ],
    stream=True  # Enable streaming
)

for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()`,

    pythonReasoning: `from openai import OpenAI

client = OpenAI(
    base_url="https://crof.ai/v1",
    api_key="api-key-here"
)

response = client.chat.completions.create(
    model="MODEL-FROM-LIST",
    messages=[
        {"role": "user", "content": "Howdy there! How are you?"}
    ],
    stream=True  # Enable streaming
)

for chunk in response:
    try:
        if chunk.choices and chunk.choices[0].delta.reasoning_content:
            print(chunk.choices[0].delta.reasoning_content, end="", flush=True)
    except AttributeError:
        pass
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()`,

    pythonToolUse: `from openai import OpenAI
import json

client = OpenAI(
    base_url="https://crof.ai/v1",
    api_key="api-key-here"
)

tools = [{ # tootally original example
    "type": "function",
    "function": {
        "name": "get_horoscope",
        "description": "Get today's horoscope for an astrological sign.",
        "parameters": {
            "type": "object",
            "properties": {
                "sign": {
                    "type": "string",
                    "description": "An astrological sign like Taurus or Aquarius",
                },
            },
            "required": ["sign"],
            "additionalProperties": False,
        },
        "strict": True,
    },
}]

def get_horoscope(sign):
    return f"{sign}: Next Tuesday you will befriend a baby otter."

messages = [
    {"role": "user", "content": "What is my horoscope? I am an Aquarius."}
]

stream = client.chat.completions.create(
    model="MODEL-FROM-LIST",
    messages=messages,
    tools=tools,
    stream=True
)

for chunk in stream:
    delta = chunk.choices[0].delta

    if delta.content:
        print(delta.content, end="", flush=True)

    if delta.tool_calls:
        for tc in delta.tool_calls:
            print(f"\\nTool call: {tc.function.name}")
            if tc.function.arguments:
                print(f"Args: {tc.function.arguments}")`,

    pythonVision: `from openai import OpenAI

client = OpenAI(
    base_url="https://crof.ai/v1",
    api_key="api-key-here"
)

response = client.chat.completions.create(
    model="kimi-k2.5", # vision models are labeled in the pricing page with the (vision) tag
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What is in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://files.nahcrof.com/file/crofai-black.png",
                    },
                },
            ],
        }
    ],
    stream=True
)

for chunk in response:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()`,

    pythonStructured: `from openai import OpenAI

client = OpenAI(
    base_url="https://crof.ai/v1",
    api_key="api-key-here"
)

response = client.chat.completions.create(
    model="MODEL-FROM-LIST",
    messages=[
        {"role": "user", "content": "List 3 planets with their diameter in km and whether they have rings."}
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "planet_list",
            "strict": True,
            "schema": {
                "type": "object",
                "properties": {
                    "planets": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "name": {"type": "string"},
                                "diameter_km": {"type": "number"},
                                "has_rings": {"type": "boolean"}
                            },
                            "required": ["name", "diameter_km", "has_rings"],
                            "additionalProperties": False
                        }
                    }
                },
                "required": ["planets"],
                "additionalProperties": False
            }
        }
    }
)
print(response.choices[0].message.content)`,

    modelsJson: `{
    "context_length": 163840,
    "created": 1755799640,
    "id": "deepseek-v3.2",
    "max_completion_tokens": 163840,
    "name": "DeepSeek: DeepSeek V3.2",
    "pricing": {
        "completion": "0.00000038", // $0.38/m output
        "prompt": "0.00000028" // $0.28/m input
    },
    "quantization": "Q4_0",
    "speed": 50 // rough estimate
}`,

    endpoints: `https://crof.ai/v2/chat/completions
https://crof.ai/v1/chat/completions

// Anthropic endpoint:
https://anthropic.nahcrof.com/v1/messages`,

    reasoningEffort: `response = client.chat.completions.create(
    model="MODEL-FROM-LIST",
    messages=[
        {"role": "user", "content": "Solve this step by step: what is 17 * 38?"}
    ],
    reasoning_effort="low"
)`,

    usageRequest: `GET https://crof.ai/usage_api/
Authorization: Bearer YOUR_API_KEY`,

    usageResponse: `{
    "usable_requests": 450,  // requests left today (null if not on a subscription plan)
    "credits": 12.3456       // available credit balance
}`,

    usageBash: `curl https://crof.ai/usage_api/ \\
  -H "Authorization: Bearer YOUR_API_KEY"`,

    usagePython: `import requests

response = requests.get(
    "https://crof.ai/usage_api/",
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)
data = response.json()
print(f"Requests left: {data['usable_requests']}")
print(f"Credits: {data['credits']}")`,

    openCodeJson: `{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "CrofAI": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "CrofAI",
      "options": {
        "baseURL": "https://crof.ai/v1",
        "apiKey": "API_KEY_HERE"
      },
      "models": {
        "kimi-k2.5": {
          "name": "CrofAI: kimi-k2.5",
          "limit": { "context": 262144, "output": 262144 }
        },
        "kimi-k2.5-lightning": {
          "name": "CrofAI: kimi-k2.5-lightning",
          "limit": { "context": 131072, "output": 32768 }
        },
        "glm-5.1": {
          "name": "CrofAI: glm-5.1",
          "limit": { "context": 202752, "output": 202752 }
        },
        "glm-5.1-precision": {
          "name": "CrofAI: glm-5.1-precision",
          "limit": { "context": 202752, "output": 202752 }
        },
        "glm-5": {
          "name": "CrofAI: glm-5",
          "limit": { "context": 202752, "output": 202752 }
        },
        "glm-4.7": {
          "name": "CrofAI: glm-4.7",
          "limit": { "context": 202752, "output": 202752 }
        },
        "glm-4.7-flash": {
          "name": "CrofAI: glm-4.7-flash",
          "limit": { "context": 202752, "output": 131072 }
        },
        "gemma-4-31b-it": {
          "name": "CrofAI: gemma-4-31b-it",
          "limit": { "context": 262144, "output": 262144 }
        },
        "minimax-m2.5": {
          "name": "CrofAI: minimax-m2.5",
          "limit": { "context": 204144, "output": 131072 }
        },
        "qwen3.5-397b-a17b": {
          "name": "CrofAI: qwen3.5-397b-a17b",
          "limit": { "context": 262144, "output": 262144 }
        },
        "deepseek-v3.2": {
          "name": "CrofAI: deepseek-v3.2",
          "limit": { "context": 163840, "output": 163840 }
        }
      }
    }
  }
}`,

    openCodeBash: `export CROFAI_API_KEY="your-api-key-here"`
  };

  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <Logo />
        <div className={styles.navLinks}>
          <a href="#/docs" className={styles.navLink}>Docs</a>
          <a href="#/plan" className={styles.navLink}>Pricing</a>
          <a href="#/dashboard" className={styles.navLink}>Sign In</a>
        </div>
        <div className={styles.navActions}>
          <button className={styles.themeToggle} onClick={toggleTheme} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a href="#/dashboard" className={styles.cta}>
            Get Started <TerminalSquare size={16} />
          </a>
        </div>
      </nav>

      <div className={styles.docsContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarMenu}>
            <span className={styles.menuHeader}>API / SDK</span>
            <a href="#/docs/python-basic" className={styles.menuItem}>Python (no Streaming)</a>
            <a href="#/docs/python-streaming" className={styles.menuItem}>Python (with Streaming)</a>
            <a href="#/docs/python-reasoning" className={styles.menuItem}>Python (Reasoning)</a>
            <a href="#/docs/python-tool-use" className={styles.menuItem}>Python (Tool Use)</a>
            <a href="#/docs/python-vision" className={styles.menuItem}>Python (Vision)</a>
            <a href="#/docs/python-structured" className={styles.menuItem}>Python (Structured)</a>
            
            <span className={styles.menuHeader} style={{marginTop: '2rem'}}>Endpoints & Config</span>
            <a href="#/docs/models-api" className={styles.menuItem}>/models API</a>
            <a href="#/docs/optional-endpoints" className={styles.menuItem}>Optional endpoints</a>
            <a href="#/docs/supported-parameters" className={styles.menuItem}>Supported Parameters</a>
            <a href="#/docs/reasoning-effort" className={styles.menuItem}>Reasoning Effort</a>
            
            <span className={styles.menuHeader} style={{marginTop: '2rem'}}>Account</span>
            <a href="#/docs/usage-api" className={styles.menuItem}>/usage_api/</a>
            
            <span className={styles.menuHeader} style={{marginTop: '2rem'}}>Integrations</span>
            <a href="#/docs/opencode" className={styles.menuItem}>OpenCode Integration</a>
          </div>
        </aside>

        {/* Content */}
        <motion.main 
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.contentHeader}>
            <div className={styles.headerLeft}>
              <h1 className={styles.pageTitle}>API Documentation</h1>
              <p className={styles.pageSub}>Integrate CrofAI into your applications.</p>
            </div>
            <button className={styles.copyPageBtn} onClick={handleCopyPageText} aria-label="Copy page text">
              {copiedText ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedText ? 'Copied!' : 'Copy Page'}</span>
            </button>
          </div>
          
          <section className={styles.section} id="api-sdk">
            <h2 className={styles.sectionTitle}>API/SDK</h2>
            <p className={styles.paragraph}>CrofAI supports the OpenAI SDK for LLM inference. Below will be python examples.</p>
            
            <h3 className={styles.subTitle} id="python-basic">Python (no Streaming)</h3>
            <CodeBlock language="python" code={codeBlocks.pythonBasic} />

            <h3 className={styles.subTitle} id="python-streaming">Python (with Streaming)</h3>
            <CodeBlock language="python" code={codeBlocks.pythonStreaming} />

            <h3 className={styles.subTitle} id="python-reasoning">Python (reasoning model example)</h3>
            <CodeBlock language="python" code={codeBlocks.pythonReasoning} />

            <h3 className={styles.subTitle} id="python-tool-use">Python (tool use)</h3>
            <CodeBlock language="python" code={codeBlocks.pythonToolUse} />

            <h3 className={styles.subTitle} id="python-vision">Python (vision models)</h3>
            <CodeBlock language="python" code={codeBlocks.pythonVision} />

            <h3 className={styles.subTitle} id="python-structured">Python (structured outputs)</h3>
            <CodeBlock language="python" code={codeBlocks.pythonStructured} />
          </section>

          <section className={styles.section} id="models-api">
            <h2 className={styles.sectionTitle}>/models API</h2>
            <p className={styles.paragraph}>When visiting <code>/v1/models</code> you will receive a standard JSON list containing each model. Each model should look as follows:</p>
            <CodeBlock language="json" code={codeBlocks.modelsJson} />
          </section>

          <section className={styles.section} id="optional-endpoints">
            <h2 className={styles.sectionTitle}>Optional endpoints</h2>
            
            <h3 className={styles.subTitle}>OpenAI Compatible</h3>
            <p className={styles.paragraph}><code>base_url: https://crof.ai/v2</code> (the original endpoint)</p>
            <p className={styles.paragraph}>OR</p>
            <p className={styles.paragraph}><code>base_url: https://crof.ai/v1</code> (same thing, just more standard)</p>
            <CodeBlock language="code" code={codeBlocks.endpoints.split('\n\n')[0] || ''} />

            <h3 className={styles.subTitle}>Anthropic endpoint</h3>
            <p className={styles.paragraph}><code>base_url: https://anthropic.nahcrof.com</code></p>
            <CodeBlock language="code" code={(codeBlocks.endpoints.split('\n\n')[1] || '').replace('// Anthropic endpoint:\n', '')} />
          </section>

          <section className={styles.section} id="supported-parameters">
            <h2 className={styles.sectionTitle}>Supported Parameters</h2>
            <ul className={styles.list}>
              <li><code>max_tokens</code></li>
              <li><code>temperature</code></li>
              <li><code>top_p</code></li>
              <li><code>stop</code></li>
              <li><code>seed</code></li>
              <li><code>tools</code></li>
              <li><code>reasoning_effort</code></li>
              <li><code>response_format</code></li>
            </ul>
          </section>

          <section className={styles.section} id="reasoning-effort">
            <h2 className={styles.sectionTitle}>Reasoning Effort</h2>
            <p className={styles.paragraph}>For reasoning models, you can control how much the model thinks before responding using the <code>reasoning_effort</code> parameter. Accepted values are <code>"low"</code>, <code>"medium"</code>, <code>"high"</code>, or <code>"none"</code> (disables reasoning entirely).</p>
            <CodeBlock language="python" code={codeBlocks.reasoningEffort} />
            <p className={styles.paragraph}>Setting <code>reasoning_effort</code> to <code>"none"</code> disables the thinking/reasoning phase completely, which reduces latency and cost. Higher values allow the model more compute budget for complex problems.</p>
          </section>

          <section className={styles.section} id="usage-api">
            <h2 className={styles.sectionTitle}>/usage_api/</h2>
            <p className={styles.paragraph}>Check your account's remaining usage and credits.</p>
            
            <h3 className={styles.subTitle}>Request</h3>
            <CodeBlock language="code" code={codeBlocks.usageRequest} />
            
            <h3 className={styles.subTitle}>Response</h3>
            <CodeBlock language="json" code={codeBlocks.usageResponse} />
            
            <h3 className={styles.subTitle}>curl</h3>
            <CodeBlock language="bash" code={codeBlocks.usageBash} />

            <h3 className={styles.subTitle}>Python</h3>
            <CodeBlock language="python" code={codeBlocks.usagePython} />
          </section>

          <section className={styles.section} id="opencode">
            <h2 className={styles.sectionTitle}>OpenCode Integration</h2>
            <p className={styles.paragraph}>CrofAI can be used as a provider in OpenCode. To set it up, create an <code>opencode.json</code> file in your project root (or at <code>~/.config/opencode/opencode.json</code> for global config) with the following contents:</p>
            <CodeBlock language="json" code={codeBlocks.openCodeJson} />
            
            <p className={styles.paragraph}>Set your API key as an environment variable:</p>
            <CodeBlock language="bash" code={codeBlocks.openCodeBash} />
            <p className={styles.paragraph}>Then open OpenCode and select CrofAI as your provider. CrofAI uses a standard <code>/v1/chat/completions</code> endpoint, so it works with any OpenAI-compatible integration in OpenCode.</p>
          </section>

        </motion.main>
      </div>
    </div>
  );
};

export default DocsPage;
