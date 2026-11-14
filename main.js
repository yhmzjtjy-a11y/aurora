// AURORA 高级网站 - 交互脚本
// 加载动画
const loader = {
  el: document.querySelector('.loader'),
  init() {
    window.addEventListener('load', () => this.hide());
    setTimeout(() => this.hide(), 3000);
  },
  hide() {
    if (this.el) {
      this.el.style.animation = 'fadeOut 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0s forwards';
      setTimeout(() => this.el?.remove(), 800);
    }
  }
};

// 自定义光标 - 增强版
const cursor = {
  dot: document.getElementById('cursorDot'),
  ring: document.getElementById('cursorRing'),
  x: 0, y: 0, targetX: 0, targetY: 0,
  init() {
    document.addEventListener('mousemove', (e) => {
      if (e.clientX === 0 && e.clientY === 0) return;
      document.body.classList.add('has-pointer');
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    });
    document.addEventListener('mouseover', (e) => this.updateCursor(e));
    document.addEventListener('mouseout', () => this.resetCursor());
    this.animate();
  },
  updateCursor(e) {
    const type = e.target.getAttribute('data-cursor');
    this.ring.classList.remove('is-hover', 'is-text');
    if (type === 'link' || type === 'view') {
      this.ring.classList.add('is-hover');
      this.dot.classList.add('is-hover');
    } else if (type === 'text') {
      this.ring.classList.add('is-text');
    }
  },
  resetCursor() {
    this.ring.classList.remove('is-hover', 'is-text');
    this.dot.classList.remove('is-hover');
  },
  animate() {
    this.x += (this.targetX - this.x) * 0.18;
    this.y += (this.targetY - this.y) * 0.18;
    this.dot.style.left = this.x + 'px';
    this.dot.style.top = this.y + 'px';
    this.ring.style.left = this.x + 'px';
    this.ring.style.top = this.y + 'px';
    requestAnimationFrame(() => this.animate());
  }
};

// 高级粒子系统 - 带碰撞和鼠标吸附
const particles = {
  canvas: document.getElementById('cosmos'),
  ctx: null,
  particles: [],
  mouseX: window.innerWidth / 2,
  mouseY: window.innerHeight / 2,
  init() {
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    
    for (let i = 0; i < 200; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 2.5,
        opacity: Math.random() * 0.6 + 0.2,
        baseOpacity: Math.random() * 0.6 + 0.2,
        mass: Math.random() * 0.5 + 0.5
      });
    }
    this.animate();
  },
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      // 边界检测
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // 鼠标吸附
      const dx = this.mouseX - p.x;
      const dy = this.mouseY - p.y;
      const dist = Math.hypot(dx, dy);
      
      if (dist < 180) {
        p.opacity = Math.min(p.baseOpacity + (1 - dist / 180) * 0.5, 1);
        p.vx += (dx / dist) * 0.02;
        p.vy += (dy / dist) * 0.02;
      } else {
        p.opacity = p.baseOpacity;
      }

      // 绘制粒子
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = '#7c6cff';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();

      // 连线 - 优化算法
      for (let j = i + 1; j < Math.min(i + 12, this.particles.length); j++) {
        const p2 = this.particles[j];
        const d = Math.hypot(p2.x - p.x, p2.y - p.y);
        if (d < 140 && d > 0) {
          const alpha = (1 - d / 140) * 0.15;
          this.ctx.globalAlpha = alpha;
          this.ctx.strokeStyle = '#7c6cff';
          this.ctx.lineWidth = 0.9;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    });
    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
};

// 导航
const nav = {
  nav: document.getElementById('nav'),
  burger: document.getElementById('burger'),
  navLinks: document.getElementById('navLinks'),
  init() {
    window.addEventListener('scroll', () => {
      this.nav.classList.toggle('is-scrolled', window.scrollY > 80);
    });
    this.burger.addEventListener('click', () => {
      this.burger.classList.toggle('is-open');
      this.navLinks.classList.toggle('is-open');
    });
    this.navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.burger.classList.remove('is-open');
        this.navLinks.classList.remove('is-open');
      });
    });
  }
};

// 磁性按钮
const magnetic = {
  elements: document.querySelectorAll('.magnetic'),
  init() {
    this.elements.forEach(el => {
      el.addEventListener('mousemove', (e) => this.pull(e, el));
      el.addEventListener('mouseout', () => this.release(el));
    });
  },
  pull(e, el) {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.32;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.32;
    el.style.transform = `translate(${x}px, ${y}px)`;
  },
  release(el) {
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    el.style.transform = 'translate(0, 0)';
    setTimeout(() => { el.style.transition = ''; }, 500);
  }
};

