import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import styles from './CodePreview.module.css';

const pythonCode = `from openai import OpenAI

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
print(response.choices[0].message.content)`;

const jsCode = `import { OpenAI } from 'openai';

const client = new OpenAI({
    baseURL: "https://crof.ai/v1",
    apiKey: "api-key-here"
});

const response = await client.chat.completions.create({
    model: "MODEL-FROM-LIST",
    messages: [
        { role: "user", content: "Hello!" }
    ]
});
console.log(response.choices[0].message.content);`;

export const CodePreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [activeTab, setActiveTab] = useState<'python' | 'javascript'>('python');
  const [displayedCode, setDisplayedCode] = useState('');

  const codeToDisplay = activeTab === 'python' ? pythonCode : jsCode;

  useEffect(() => {
    if (!containerRef.current) return;

    // Entry animation - slide in from right
    gsap.fromTo(containerRef.current,
      { x: 80, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // Typewriter effect
    setDisplayedCode('');
    
    let charIndex = 0;
    const chars = codeToDisplay.split('');
    
    const typeInterval = setInterval(() => {
      if (charIndex < chars.length) {
        setDisplayedCode(prev => prev + chars[charIndex]);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        
        // Start floating animation after typing is complete
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            y: -8,
            duration: 2.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
          });
          
          // Add purple glow
          gsap.to(containerRef.current, {
            boxShadow: "0 0 40px rgba(124, 58, 237, 0.15)",
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
          });
        }
      }
    }, 18); // 18ms per character (faster)

    return () => clearInterval(typeInterval);
  }, [codeToDisplay]);

  // Blinking cursor effect
  useEffect(() => {
    if (!cursorRef.current) return;

    const cursorInterval = setInterval(() => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = cursorRef.current.style.opacity === '0' ? '1' : '0';
      }
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [activeTab]);

  const handleTabClick = (tab: 'python' | 'javascript') => {
    if (tab === activeTab) return;
    
    setActiveTab(tab);
    
    // Fade out/in animation for tab switch
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.15,
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.15
          });
        }
      });
    }
  };

  return (
    <div className={styles.codePreviewContainer} ref={containerRef}>
      {/* Window Chrome */}
      <div className={styles.windowChrome}>
        <div className={styles.windowDots}>
          <span className={`${styles.dot} ${styles.dotRed}`}></span>
          <span className={`${styles.dot} ${styles.dotYellow}`}></span>
          <span className={`${styles.dot} ${styles.dotGreen}`}></span>
        </div>
        <span className={styles.windowTitle}>Terminal</span>
      </div>

      {/* Tab Bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'python' ? styles.tabActive : ''}`}
          onClick={() => handleTabClick('python')}
        >
          Python
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'javascript' ? styles.tabActive : ''}`}
          onClick={() => handleTabClick('javascript')}
        >
          JavaScript
        </button>
      </div>

      {/* Code Content */}
      <div className={styles.codeContent}>
        <pre className={styles.codeBlock} ref={codeRef}>
          <code>
            {displayedCode}
            <span className={styles.cursor} ref={cursorRef}></span>
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodePreview;
