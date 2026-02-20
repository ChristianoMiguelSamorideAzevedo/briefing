/* ============================================================
   BRIEFING DE PROJETO DIGITAL — script.js
   Funções:
   - Cursor personalizado
   - Partículas no canvas
   - Navegação multi-step com validação
   - Card select / radio / checkbox interativos
   - Contagem de caracteres
   - Painel de revisão dinâmico
   - Geração de PDF/texto para download
   - Toast notifications
   ============================================================ */

/* ── DOM REFERENCES ─────────────────────────────────────────── */
const cursor        = document.getElementById('cursor');
const cursorTrail   = document.getElementById('cursorTrail');
const progressBar   = document.getElementById('progressBar');
const stepsNav      = document.getElementById('stepsNav');
const stepDots      = document.querySelectorAll('.step-dot');
const formWrapper   = document.getElementById('formWrapper');
const formSteps     = document.querySelectorAll('.form-step');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const stepCounter   = document.getElementById('stepCounter');
const startBtn      = document.getElementById('startBtn');
const heroSection   = document.querySelector('.hero');
const successScreen = document.getElementById('successScreen');
const downloadBtn   = document.getElementById('downloadBtn');
const canvas        = document.getElementById('particles');
const briefingForm  = document.getElementById('briefingForm');

const TOTAL_STEPS = formSteps.length;
let currentStep   = 0;

/* ────────────────────────────────────────────────────────────
   CUSTOM CURSOR
   ─────────────────────────────────────────────────────────── */
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.14;
  trailY += (mouseY - trailY) * 0.14;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ────────────────────────────────────────────────────────────
   PARTICLE CANVAS
   ─────────────────────────────────────────────────────────── */
const ctx = canvas.getContext('2d');
const particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.r     = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '#04B3B9' : '#7B3FA0';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 90; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = '#7B3FA0';
        ctx.globalAlpha = (1 - dist / 110) * 0.12;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ────────────────────────────────────────────────────────────
   HERO → FORM TRANSITION
   ─────────────────────────────────────────────────────────── */
startBtn.addEventListener('click', () => {
  heroSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  heroSection.style.opacity = '0';
  heroSection.style.transform = 'translateY(-30px)';
  setTimeout(() => {
    heroSection.style.display = 'none';
    formWrapper.scrollIntoView({ behavior: 'smooth' });
  }, 500);
});

/* ────────────────────────────────────────────────────────────
   STEP NAVIGATION
   ─────────────────────────────────────────────────────────── */