// 3D 卡片倾斜
const tilt = {
  cards: document.querySelectorAll('.tilt'),
  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => this.tilt(e, card));
      card.addEventListener('mouseout', () => this.reset(card));
    });
  },
  tilt(e, card) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientY - rect.top) / rect.height - 0.5;
    const y = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${mouseX}%`);
    card.style.setProperty('--mouse-y', `${mouseY}%`);
    card.style.transform = `perspective(1400px) rotateX(${x * 16}deg) rotateY(${y * -16}deg) translateZ(20px) scale(1.02)`;
  },
  reset(card) {
    card.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.transform = 'perspective(1400px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
    setTimeout(() => { card.style.transition = ''; }, 700);
  }
};

// 滚动显现与文字拆分
const reveal = {
  elements: document.querySelectorAll('.reveal, .split-text'),
  observer: null,
  init() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          if (entry.target.classList.contains('split-text')) {
            this.splitText(entry.target);
          }
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
    this.elements.forEach(el => this.observer.observe(el));
  },
  splitText(el) {
    const text = el.textContent;
    el.innerHTML = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = (i * 0.03) + 's';
      el.appendChild(span);
    });
  }
};

// 数字计数
const counter = {
  stats: document.querySelectorAll('.stat__value'),
  observer: null,
  init() {
    const options = { threshold: 0.7 };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          this.count(entry.target);
          entry.target.classList.add('counted');
        }
      });
    }, options);
    this.stats.forEach(stat => this.observer.observe(stat));
  },
  count(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2400;
    const startTime = Date.now();
    const easeOut = t => 1 - Math.pow(1 - t, 4);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(target * easeOut(progress));
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(animate);
      else el.textContent = target;
    };
    animate();
  }
};

// 表单
const form = {
  form: document.getElementById('contactForm'),
  toast: document.getElementById('toast'),
  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.submit(e));
    }
  },
  submit(e) {
    e.preventDefault();
    const btn = this.form.querySelector('button');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = '✓ 发送中...';
    setTimeout(() => {
      this.form.reset();
      btn.textContent = originalText;
      btn.disabled = false;
      this.showToast();
    }, 1200);
  },
  showToast() {
    this.toast.classList.add('is-visible');
    setTimeout(() => {
      this.toast.classList.remove('is-visible');
    }, 4500);
  }
};

// 回到顶部
const toTop = {
  btn: document.getElementById('toTop'),
  init() {
    if (this.btn) {
      this.btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
};

// 页面进度与活动导航
const scrollExperience = {
  meter: document.getElementById('scrollMeter'),
  navLinks: Array.from(document.querySelectorAll('.nav__links a')),
  framePending: false,

  init() {
    const sections = this.navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        this.navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
    window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
    this.updateProgress();
  },

  updateProgress() {
    if (this.framePending) return;

    this.framePending = true;
    requestAnimationFrame(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;
      this.meter.style.transform = `scaleX(${progress})`;
      this.framePending = false;
    });
  }
};

// Hero 视觉装置的轻量指针视差
const heroStage = {
  hero: document.getElementById('hero'),
  art: document.getElementById('heroArt'),

  init() {
    if (!this.hero || !this.art || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.hero.addEventListener('pointermove', (event) => this.move(event));
    this.hero.addEventListener('pointerleave', () => this.reset());
  },

  move(event) {
    const rect = this.hero.getBoundingClientRect();
    const horizontal = (event.clientX - rect.left) / rect.width - 0.5;
    const vertical = (event.clientY - rect.top) / rect.height - 0.5;

    this.art.style.setProperty('--art-x', `${horizontal * -24}px`);
    this.art.style.setProperty('--art-y', `${vertical * -20}px`);
    this.art.style.setProperty('--art-rx', `${vertical * -5}deg`);
    this.art.style.setProperty('--art-ry', `${horizontal * 7}deg`);
  },

  reset() {
    this.art.style.setProperty('--art-x', '0px');
    this.art.style.setProperty('--art-y', '0px');
    this.art.style.setProperty('--art-rx', '0deg');
    this.art.style.setProperty('--art-ry', '0deg');
  }
};

// 作品案例面板
const caseStudies = {
  dialog: document.getElementById('caseDialog'),
  closeButton: document.getElementById('caseClose'),
  closeLink: document.getElementById('caseCloseLink'),
  title: document.getElementById('caseTitle'),
  kicker: document.getElementById('caseKicker'),
  description: document.getElementById('caseDescription'),
  metrics: document.getElementById('caseMetrics'),
  services: document.getElementById('caseServices'),
  activeTrigger: null,
  data: {
    nebula: {
      title: 'NEBULA 旗舰店',
      kicker: 'WebGL · Commerce experience',
      description: '把产品浏览转化为一场漂浮在零重力空间里的探索。视觉系统由细腻的材质、微交互和丝滑的章节过渡构成。',
      primary: '#7c6cff',
      secondary: '#a99cff',
      metrics: [['+240%', '转化提升'], ['1.8s', '首屏 LCP'], ['48fps', '3D 交互']],
      services: ['创意方向', 'WebGL', '电商体验', '动效系统']
    },
    pulse: {
      title: 'PULSE 实时大屏',
      kicker: 'Data · Real-time system',
      description: '让复杂数据像呼吸一样清晰。我们建立了低延迟视觉语言，让操作者能在高压决策中立即识别信号与风险。',
      primary: '#20bfa5',
      secondary: '#90f5df',
      metrics: [['<16ms', '数据延迟'], ['1M+', '日均数据点'], ['24/7', '稳定运行']],
      services: ['数据叙事', '信息架构', '实时可视化', '设计系统']
    },
    halo: {
      title: 'HALO 咖啡实验室',
      kicker: 'Brand · Editorial storytelling',
      description: '将一杯咖啡的香气翻译成有温度的数字旅程。长滚动叙事串起产地、风味和人物，让品牌气质在细节中慢慢浮现。',
      primary: '#ef6cac',
      secondary: '#ffd1e5',
      metrics: [['3', '国际设计奖'], ['4.7×', '停留时长'], ['91%', '移动端完成率']],
      services: ['品牌叙事', '艺术指导', '滚动体验', '内容策略']
    },
    flora: {
      title: 'FLORA 数字花园',
      kicker: 'Generative art · Participation',
      description: '每一次点击都生长出独一无二的数字花卉。算法驱动的开放画布让观众成为共同创作者，作品在互动中持续演化。',
      primary: '#5a8bff',
      secondary: '#c7e6ff',
      metrics: [['100K+', '在线互动'], ['32K', '生成作品'], ['7', '展览城市']],
      services: ['生成设计', '创意编程', '互动装置', '展览体验']
    }
  },

  init() {
    if (!this.dialog) return;

    document.querySelectorAll('.case-trigger').forEach((trigger) => {
      trigger.addEventListener('click', () => this.open(trigger.dataset.case, trigger));
    });

    this.closeButton.addEventListener('click', () => this.dialog.close());
    this.closeLink.addEventListener('click', () => this.dialog.close());
    this.dialog.addEventListener('click', (event) => {
      if (event.target === this.dialog) this.dialog.close();
    });
    this.dialog.addEventListener('close', () => this.restoreFocus());
  },

  open(caseId, trigger) {
    const item = this.data[caseId];
    if (!item) return;

    this.activeTrigger = trigger;
    this.dialog.dataset.case = caseId;
    this.dialog.style.setProperty('--case-primary', item.primary);
    this.dialog.style.setProperty('--case-secondary', item.secondary);
    this.kicker.textContent = item.kicker;
    this.title.textContent = item.title;
    this.description.textContent = item.description;
    this.renderMetrics(item.metrics);
    this.renderServices(item.services);
    document.body.classList.add('is-dialog-open');

    if (!this.dialog.open) this.dialog.showModal();
    window.requestAnimationFrame(() => this.closeButton.focus({ preventScroll: true }));
  },

  renderMetrics(metrics) {
    this.metrics.replaceChildren();
    metrics.forEach(([value, label]) => {
      const item = document.createElement('div');
      item.className = 'case-dialog__metric';
      const strong = document.createElement('strong');
      const span = document.createElement('span');
      strong.textContent = value;
      span.textContent = label;
      item.append(strong, span);
      this.metrics.append(item);
    });
  },

  renderServices(services) {
    this.services.replaceChildren();
    services.forEach((service) => {
      const item = document.createElement('li');
      item.textContent = service;
      this.services.append(item);
    });
  },

  restoreFocus() {
    document.body.classList.remove('is-dialog-open');
    this.activeTrigger?.focus({ preventScroll: true });
    this.activeTrigger = null;
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  loader.init();
  cursor.init();
  particles.init();
  nav.init();
  magnetic.init();
  tilt.init();
  reveal.init();
  counter.init();
  form.init();
  toTop.init();
  scrollExperience.init();
  heroStage.init();
  caseStudies.init();
});

// 键盘快捷键
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    burger?.classList.remove('is-open');
    navLinks?.classList.remove('is-open');
  }
});

// 性能监控
if (window.requestIdleCallback) {
  window.requestIdleCallback(() => {
    console.log('⚡ AURORA 完全加载 - 所有交互已启用');
  });
}
