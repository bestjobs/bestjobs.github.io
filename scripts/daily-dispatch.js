const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const ROOT_DIR = path.resolve(__dirname, '..');
const JOBS_FILE = path.join(ROOT_DIR, 'data', 'jobs.json');

const rawJobs = fs.readFileSync(JOBS_FILE, 'utf8');
const jobs = JSON.parse(rawJobs);

const activeJobs = jobs.filter((j) => !j.expired);
const totalActive = activeJobs.length;

const dayIndex = new Date().getDay();

const themes = [
  {
    day: 0,
    title: 'Седмичен обзор: Дългосрочни трудови тенденции и стабилност',
    focus: 'Анализ на устойчивостта на работните места, непрекъсваемост на осигурителните права и избор между държавния сектор и мултинационалните компании.'
  },
  {
    day: 1,
    title: 'Икономически барометър: Стартиране на седмицата и нови позиции',
    focus: 'Динамика на новообявените държавни конкурси, стратегически инфраструктурни проекти и търсене на кадри в публичната администрация.'
  },
  {
    day: 2,
    title: 'Евро стандарт & Заплати: Анализ на реалните доходи без сив сектор',
    focus: 'Прозрачност на възнагражденията, равни нива при заплащането и спазване на европейските директиви за доходите.'
  },
  {
    day: 3,
    title: 'Трансграничен пазар: Възможности в региона и Европа',
    focus: 'Трудова мобилност между България, съседните балкански държави, институциите на ЕС и международните хуманитарни мисии.'
  },
  {
    day: 4,
    title: 'Бяла икономика & Сигурност: Проверените работодатели',
    focus: 'Защо 100% банковото разплащане и верифицираните трудови договори гарантират дългосрочна пенсионна и социална защита.'
  },
  {
    day: 5,
    title: 'Качество на живот: 4-дневна седмица и право на изключване',
    focus: 'Баланс между професионалния и личния живот, превенция на прегарянето и модерни социални придобивки.'
  },
  {
    day: 6,
    title: 'Академичен фокус: Реализация чрез образование и специалности',
    focus: 'Връзката между университетските дипломи, научната дейност в институтите и високоплатената кариерна реализация.'
  }
];

const currentTheme = themes.find((t) => t.day === dayIndex) || themes[1];

const sampleTitles = activeJobs.slice(0, 5).map((j) => `• ${j.title_bg} (${j.company_bg}) — ${j.salary_gross}`).join('<br>');

const emailSubject = `Анализ на Ани Иванова: ${currentTheme.title}`;

const emailHtml = `
<div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#0f172a;max-width:680px;">
  <p style="font-size:0.85rem;font-weight:800;color:#0052cc;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">
    ГЛАВЕН РЕДАКТОР АНИ ИВАНОВА &bull; BESTJOBS.BG
  </p>
  <h2 style="font-size:1.35rem;color:#0f172a;margin-top:0;line-height:1.3;">
    ${currentTheme.title}
  </h2>
  <p style="font-size:1.02rem;color:#334155;">
    ${currentTheme.focus}
  </p>
  <div style="background:#f8fafc;border:1px solid #dbe2ea;border-left:4px solid #0052cc;padding:1rem;margin:1.25rem 0;border-radius:4px;">
    <strong>Ключови актуални позиции за деня (общо ${totalActive} активни в регистъра):</strong><br><br>
    ${sampleTitles}
  </div>
  <p style="font-size:0.98rem;color:#475569;">
    Всички свободни позиции в регистъра се публикуват със задължителни точни възнаграждения в евро (€), без такси за посредничество и с директно кандидатстване към официалните електронни адреси на институциите.
  </p>
  <p style="margin-top:1.5rem;">
    <a href="https://bestjobs.bg/bestjobs/bg/" target="_blank" rel="noopener noreferrer" style="background:#0052cc;color:#ffffff;text-decoration:none;font-weight:700;padding:0.6rem 1.2rem;border-radius:4px;display:inline-block;">
      Преглед на всички активни свободни позиции в BestJobs.bg &rarr;
    </a>
  </p>
  <hr style="border:none;border-top:1px solid #e2e8f0;margin:2rem 0 1rem 0;">
  <p style="font-size:0.8rem;color:#64748b;">
    Рубриката се изготвя ежедневно от Главния редактор на Националния стопански портал BestJobs.bg. Затворена мрежа: mobikom.bg &bull; dobrichnews.com &bull; dobruja.com &bull; bestjobs.bg.
  </p>
</div>
`;

async function sendDispatch() {
  const smtpPass = process.env.SENDER_MAIL_PASS;
  const toDobrich = process.env.BLOGGER_SECRET_DOBRICH;
  const toDobruja = process.env.BLOGGER_SECRET_DOBRUJA;

  if (!smtpPass || (!toDobrich && !toDobruja)) {
    console.log('Липсват настроени секрети за изпращане. Пропускане.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: 'ani@bestjobs.bg',
      pass: smtpPass
    }
  });

  const recipients = [toDobrich, toDobruja].filter(Boolean).join(',');

  const mailOptions = {
    from: '"Ани Иванова | BestJobs.bg" <ani@bestjobs.bg>',
    to: recipients,
    subject: emailSubject,
    html: emailHtml
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Статията на Ани Иванова е изпратена успешно до Blogger медиите:', info.messageId);
  } catch (error) {
    console.error('Грешка при изпращане на статията:', error);
  }
}

sendDispatch();