function goToStep(step) {
  if (step < 0 || step >= TOTAL_STEPS) return;

  formSteps[currentStep].classList.remove('active');
  stepDots[currentStep].classList.remove('active');
  stepDots[currentStep].classList.add('done');

  currentStep = step;
  formSteps[currentStep].classList.add('active');
  stepDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentStep);
    dot.classList.toggle('done', i < currentStep);
  });

  // Progress bar
  const pct = (currentStep / (TOTAL_STEPS - 1)) * 100;
  progressBar.style.width = pct + '%';

  // Counter
  stepCounter.textContent = `${currentStep + 1} / ${TOTAL_STEPS}`;

  // Buttons
  prevBtn.disabled = currentStep === 0;
  nextBtn.textContent = '';
  if (currentStep === TOTAL_STEPS - 1) {
    nextBtn.innerHTML = `Enviar Briefing <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/></svg>`;
    buildReviewPanel();
  } else {
    nextBtn.innerHTML = `Próximo <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  }

  formWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

prevBtn.addEventListener('click', () => goToStep(currentStep - 1));

nextBtn.addEventListener('click', () => {
  if (currentStep === TOTAL_STEPS - 1) {
    submitForm();
  } else {
    if (validateStep(currentStep)) {
      goToStep(currentStep + 1);
    }
  }
});

stepDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    if (i <= currentStep || dot.classList.contains('done')) {
      goToStep(i);
    }
  });
});

/* ────────────────────────────────────────────────────────────
   VALIDATION
   ─────────────────────────────────────────────────────────── */
function validateStep(step) {
  const section = formSteps[step];
  const required = section.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.classList.remove('error');
    const val = field.value.trim();
    if (!val) {
      field.classList.add('error');
      valid = false;
      field.addEventListener('input', () => field.classList.remove('error'), { once: true });
    }
  });

  // Step 1: tipo de projeto required
  if (step === 1) {
    const tipoProjeto = document.getElementById('tipoProjeto');
    if (!tipoProjeto.value) {
      showToast('Selecione o tipo de projeto', 'error');
      valid = false;
    }
  }

  // Step 5: budget required
  if (step === 5) {
    const orcamento = document.getElementById('orcamento');
    if (!orcamento.value) {
      showToast('Selecione uma faixa de investimento', 'error');
      valid = false;
    }
  }

  if (!valid && step !== 1 && step !== 5) {
    showToast('Preencha os campos obrigatórios (*)', 'error');
  }

  return valid;
}

/* ────────────────────────────────────────────────────────────
   CARD SELECT (tipo de projeto)
   ─────────────────────────────────────────────────────────── */
document.querySelectorAll('#tipoProjetoSelect .card-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#tipoProjetoSelect .card-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('tipoProjeto').value = btn.dataset.value;
  });
});

/* ────────────────────────────────────────────────────────────
   STYLE GRID (visual style select)
   ─────────────────────────────────────────────────────────── */
document.querySelectorAll('#styleGrid .style-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#styleGrid .style-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('estiloVisual').value = btn.dataset.value;
  });
});

/* ────────────────────────────────────────────────────────────
   BUDGET SELECT
   ─────────────────────────────────────────────────────────── */
document.querySelectorAll('#budgetGrid .budget-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#budgetGrid .budget-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('orcamento').value = btn.dataset.value;
  });
});

/* ────────────────────────────────────────────────────────────
   CHAR COUNTER
   ─────────────────────────────────────────────────────────── */
function setupCharCounter(textareaId, counterId, max) {
  const ta  = document.getElementById(textareaId);
  const cnt = document.getElementById(counterId);
  if (!ta || !cnt) return;
  ta.addEventListener('input', () => {
    const len = ta.value.length;
    cnt.textContent = `${len} / ${max}`;
    cnt.style.color = len > max * 0.9 ? '#FF6B8A' : 'var(--text-muted)';
    if (len > max) ta.value = ta.value.slice(0, max);
  });
}

setupCharCounter('descricaoEmpresa', 'descEmpresaCount', 500);

/* ────────────────────────────────────────────────────────────
   COLLECT FORM DATA
   ─────────────────────────────────────────────────────────── */
function collectData() {
  const fd = new FormData(briefingForm);
  const data = {};

  // Simple fields
  [
    'razaoSocial','nomeFantasia','segmento','siteAtual',
    'responsavel','cargo','email','whatsapp','descricaoEmpresa',
    'tipoProjeto','objetivoPrincipal','problemaAtual','prazoDesejado','dataImportante',
    'perfilPublico','doresPublico','nivelTech','concorrentes','referencias',
    'coresMarca','fontesMarca','estiloVisual','restricoesDesign',
    'outrasFeatures','integracoes','tecnologiaPreferida',
    'orcamento','modeloContratacao','infoAdicionais'
  ].forEach(key => { data[key] = fd.get(key) || ''; });

  // Checkboxes (arrays)
  ['dispositivos','ativos','features','marketing'].forEach(key => {
    data[key] = fd.getAll(key);
  });

  return data;
}

/* ────────────────────────────────────────────────────────────
   REVIEW PANEL
   ─────────────────────────────────────────────────────────── */
const LABELS = {
  razaoSocial:          'Razão Social',
  nomeFantasia:         'Nome Fantasia',
  segmento:             'Segmento',
  siteAtual:            'Site Atual',
  responsavel:          'Responsável',
  cargo:                'Cargo',
  email:                'E-mail',
  whatsapp:             'WhatsApp',
  descricaoEmpresa:     'Sobre a Empresa',
  tipoProjeto:          'Tipo de Projeto',
  objetivoPrincipal:    'Objetivo Principal',
  problemaAtual:        'Problema Atual',
  prazoDesejado:        'Prazo Desejado',
  perfilPublico:        'Perfil do Público',
  nivelTech:            'Nível Tech',
  dispositivos:         'Dispositivos',
  coresMarca:           'Cores da Marca',
  estiloVisual:         'Estilo Visual',
  features:             'Funcionalidades',
  tecnologiaPreferida:  'Tecnologia',
  orcamento:            'Orçamento',
  modeloContratacao:    'Modelo Contratação',
  marketing:            'Marketing Digital',
  infoAdicionais:       'Info Adicionais',
};

function buildReviewPanel() {
  const panel = document.getElementById('reviewPanel');
  const d     = collectData();

  const sections = [
    {
      title: '🏢 Empresa',
      keys: ['razaoSocial','nomeFantasia','segmento','responsavel','email','whatsapp','siteAtual','descricaoEmpresa']
    },
    {
      title: '🎯 Projeto',
      keys: ['tipoProjeto','objetivoPrincipal','problemaAtual','prazoDesejado']
    },
    {
      title: '👥 Público',
      keys: ['perfilPublico','nivelTech','dispositivos','concorrentes','referencias']
    },
    {
      title: '🎨 Design',
      keys: ['coresMarca','estiloVisual','ativos','restricoesDesign']
    },
    {
      title: '⚙️ Funcionalidades',
      keys: ['features','outrasFeatures','integracoes','tecnologiaPreferida']
    },
    {
      title: '💰 Orçamento',
      keys: ['orcamento','modeloContratacao','marketing','infoAdicionais']
    }
  ];

  panel.innerHTML = sections.map(sec => {
    const items = sec.keys
      .map(key => {
        const val = d[key];
        const display = Array.isArray(val)
          ? (val.length ? val.join(', ') : '—')
          : (val || '—');
        const label = LABELS[key] || key;
        return `
          <div class="review-item">
            <span class="review-item__label">${label}</span>
            <span class="review-item__value">${display}</span>
          </div>`;
      }).join('');

    return `
      <div class="review-section">
        <div class="review-section__title">${sec.title}</div>
        ${items}
      </div>`;
  }).join('');
}

/* ────────────────────────────────────────────────────────────
   SUBMIT FORM
   ─────────────────────────────────────────────────────────── */
function submitForm() {
  const confirma = document.getElementById('confirmaEnvio');
  if (!confirma.checked) {
    showToast('Confirme o envio marcando a caixa de confirmação', 'error');
    return;
  }

  // Save to localStorage
  const data = collectData();
  data.submittedAt = new Date().toISOString();
  localStorage.setItem('briefing_data', JSON.stringify(data));

  // Animate submit button
  nextBtn.innerHTML = `<span style="animation:pulse 1s infinite">Enviando...</span>`;
  nextBtn.disabled = true;

  setTimeout(() => {
    showSuccessScreen();
  }, 1200);
}

/* ────────────────────────────────────────────────────────────
   SUCCESS SCREEN
   ─────────────────────────────────────────────────────────── */
function showSuccessScreen() {
  successScreen.setAttribute('aria-hidden', 'false');
  successScreen.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

/* ────────────────────────────────────────────────────────────
   DOWNLOAD SUMMARY (texto simples)
   ─────────────────────────────────────────────────────────── */
downloadBtn.addEventListener('click', () => {
  const raw = localStorage.getItem('briefing_data');
  if (!raw) return;
  const d = JSON.parse(raw);
  const date = new Date(d.submittedAt).toLocaleDateString('pt-BR', {
    day:'2-digit', month:'long', year:'numeric'
  });

  const lines = [
    '══════════════════════════════════════════════',
    '       BRIEFING DE PROJETO DIGITAL',
    `       Enviado em: ${date}`,
    '══════════════════════════════════════════════',
    '',
    '▌ EMPRESA',
    `  Razão Social:       ${d.razaoSocial || '—'}`,
    `  Nome Fantasia:      ${d.nomeFantasia || '—'}`,
    `  Segmento:           ${d.segmento || '—'}`,
    `  Responsável:        ${d.responsavel || '—'}`,
    `  Cargo:              ${d.cargo || '—'}`,
    `  E-mail:             ${d.email || '—'}`,
    `  WhatsApp:           ${d.whatsapp || '—'}`,
    `  Site Atual:         ${d.siteAtual || '—'}`,
    '',
    '  Sobre a Empresa:',
    `  ${d.descricaoEmpresa || '—'}`,
    '',
    '▌ PROJETO',
    `  Tipo:               ${d.tipoProjeto || '—'}`,
    `  Objetivo:           ${d.objetivoPrincipal || '—'}`,
    `  Problema:           ${d.problemaAtual || '—'}`,
    `  Prazo Desejado:     ${d.prazoDesejado || '—'}`,
    '',
    '▌ PÚBLICO-ALVO',
    `  Perfil:             ${d.perfilPublico || '—'}`,
    `  Nível Tech:         ${d.nivelTech || '—'}`,
    `  Dispositivos:       ${(d.dispositivos || []).join(', ') || '—'}`,
    `  Concorrentes:       ${d.concorrentes || '—'}`,
    `  Referências:        ${d.referencias || '—'}`,
    '',
    '▌ DESIGN',
    `  Cores da Marca:     ${d.coresMarca || '—'}`,
    `  Estilo Visual:      ${d.estiloVisual || '—'}`,
    `  Ativos:             ${(d.ativos || []).join(', ') || '—'}`,
    `  Restrições:         ${d.restricoesDesign || '—'}`,
    '',
    '▌ FUNCIONALIDADES',
    `  Features:           ${(d.features || []).join(', ') || '—'}`,
    `  Outras:             ${d.outrasFeatures || '—'}`,
    `  Integrações:        ${d.integracoes || '—'}`,
    `  Tecnologia:         ${d.tecnologiaPreferida || '—'}`,
    '',
    '▌ ORÇAMENTO & CRONOGRAMA',
    `  Faixa:              ${d.orcamento || '—'}`,
    `  Modelo:             ${d.modeloContratacao || '—'}`,
    `  Marketing:          ${(d.marketing || []).join(', ') || '—'}`,
    '',
    '▌ INFO ADICIONAIS',
    `  ${d.infoAdicionais || '—'}`,
    '',
    '══════════════════════════════════════════════',
  ];

  const content = lines.join('\n');
  const blob    = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href        = url;
  a.download    = `briefing-${(d.razaoSocial || 'projeto').toLowerCase().replace(/\s+/g,'-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

/* ────────────────────────────────────────────────────────────
   TOAST NOTIFICATION
   ─────────────────────────────────────────────────────────── */
let toastTimeout;

function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  clearTimeout(toastTimeout);
  // Force reflow
  void toast.offsetWidth;
  toast.classList.add('show');

  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ────────────────────────────────────────────────────────────
   KEYBOARD NAVIGATION
   ─────────────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
    if (document.activeElement.closest('.form-step')) {
      nextBtn.click();
    }
  }
  if (e.key === 'ArrowLeft' && document.activeElement.closest('.form-step')) {
    prevBtn.click();
  }
});

