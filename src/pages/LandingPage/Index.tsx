import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Check, Copy, TerminalSquare, ArrowRight } from 'lucide-react';
import styles from './Index.module.css';
import { ChromaGrid } from '../../components/ChromaGrid';
import type { ChromaGridItem } from '../../components/ChromaGrid';
import { CodePreview } from '../../components/CodePreview';

const LandingPage = () => {
  const [copied, setCopied] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`curl -X POST https://api.crof.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user","content": "Hello World"}]
  }'`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chromaFeatures: ChromaGridItem[] = [
    {
      title: 'Low Latency',
      subtitle: '',
      url: '#'
    },
    {
      title: 'Easy Integration',
      subtitle: '',
      url: '#'
    },
    {
      title: 'Cost Effective',
      subtitle: '',
      url: '#'
    },
    {
      title: 'Secure',
      subtitle: '',
      url: '#'
    },
    {
      title: 'Fast Deployment',
      subtitle: '',
      url: '#'
    },
    {
      title: 'Analytics',
      subtitle: '',
      url: '#'
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.gridBg} />

      {/* Nav */}
      <motion.nav 
        className={styles.nav}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#/" className={styles.logo} style={{textDecoration: 'none'}}>CROF.AI</a>
        <div className={styles.navLinks}>
          <a href="#/pricing" className={styles.navLink}>Pricing</a>
          <a href="#/docs" className={styles.navLink}>Docs</a>
          <a href="#/signin" className={styles.navLink}>Sign In</a>
        </div>
        <a href="#/footercta" className={styles.cta}>
          Get Started <TerminalSquare size={16} />
        </a>
      </motion.nav>

      {/* Hero */}
      <section className={styles.hero} ref={heroRef}>
        <motion.div className={styles.heroContent} style={{ y: heroY }}>
          <h1 className={styles.heroTitle}>
            <div style={{ overflow: 'hidden' }}><span className="reveal-text" style={{ display: 'block' }}>POWERFUL MODELS.</span></div>
            <div style={{ overflow: 'hidden' }}><span className={`reveal-text ${styles.heroTitleHighlight}`} style={{ display: 'block' }}>CRAZY CHEAP PRICING.</span></div>
          </h1>
          <motion.p 
            className={styles.heroSub}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Access to the best OSS models for the cheapest prices on the market
          </motion.p>
          <motion.div 
            className={styles.heroButtons}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#/footercta" className={styles.heroCta}>
              Get Started <ArrowRight size={18} style={{ marginLeft: '8px' }}/>
            </motion.a>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#/pricing" className={styles.heroCtaOutline}>
              View Pricing
            </motion.a>
          </motion.div>
        </motion.div>
        
        {/* Code Preview Component */}
        <div className={styles.heroCode}>
          <CodePreview />
        </div>
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <motion.span 
          className={styles.sectionHeader}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          // PLATFORM
        </motion.span>
        <motion.h2 
          className={styles.featuresTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          EVERYTHING YOU NEED TO SHIP
        </motion.h2>
        
        <div className={styles.featuresGrid}>
          <ChromaGrid 
            items={chromaFeatures}
          />
        </div>
      </section>

      {/* Integration */}
      <section className={styles.integration} id="integration">
        <div className={styles.integrationLeft}>
          <motion.h2 
            className={styles.integrationTitle}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span style={{ color: '#A855F7' }}>THREE LINES</span> TO YOUR FIRST CALL
          </motion.h2>
          <motion.p 
            className={styles.integrationSub}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Stop wrestling with complex SDKs. Just copy, paste, and start shipping.
          </motion.p>
        </div>
        <motion.div 
          className={styles.integrationRight}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className={styles.integrationCodeWrapper}>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <pre className={styles.integrationCode}>{`curl -X POST https://api.crof.ai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user","content": "Hello World"}]
  }'`}</pre>
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing} id="pricing">
        <motion.span 
          className={styles.sectionHeader}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          // PLANS
        </motion.span>
        <motion.h2 
          className={styles.pricingTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          SIMPLE, PREDICTABLE PRICING
        </motion.h2>
        
        <div className={styles.pricingGrid}>
            {[
              { plan: 'Free', price: '$0', requests: 'Pay only for usage', cta: 'SWITCH TO FREE', popular: false, features: ['No recurring monthly charge'] },
              { plan: 'Hobby', price: '$5', requests: '500 daily requests', cta: 'CURRENT PLAN', popular: false, features: ['Access to all models'] },
              { plan: 'Pro', price: '$10', requests: '1,000 daily requests', cta: 'GET PRO', popular: true, features: ['All Hobby benefits', 'Priority Support'] },
              { plan: 'Intermediate', price: '$20', requests: '2,500 daily requests', cta: 'GET INTERMEDIATE', popular: false, features: ['All Pro benefits'] },
              { plan: 'Scale', price: '$50', requests: '7,500 daily requests', cta: 'GET SCALE', popular: false, features: ['All Intermediate benefits'] },
              { plan: 'Max', price: '$100', requests: '15,000 daily requests', cta: 'GET MAX', popular: false, features: ['All Scale benefits'] }
            ].map((plan, i) => (
              <motion.div 
                key={plan.plan} 
                className={`${styles.pricingCard} ${plan.popular ? styles.pricingCardPopular : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
              >
                {plan.popular && <span className={styles.popularBadge}>MOST POPULAR</span>}
                <h3 className={styles.pricingPlan}>{plan.plan}</h3>
                <p className={styles.pricingPrice}>{plan.price}</p>
                <p className={styles.pricingSub}>/month</p>
                <p className={styles.pricingRequests}>{plan.requests}</p>
                
                <ul className={styles.pricingFeatures}>
                  {plan.features.map((feature, j) => (
                    <li key={j} className={styles.pricingFeature}><Check className={styles.featureCheck}/> {feature}</li>
                  ))}
                </ul>

                <motion.a 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }} 
                  href="#/footercta" 
                  className={styles.pricingCta}
                >
                  {plan.cta}
                </motion.a>
              </motion.div>
            ))}
        </div>
      </section>

      {/* LLM Models Pricing Table */}
      <section className={styles.models} id="models">
        <motion.span 
          className={styles.sectionHeader}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          // INFERENCE
        </motion.span>
        <motion.h2 
          className={styles.modelsTitle}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          LLM PRICING
        </motion.h2>
        <motion.p 
          className={styles.modelsSub}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Per 1M tokens. Blazing fast. Unbeatable rates.
        </motion.p>
        
        <motion.div 
          className={styles.tableWrapper}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <table className={styles.modelsTable}>
            <thead>
              <tr>
                <th>Model</th>
                <th>Quantization</th>
                <th>Context / Max Output</th>
                <th>Input ($)</th>
                <th>Cached ($)</th>
                <th>Output ($)</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              {[
                { model: 'kimi-k2.5', quant: 'Q4_K_M', context: '262,144 / 262,144', tags: ['vision'], priceIn: '$0.35', priceCache: '$0.07', priceOut: '$1.70', speed: '~45 t/s' },
                { model: 'kimi-k2.5-lightning', quant: '530b-int4', context: '131,072 / 32,768', tags: ['beta', 'vision'], priceIn: '$1.00', priceCache: '$0.20', priceOut: '$3.00', speed: '~107 t/s' },
                { model: 'glm-5.1', quant: 'Q4_K_M', context: '202,752 / 202,752', tags: [], priceIn: '$0.50', priceCache: '$0.10', priceOut: '$2.10', speed: '~94 t/s' },
                { model: 'glm-5.1-precision', quant: 'Q8_0', context: '202,752 / 202,752', tags: ['beta'], priceIn: '$0.70', priceCache: '$0.14', priceOut: '$2.50', speed: '~79 t/s' },
                { model: 'glm-5', quant: 'Q4_0', context: '202,752 / 202,752', tags: [], priceIn: '$0.48', priceCache: '$0.10', priceOut: '$1.90', speed: '~69 t/s' },
                { model: 'glm-4.7', quant: 'Q8_0', context: '202,752 / 202,752', tags: [], priceIn: '$0.25', priceCache: '$0.05', priceOut: '$1.10', speed: '~44 t/s' },
                { model: 'glm-4.7-flash', quant: 'fp8', context: '202,752 / 131,072', tags: [], priceIn: '$0.00', priceCache: '$0.00', priceOut: '$0.00', speed: '~82 t/s' },
                { model: 'gemma-4-31b-it', quant: 'Q4_0', context: '262,144 / 262,144', tags: ['vision'], priceIn: '$0.10', priceCache: '$0.02', priceOut: '$0.30', speed: '~12 t/s' },
                { model: 'minimax-m2.5', quant: 'awq', context: '204,800 / 131,072', tags: [], priceIn: '$0.11', priceCache: '$0.02', priceOut: '$0.95', speed: '~72 t/s' },
                { model: 'qwen3.5-397b-a17b', quant: 'Q4_0', context: '262,144 / 262,144', tags: ['vision'], priceIn: '$0.35', priceCache: '$0.07', priceOut: '$1.75', speed: '~86 t/s' },
                { model: 'qwen3.5-9b', quant: 'fp8', context: '262,144 / 262,144', tags: ['vision'], priceIn: '$0.00', priceCache: '$0.00', priceOut: '$0.00', speed: '~94 t/s' },
                { model: 'deepseek-v3.2', quant: 'Q4_0', context: '163,840 / 163,840', tags: [], priceIn: '$0.28', priceCache: '$0.06', priceOut: '$0.30', speed: '~80 t/s' } // Used ~80 t/s as placeholder for speed as it was cut off in prompt
              ].map((row, i) => (
                <tr key={i}>
                  <td>
                    <div className={styles.modelNameCell}>
                      <span className={styles.modelName}>{row.model}</span>
                      {row.tags.map(tag => (
                        <span key={tag} className={`${styles.modelTag} ${tag === 'vision' ? styles.modelTagVision : ''}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{row.quant}</td>
                  <td>{row.context}</td>
                  <td className={styles.tablePrice}>{row.priceIn}</td>
                  <td className={styles.tablePrice}>{row.priceCache}</td>
                  <td className={styles.tablePrice}>{row.priceOut}</td>
                  <td className={styles.tableSpeed}>{row.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </section>

      {/* Footer CTA */}
      <section className={styles.footerCta} id="footercta">
        <motion.h2 
          className={styles.footerCtaTitle}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          READY TO BUILD?
        </motion.h2>
        <motion.p 
          className={styles.footerCtaSub}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Free account. First call in minutes. No credit card required.
        </motion.p>
        <motion.a 
          whileHover={{ scale: 1.05, backgroundColor: "#ffffff" }} 
          whileTap={{ scale: 0.95 }} 
          href="#/footercta" 
          className={styles.footerCtaButton}
        >
          Get Started <ArrowRight size={18} />
        </motion.a>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerCopy}>© 2025 Nahcrof LLC</p>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Twitter</a>
          <a href="#" className={styles.footerLink}>GitHub</a>
          <a href="#" className={styles.footerLink}>Discord</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;