/* ────────────────────────────────────────────────────────────
   INPUT ANIMATIONS (focus glow on labels)
   ─────────────────────────────────────────────────────────── */
document.querySelectorAll('input, textarea, select').forEach(el => {
  el.addEventListener('focus', () => {
    const label = el.closest('.form-group')?.querySelector('label');
    if (label) label.style.color = 'var(--teal)';
  });
  el.addEventListener('blur', () => {
    const label = el.closest('.form-group')?.querySelector('label');
    if (label) label.style.color = '';
  });
});

/* ────────────────────────────────────────────────────────────
   WHATSAPP MASK
   ─────────────────────────────────────────────────────────── */
document.getElementById('whatsapp').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d*)$/, '($1) $2');
  }
  this.value = v;
});

/* ────────────────────────────────────────────────────────────
   INIT — show form wrapper hidden until hero scroll
   ─────────────────────────────────────────────────────────── */
(function init() {
  formWrapper.style.display = 'none';

  startBtn.addEventListener('click', () => {
    setTimeout(() => {
      formWrapper.style.display = '';
      formWrapper.style.opacity = '0';
      formWrapper.style.transform = 'translateY(30px)';
      formWrapper.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          formWrapper.style.opacity = '1';
          formWrapper.style.transform = 'translateY(0)';
        });
      });
    }, 500);
  });

  // Init step counter
  stepCounter.textContent = `1 / ${TOTAL_STEPS}`;
})();

/* ────────────────────────────────────────────────────────────
   THEME TOGGLE — claro / escuro
   Persiste a preferência no localStorage.
   ─────────────────────────────────────────────────────────── */
/* Atualiza as cores das partículas do canvas conforme o tema */
function updateParticleColors(theme) {
  if (!particles || !particles.length) return;
  particles.forEach(p => {
    if (theme === 'dark') {
      p.color = Math.random() > 0.5 ? '#22D3DA' : '#A855F7';
    } else {
      p.color = Math.random() > 0.6 ? '#0097A7' : '#9B59C4';
    }
  });
}

(function initTheme() {
  const html        = document.documentElement;
  const toggleBtn   = document.getElementById('themeToggle');
  const themeLabel  = document.getElementById('themeLabel');

  // Lê preferência salva ou usa preferência do sistema
  const saved = localStorage.getItem('briefing_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('briefing_theme', theme);

    if (themeLabel) {
      themeLabel.textContent = theme === 'dark' ? 'Claro' : 'Escuro';
    }

    // Atualiza cor das partículas para combinar com o tema
    updateParticleColors(theme);
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);

    // Atalho de teclado: Alt + T
    document.addEventListener('keydown', e => {
      if (e.altKey && e.key === 't') toggleTheme();
    });
  }

  // Aplica tema inicial sem transição (evita flash)
  html.style.transition = 'none';
  applyTheme(initialTheme);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      html.style.transition = '';
    });
  });
})();

